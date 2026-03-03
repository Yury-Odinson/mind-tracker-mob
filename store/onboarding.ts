import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

async function getStoredOnboardingCompleted(): Promise<boolean> {
	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return false;
		}

		const rawValue = window.localStorage.getItem(ONBOARDING_COMPLETED_KEY);
		return rawValue === "true";
	}

	const rawValue = await SecureStore.getItemAsync(ONBOARDING_COMPLETED_KEY);
	return rawValue === "true";
}

async function setStoredOnboardingCompleted(isCompleted: boolean): Promise<void> {
	const value = String(isCompleted);

	if (Platform.OS === "web") {
		if (typeof window === "undefined" || !window.localStorage) {
			return;
		}

		window.localStorage.setItem(ONBOARDING_COMPLETED_KEY, value);
		return;
	}

	await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, value);
}

type OnboardingState = {
	isHydrated: boolean;
	isCompleted: boolean;
	hydrateOnboarding: () => Promise<void>;
	completeOnboarding: () => Promise<void>;
};

const useOnboarding = create<OnboardingState>((set) => ({
	isHydrated: false,
	isCompleted: false,

	hydrateOnboarding: async () => {
		try {
			const isCompleted = await getStoredOnboardingCompleted();
			set({ isCompleted, isHydrated: true });
		} catch {
			set({ isCompleted: false, isHydrated: true });
		}
	},

	completeOnboarding: async () => {
		await setStoredOnboardingCompleted(true);
		set({ isCompleted: true, isHydrated: true });
	},
}));

export default useOnboarding;
