import { AuthenticateResponseDTO, AuthenticateUserDTO } from "@/types/DTO";
import axios from "axios";
import { authClient } from "./client";

export async function apiAuth({ email, password, }: AuthenticateUserDTO): Promise<AuthenticateResponseDTO> {
	try {
		const response = await authClient.post<AuthenticateResponseDTO>(
			"/api/auth",
			{ email, password },
		)

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			throw new Error(`POST /api/auth failed${status ? `: ${status}` : ""}`);
		}
		throw error;
	}
}
