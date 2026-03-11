import { UpdateMoodRequestDTO } from "@/types/DTO";
import axios from "axios";
import { apiClient } from "../client";

type ApiRequestError = Error & { status?: number };

export async function apiUpdateMood({ entryId, moodId, note }: UpdateMoodRequestDTO): Promise<number> {
	try {
		const payload = {
			...(typeof moodId === "number" ? { moodId } : {}),
			...(typeof note === "string" ? { note } : {}),
		};

		const response = await apiClient.patch(`/api/mood/${entryId}`, payload);
		return response.status;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const requestError = new Error(`PATCH /api/mood/${entryId} failed${status ? `: ${status}` : ""}`) as ApiRequestError;
			requestError.status = status;
			throw requestError;
		}

		throw error;
	}
}
