import { DeleteMoodRequestDTO } from "@/types/DTO";
import axios from "axios";
import { apiClient } from "../client";

type ApiRequestError = Error & { status?: number };

export async function apiDeleteMood({ entryId }: DeleteMoodRequestDTO): Promise<number> {
	try {
		const response = await apiClient.delete(`/api/mood/${entryId}`);
		return response.status;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const requestError = new Error(`DELETE /api/mood/${entryId} failed${status ? `: ${status}` : ""}`) as ApiRequestError;
			requestError.status = status;
			throw requestError;
		}

		throw error;
	}
}
