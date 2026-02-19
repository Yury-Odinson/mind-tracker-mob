import { MeResponseDTO } from "@/types/DTO";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
	console.warn("EXPO_PUBLIC_API_BASE_URL is not set!");
}

export async function apiMe(accessToken: string): Promise<MeResponseDTO> {
	if (!BASE_URL) {
		throw new Error("EXPO_PUBLIC_API_BASE_URL is not set");
	}

	const URL = `${BASE_URL}/api/me`;

	const options: RequestInit = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const response = await fetch(URL, options);

	if (!response.ok) {
		const message = response.statusText ?? "/api/me request failed";
		throw new Error(`GET /api/me failed: ${response.status}, ${message}`);
	}

	const data = (await response.json()) as MeResponseDTO;
	
	return data;
}
