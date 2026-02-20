import { MeResponseDTO } from "@/types/DTO";
import axios from "axios";
import { apiClient } from "./client";

export async function apiMe(): Promise<MeResponseDTO> {
	try {
		const response = await apiClient.get<MeResponseDTO>("/api/me");

		console.log("debug: /api/me");
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			throw new Error(`GET /api/me failed${status ? `: ${status}` : ""}`);
		}

		throw error;
	}
}
