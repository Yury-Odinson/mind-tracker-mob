import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type StoredTokens = {
	accessToken: string | null;
	refreshToken: string | null;
};

async function getStoredToken(): Promise<StoredTokens> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return { accessToken: null, refreshToken: null };
		}

		const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
		const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

		return { accessToken, refreshToken };
	}

	const [accessToken, refreshToken] = await Promise.all([
		SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
		SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
	]);

	return { accessToken, refreshToken };
}

async function setStoredToken(accessToken: string, refreshToken: string | null = null): Promise<void> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}

		window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		if (refreshToken) {
			window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
		} else {
			window.localStorage.removeItem(REFRESH_TOKEN_KEY);
		}
		return;
	}

	await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
	if (refreshToken) {
		await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
	} else {
		await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
	}
}

async function deleteStoredToken(): Promise<void> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}
		window.localStorage.removeItem(ACCESS_TOKEN_KEY);
		window.localStorage.removeItem(REFRESH_TOKEN_KEY);
		return;
	}

	await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
	await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

type AuthStatus = "idle" | "loading" | "auth";

type AuthState = {
	status: AuthStatus;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isHydrated: boolean;

	hydrateSession: () => Promise<void>;
	applyLogin: (accessToken: string, refreshToken: string) => Promise<void>;
	logout: () => Promise<void>;
};

const useAuth = create<AuthState>((set) => ({
	status: "idle",
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isHydrated: false,

	hydrateSession: async () => {
		set({ status: "loading" });
		try {
			const tokens = await getStoredToken();

			if (tokens.accessToken) {
				set({
					accessToken: tokens.accessToken,
					refreshToken: tokens.refreshToken,
					isAuthenticated: true,
					status: "auth",
					isHydrated: true,
				});
				return;
			}

			set({
				accessToken: null,
				refreshToken: null,
				isAuthenticated: false,
				status: "idle",
				isHydrated: true,
			});
		} catch {
			set({
				accessToken: null,
				refreshToken: null,
				isAuthenticated: false,
				status: "idle",
				isHydrated: true,
			});
		}
	},

	applyLogin: async (accessToken, refreshToken) => {
		await setStoredToken(accessToken, refreshToken);
		set({
			accessToken,
			refreshToken,
			isAuthenticated: true,
			status: "auth",
			isHydrated: true,
		});
	},

	logout: async () => {
		await deleteStoredToken();
		set({
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			status: "idle",
			isHydrated: true,
		});
	},
}));

export default useAuth;
