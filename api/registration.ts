import { AuthenticateResponseDTO, RegistrationUserDTO } from "@/types/DTO";
import axios from "axios";
import { authClient } from "./client";

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

export async function apiRegistration({ name, email, password, lang = "ru" }: RegistrationUserDTO): Promise<AuthenticateResponseDTO> {
	try {
		const response = await authClient.post<AuthenticateResponseDTO>(
			"/api/registration",
			{ name, email, password, lang },
		)

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			const backendMessage = extractBackendMessage(error.response?.data);
			const fallback = `POST /api/registration failed${status ? `: ${status}` : ""}`;
			throw new Error(backendMessage ?? fallback);
		}
		throw error;
	}
}
