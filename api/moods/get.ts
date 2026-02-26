import { GetMoodRequestDTO, MoodResponseDTO } from "@/types/DTO";
import axios from "axios";
import { apiClient } from "../client";

export async function apiGetMood({ page = 1, limit = 20 }: GetMoodRequestDTO): Promise<MoodResponseDTO> {
	try {
		const response = await apiClient.get("/api/mood", {
			headers: {
				page: page,
				limit: limit,
			},
		});

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			throw new Error(`GET /api/mood failed${status ? `: ${status}` : ""}`);
		}

		throw error;
	}
};
