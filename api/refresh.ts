import { RefreshResponseDTO } from "@/types/DTO";
import axios from "axios";
import { authClient } from "./client";

export async function apiRefresh(currentRefreshToken: string): Promise<RefreshResponseDTO> {
	try {
		const response = await authClient.post<RefreshResponseDTO>(
			"/api/auth/refresh",
			{ refreshToken: currentRefreshToken },
			{ withCredentials: true },
		);

		console.log("debug: /api/auth/refresh");
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			throw new Error(`POST /api/auth/refresh failed${status ? `: ${status}` : ""}`);
		}

		throw error;
	}
}
