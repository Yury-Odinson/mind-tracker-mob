import { RefreshResponseDTO } from "@/types/DTO";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
	console.warn("EXPO_PUBLIC_API_BASE_URL is not set!");
}

export async function apiRefresh(currentRefreshToken: string): Promise<RefreshResponseDTO> {
	if (!BASE_URL) {
		throw new Error("EXPO_PUBLIC_API_BASE_URL is not set");
	}

	const URL = `${BASE_URL}/api/auth/refresh`;

	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-client": "mobile"
		},
		credentials: "include",
		body: JSON.stringify({ refreshToken: currentRefreshToken }),
	};

	const response = await fetch(URL, options);
	if (!response.ok) {
		throw new Error(`POST /api/auth/refresh failed: ${response.status}. ${response.statusText}`);
	}

	return response.json() as Promise<RefreshResponseDTO>;
}
