import { CreateMoodRequestDTO } from "@/types/DTO";
import axios from "axios";
import { apiClient } from "../client";

type ApiRequestError = Error & { status?: number };

export async function apiCreateMood({ moodId, note }: CreateMoodRequestDTO): Promise<number> {
	try {
		const response = await apiClient.post("/api/mood", { moodId, note });
		return response.status;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const requestError = new Error(`POST /api/mood failed${status ? `: ${status}` : ""}`) as ApiRequestError;
			requestError.status = status;
			throw requestError;
		}
		throw error;
	}
}
