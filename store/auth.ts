import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

const ACCESS_TOKEN_KEY = "access_token";

async function getStoredToken(): Promise<string | null> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return null;
		}
		return window.localStorage.getItem(ACCESS_TOKEN_KEY);
	}

	return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

async function setStoredToken(token: string): Promise<void> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}
		window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
		return;
	}

	await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

async function deleteStoredToken(): Promise<void> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}
		window.localStorage.removeItem(ACCESS_TOKEN_KEY);
		return;
	}

	await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

type AuthStatus = "idle" | "loading" | "auth";

type AuthState = {
	status: AuthStatus;
	accessToken: string | null;
	isAuthenticated: boolean;
	isHydrated: boolean;

	hydrateSession: () => Promise<void>;
	applyLogin: (token: string) => Promise<void>;
	logout: () => Promise<void>;
};

const useAuth = create<AuthState>((set) => ({
	status: "idle",
	accessToken: null,
	isAuthenticated: false,
	isHydrated: false,

	hydrateSession: async () => {
		set({ status: "loading" });
		try {
			const token = await getStoredToken();

			if (token) {
				set({
					accessToken: token,
					isAuthenticated: true,
					status: "auth",
					isHydrated: true,
				});
				return;
			}

			set({
				accessToken: null,
				isAuthenticated: false,
				status: "idle",
				isHydrated: true,
			});
		} catch {
			set({
				accessToken: null,
				isAuthenticated: false,
				status: "idle",
				isHydrated: true,
			});
		}
	},

	applyLogin: async (token) => {
		await setStoredToken(token);
		set({
			accessToken: token,
			isAuthenticated: true,
			status: "auth",
			isHydrated: true,
		});
	},

	logout: async () => {
		await deleteStoredToken();
		set({
			accessToken: null,
			isAuthenticated: false,
			status: "idle",
			isHydrated: true,
		});
	},
}));

export default useAuth;
