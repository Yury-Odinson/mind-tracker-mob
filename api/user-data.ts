import useAuth from "@/store/auth";
import {
	ChangeUserEmailRequestDTO,
	ChangeUserNameRequestDTO,
	ChangeUserPasswordRequestDTO,
	UpdateMeFieldRequestDTO,
} from "@/types/DTO";
import axios from "axios";
import { apiClient } from "./client";

const updateUserFieldEndpoints: Record<UpdateMeFieldRequestDTO["field"], string> = {
	name: "/api/changeUserName",
	email: "/api/changeUserEmail",
	password: "/api/changeUserPassword",
};

function getMessage(value: unknown): string | null {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function extractBackendMessage(payload: unknown): string | null {
	if (!payload || typeof payload !== "object") {
		return getMessage(payload);
	}

	const source = payload as Record<string, unknown>;
	return (
		getMessage(source.message) ??
		getMessage(source.error) ??
		(source.data && typeof source.data === "object"
			? getMessage((source.data as Record<string, unknown>).message) ??
				getMessage((source.data as Record<string, unknown>).error)
			: null)
	);
}

function getAuthorizedHeaders(): Record<string, string> {
	const accessToken = useAuth.getState().accessToken;
	if (!accessToken) {
		throw new Error("Отсутствует access token. Авторизуйтесь снова.");
	}

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${accessToken}`,
	};
}

async function postWithAuth<TPayload>(endpoint: string, payload: TPayload): Promise<number> {
	const headers = getAuthorizedHeaders();

	try {
		const response = await apiClient.post(endpoint, payload, { headers });
		return response.status;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const backendMessage = extractBackendMessage(error.response?.data);
			const fallback = `POST ${endpoint} failed${status ? `: ${status}` : ""}`;
			throw new Error(backendMessage ?? fallback);
		}

		throw error;
	}
}

export async function apiChangeUserName(payload: ChangeUserNameRequestDTO): Promise<number> {
	return postWithAuth(updateUserFieldEndpoints.name, payload);
}

export async function apiChangeUserEmail(payload: ChangeUserEmailRequestDTO): Promise<number> {
	return postWithAuth(updateUserFieldEndpoints.email, payload);
}

export async function apiChangeUserPassword(payload: ChangeUserPasswordRequestDTO): Promise<number> {
	return postWithAuth(updateUserFieldEndpoints.password, payload);
}

export async function apiUpdateUserField({ field, currentValue, newValue }: UpdateMeFieldRequestDTO): Promise<number> {
	if (field === "name") {
		return apiChangeUserName({
			name: currentValue,
			newName: newValue,
		});
	}

	if (field === "email") {
		return apiChangeUserEmail({
			email: currentValue,
			newEmail: newValue,
		});
	}

	return apiChangeUserPassword({
		password: currentValue,
		newPassword: newValue,
	});
}
