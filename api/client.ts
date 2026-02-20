import useAuth from '@/store/auth';
import { RefreshResponseDTO } from '@/types/DTO';
import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
	console.warn('EXPO_PUBLIC_API_BASE_URL is not set!');
}

const commonConfig = {
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		'x-client': 'mobile',
	},
};

export const apiClient = axios.create(commonConfig);
export const authClient = axios.create(commonConfig);

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<RefreshResponseDTO> | null = null;

function setAuthorizationHeader(config: InternalAxiosRequestConfig, accessToken: string): void {
	if (!config.headers) {
		config.headers = new AxiosHeaders();
	}

	if (config.headers instanceof AxiosHeaders) {
		config.headers.set('Authorization', `Bearer ${accessToken}`);
		return;
	}

	(config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
}

async function refreshTokens(currentRefreshToken: string): Promise<RefreshResponseDTO> {
	if (!refreshPromise) {
		refreshPromise = authClient
			.post<RefreshResponseDTO>(
				'/api/auth/refresh',
				{ refreshToken: currentRefreshToken },
				{ withCredentials: true },
			)
			.then((response) => response.data)
			.finally(() => {
				refreshPromise = null;
			});
			console.log("debug: /api/auth/refresh in the client.ts");
	}

	return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
	const accessToken = useAuth.getState().accessToken;
	if (accessToken) {
		setAuthorizationHeader(config, accessToken);
	}

	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetriableRequestConfig | undefined;
		const status = error.response?.status;

		if (status !== 401 || !originalRequest || originalRequest._retry) {
			throw error;
		}

		originalRequest._retry = true;

		const { refreshToken, applyLogin, logout } = useAuth.getState();
		if (!refreshToken) {
			await logout();
			throw error;
		}

		try {
			const nextTokens = await refreshTokens(refreshToken);
			await applyLogin(nextTokens.accessToken, nextTokens.refreshToken);
			setAuthorizationHeader(originalRequest, nextTokens.accessToken);
			return apiClient(originalRequest);
		} catch (refreshError) {
			await logout();
			throw refreshError;
		}
	},
);
