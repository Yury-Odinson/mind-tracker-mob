import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { getMoodById, getMoodByName } from "@/constants/moods";
import useAuth from "@/store/auth";
import {
	CreateMoodRequestDTO,
	DeleteMoodRequestDTO,
	GetMoodRequestDTO,
	MoodImportEntryDTO,
	MoodResponseDTO,
	UpdateMoodRequestDTO,
	UserMoodDTO,
} from "@/types/DTO";

import { apiCreateMood } from "@/api/moods/create";
import { apiDeleteMood } from "@/api/moods/delete";
import { apiGetMood } from "@/api/moods/get";
import { apiUpdateMood } from "@/api/moods/update";

const GUEST_MOODS_KEY = "guest_moods_v1";
const DEFAULT_GUEST_MOOD_COLOR = "#94A3B8";
const DEFAULT_GUEST_MOOD_NAME = "Эмоция";

type StoredUserMoodV2 = {
	clientEntryId: string;
	moodId: number;
	note: string;
	createdAt: string;
	updatedAt: string;
};

type StoredUserMoodV1 = {
	id: string;
	moodName: string;
	note: string;
	created_at: string;
	updated_at: string;
};

type CreateMoodRepositoryInput = CreateMoodRequestDTO;
type UpdateMoodRepositoryInput = UpdateMoodRequestDTO;
type DeleteMoodRepositoryInput = DeleteMoodRequestDTO;
type RepositoryRequestError = Error & { status?: number };

function createRepositoryRequestError(message: string, status: number): RepositoryRequestError {
	const error = new Error(message) as RepositoryRequestError;
	error.status = status;
	return error;
}

function isStoredUserMoodV2(value: unknown): value is StoredUserMoodV2 {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return (
		"clientEntryId" in value &&
		"moodId" in value &&
		"note" in value &&
		"createdAt" in value &&
		"updatedAt" in value &&
		typeof value.clientEntryId === "string" &&
		typeof value.moodId === "number" &&
		typeof value.note === "string" &&
		typeof value.createdAt === "string" &&
		typeof value.updatedAt === "string"
	);
}

function isStoredUserMoodV1(value: unknown): value is StoredUserMoodV1 {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return (
		"id" in value &&
		"moodName" in value &&
		"note" in value &&
		"created_at" in value &&
		"updated_at" in value &&
		typeof value.id === "string" &&
		typeof value.moodName === "string" &&
		typeof value.note === "string" &&
		typeof value.created_at === "string" &&
		typeof value.updated_at === "string"
	);
}

function toDate(value: string): Date {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? new Date() : date;
}

function toStoredUserMood(value: UserMoodDTO): StoredUserMoodV2 {
	return {
		...value,
		createdAt: value.createdAt.toISOString(),
		updatedAt: value.updatedAt.toISOString(),
	};
}

function toUserMoodV2(value: StoredUserMoodV2): UserMoodDTO {
	return {
		...value,
		createdAt: toDate(value.createdAt),
		updatedAt: toDate(value.updatedAt),
	};
}

function toUserMoodFromLegacy(value: StoredUserMoodV1): UserMoodDTO | null {
	const mood = getMoodByName(value.moodName);
	if (!mood) {
		return null;
	}

	return {
		clientEntryId: value.id,
		moodId: mood.id,
		note: value.note,
		createdAt: toDate(value.created_at),
		updatedAt: toDate(value.updated_at),
	};
}

function createLocalMoodId(): string {
	const randomPart = Math.random().toString(36).slice(2, 10);
	return `mood_${Date.now()}_${randomPart}`;
}

function sortGuestMoodsDesc(items: UserMoodDTO[]): UserMoodDTO[] {
	return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

async function readGuestMoodsStorage(): Promise<string | null> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return null;
		}

		return window.localStorage.getItem(GUEST_MOODS_KEY);
	}

	try {
		return await AsyncStorage.getItem(GUEST_MOODS_KEY);
	} catch (asyncStorageError) {
		try {
			const fallbackValue = await SecureStore.getItemAsync(GUEST_MOODS_KEY);
			if (__DEV__) {
				console.warn("[mood.repository] AsyncStorage read failed, used SecureStore fallback", asyncStorageError);
			}
			return fallbackValue;
		} catch {
			return null;
		}
	}
}

async function writeGuestMoodsStorage(value: string): Promise<void> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}

		window.localStorage.setItem(GUEST_MOODS_KEY, value);
		return;
	}

	try {
		await AsyncStorage.setItem(GUEST_MOODS_KEY, value);
	} catch (asyncStorageError) {
		try {
			await SecureStore.setItemAsync(GUEST_MOODS_KEY, value);
			if (__DEV__) {
				console.warn("[mood.repository] AsyncStorage write failed, used SecureStore fallback", asyncStorageError);
			}
		} catch {
			throw new Error("Guest storage unavailable");
		}
	}
}

async function clearGuestMoodsStorage(): Promise<void> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}

		window.localStorage.removeItem(GUEST_MOODS_KEY);
		return;
	}

	await Promise.allSettled([
		AsyncStorage.removeItem(GUEST_MOODS_KEY),
		SecureStore.deleteItemAsync(GUEST_MOODS_KEY),
	]);
}

async function getGuestMoods(): Promise<UserMoodDTO[]> {
	try {
		const rawData = await readGuestMoodsStorage();
		if (!rawData) {
			return [];
		}

		const parsedData: unknown = JSON.parse(rawData);
		if (!Array.isArray(parsedData)) {
			return [];
		}

		let hasLegacyFormat = false;
		const normalized = parsedData
			.map((item) => {
				if (isStoredUserMoodV2(item)) {
					return toUserMoodV2(item);
				}

				if (isStoredUserMoodV1(item)) {
					hasLegacyFormat = true;
					return toUserMoodFromLegacy(item);
				}

				return null;
			})
			.filter((item): item is UserMoodDTO => item !== null);

		const sorted = sortGuestMoodsDesc(normalized);

		if (hasLegacyFormat) {
			await saveGuestMoods(sorted);
		}

		return sorted;
	} catch {
		return [];
	}
}

async function saveGuestMoods(data: UserMoodDTO[]): Promise<void> {
	const payload = JSON.stringify(data.map(toStoredUserMood));
	await writeGuestMoodsStorage(payload);
}

function isAuthSession(): boolean {
	const { status, isAuthenticated, accessToken } = useAuth.getState();
	return status === "auth" && isAuthenticated && Boolean(accessToken);
}

async function createGuestMood(input: CreateMoodRepositoryInput): Promise<number> {
	if (!Number.isInteger(input.moodId) || input.moodId <= 0) {
		throw new Error("Mood id is required for guest mood");
	}

	const now = new Date();
	const nextEntry: UserMoodDTO = {
		clientEntryId: createLocalMoodId(),
		moodId: input.moodId,
		note: input.note.trim(),
		createdAt: now,
		updatedAt: now,
	};

	const currentMoods = await getGuestMoods();
	await saveGuestMoods([nextEntry, ...currentMoods]);
	return 200;
}

function getGuestMoodIndexByEntryId(entryId: number, total: number): number {
	if (!Number.isInteger(entryId) || entryId <= 0) {
		return -1;
	}

	const index = entryId - 1;
	if (index >= total) {
		return -1;
	}

	return index;
}

async function updateGuestMood({ entryId, moodId, note }: UpdateMoodRepositoryInput): Promise<number> {
	const currentMoods = await getGuestMoods();
	const targetIndex = getGuestMoodIndexByEntryId(entryId, currentMoods.length);

	if (targetIndex < 0) {
		throw createRepositoryRequestError(`PATCH /api/mood/${entryId} failed: 404`, 404);
	}

	const targetMood = currentMoods[targetIndex];
	const nextMoodId = typeof moodId === "number" ? moodId : targetMood.moodId;
	const nextNote = typeof note === "string" ? note.trim() : targetMood.note;

	if (!Number.isInteger(nextMoodId) || nextMoodId <= 0) {
		throw new Error("Mood id is required for guest mood");
	}

	const nextMoods = [...currentMoods];
	nextMoods[targetIndex] = {
		...targetMood,
		moodId: nextMoodId,
		note: nextNote,
		updatedAt: new Date(),
	};

	await saveGuestMoods(nextMoods);
	return 200;
}

async function deleteGuestMood({ entryId }: DeleteMoodRepositoryInput): Promise<number> {
	const currentMoods = await getGuestMoods();
	const targetIndex = getGuestMoodIndexByEntryId(entryId, currentMoods.length);

	if (targetIndex < 0) {
		throw createRepositoryRequestError(`DELETE /api/mood/${entryId} failed: 404`, 404);
	}

	const nextMoods = currentMoods.filter((_, index) => index !== targetIndex);
	await saveGuestMoods(nextMoods);
	return 200;
}

async function getGuestMoodList({ page = 1, limit = 20 }: GetMoodRequestDTO): Promise<MoodResponseDTO> {
	const moods = await getGuestMoods();
	const safeLimit = limit > 0 ? limit : 20;
	const total = moods.length;
	const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
	const currentPage = totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);

	if (total === 0) {
		return {
			data: [],
			total,
			currentPage,
			totalPages,
		};
	}

	const offset = (currentPage - 1) * safeLimit;
	const pageSlice = moods.slice(offset, offset + safeLimit);
	const data = pageSlice.map((item, index) => ({
		id: offset + index + 1,
		moodId: item.moodId,
		moodName: getMoodById(item.moodId)?.name ?? `${DEFAULT_GUEST_MOOD_NAME} #${item.moodId}`,
		color: getMoodById(item.moodId)?.color ?? DEFAULT_GUEST_MOOD_COLOR,
		note: item.note,
		createdAt: item.createdAt.toISOString(),
	}));

	return {
		data,
		total,
		currentPage,
		totalPages,
	};
}

export async function createMood(input: CreateMoodRepositoryInput): Promise<number> {
	if (isAuthSession()) {
		return apiCreateMood({ moodId: input.moodId, note: input.note });
	}

	return createGuestMood(input);
}

export async function getMood(input: GetMoodRequestDTO): Promise<MoodResponseDTO> {
	if (isAuthSession()) {
		return apiGetMood(input);
	}

	return getGuestMoodList(input);
}

export async function updateMood(input: UpdateMoodRepositoryInput): Promise<number> {
	const sanitizedInput: UpdateMoodRepositoryInput = {
		entryId: input.entryId,
		...(typeof input.moodId === "number" ? { moodId: input.moodId } : {}),
		...(typeof input.note === "string" ? { note: input.note.trim() } : {}),
	};

	if (isAuthSession()) {
		return apiUpdateMood(sanitizedInput);
	}

	return updateGuestMood(sanitizedInput);
}

export async function deleteMood(input: DeleteMoodRepositoryInput): Promise<number> {
	if (isAuthSession()) {
		return apiDeleteMood(input);
	}

	return deleteGuestMood(input);
}

export async function getGuestMoodImportEntries(): Promise<MoodImportEntryDTO[]> {
	const guestMoods = await getGuestMoods();
	return guestMoods.map((item) => ({
		clientEntryId: item.clientEntryId,
		moodId: item.moodId,
		note: item.note,
		createdAt: item.createdAt.toISOString(),
		updatedAt: item.updatedAt.toISOString(),
	}));
}

export async function clearGuestMoods(): Promise<void> {
	await clearGuestMoodsStorage();
}
