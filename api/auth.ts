import { AuthenticateResponseDTO, AuthenticateUserDTO } from "@/types/DTO";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
	console.warn("EXPO_PUBLIC_API_BASE_URL is not set!");
}

function getString(value: unknown): string | null {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function extractTokenByKeys(payload: unknown, keys: string[]): string | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const source = payload as Record<string, unknown>;
	for (const key of keys) {
		const token = getString(source[key]);
		if (token) {
			return token;
		}
	}

	if (source.data && typeof source.data === "object") {
		const data = source.data as Record<string, unknown>;
		for (const key of keys) {
			const token = getString(data[key]);
			if (token) {
				return token;
			}
		}
	}

	return null;
}

function extractAccessTokenFromPayload(payload: unknown): string | null {
	const primitive = getString(payload);
	if (primitive) {
		return primitive;
	}

	return extractTokenByKeys(payload, ["accessToken", "access_token", "token", "jwt"]);
}

function extractRefreshTokenFromPayload(payload: unknown): string | null {
	return extractTokenByKeys(payload, ["refreshToken", "refresh_token", "refresh"]);
}

function extractMessageFromPayload(payload: unknown): string | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const source = payload as Record<string, unknown>;
	return getString(source.message) ?? getString(source.error) ?? null;
}

function extractAccessTokenFromHeaders(headers: Headers): string | null {
	const bearer = headers.get("authorization");
	if (bearer) {
		const match = bearer.match(/^Bearer\s+(.+)$/i);
		if (match && match[1]) {
			const token = getString(match[1]);
			if (token) {
				return token;
			}
		}
	}

	return getString(headers.get("x-access-token")) ?? getString(headers.get("x-auth-token"));
}

function extractRefreshTokenFromHeaders(headers: Headers): string | null {
	return (
		getString(headers.get("x-refresh-token")) ??
		getString(headers.get("x-auth-refresh-token")) ??
		getString(headers.get("refresh-token"))
	);
}

export async function apiAuth({
	email,
	password,
}: AuthenticateUserDTO): Promise<AuthenticateResponseDTO> {
	if (!BASE_URL) {
		throw new Error("EXPO_PUBLIC_API_BASE_URL is not set");
	}

	const URL = `${BASE_URL}/api/auth`;

	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-client": "mobile"
		},
		body: JSON.stringify({ email, password }),
	};

	const response = await fetch(URL, options);
	const raw = await response.text();
	const normalizedRaw = raw.trim();

	let payload: unknown = normalizedRaw;
	
	if (normalizedRaw) {
		try {
			payload = JSON.parse(normalizedRaw);
		} catch {
			payload = normalizedRaw;
		}
	}

	if (!response.ok) {
		const backendMessage = extractMessageFromPayload(payload);
		const message = backendMessage ?? response.statusText ?? "Authentication request failed";
		throw new Error(`POST /api/auth failed: ${response.status}. ${message}`);
	}

	const accessToken =
		extractAccessTokenFromHeaders(response.headers) ?? extractAccessTokenFromPayload(payload);
	if (!accessToken) {
		throw new Error(
			"POST /api/auth succeeded but token is missing. Expected accessToken/access_token/token/jwt in body or auth headers.",
		);
	}

	const refreshToken =
		extractRefreshTokenFromHeaders(response.headers) ?? extractRefreshTokenFromPayload(payload);
	if (!refreshToken) {
		throw new Error(
			"POST /api/auth succeeded but refresh token is missing. Expected refreshToken/refresh_token in body or refresh token headers.",
		);
	}

	return { accessToken, refreshToken };
}
