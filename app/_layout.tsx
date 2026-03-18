import { Colors } from "@/constants/theme";
import useAuth from "@/store/auth";
import useMe from "@/store/me";
import useOnboarding from "@/store/onboarding";
import useHandleTheme from "@/store/theme";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
	const hydrateSession = useAuth((state) => state.hydrateSession);
	const isAuthenticated = useAuth((state) => state.isAuthenticated);
	const isAuthHydrated = useAuth((state) => state.isHydrated);
	const hydrateOnboarding = useOnboarding((state) => state.hydrateOnboarding);
	const isOnboardingHydrated = useOnboarding((state) => state.isHydrated);
	const isOnboardingCompleted = useOnboarding((state) => state.isCompleted);
	const fetchMe = useMe((state) => state.fetchMe);
	const clearMe = useMe((state) => state.clearMe);

	useEffect(() => {
		void hydrateSession();
		void hydrateOnboarding();
	}, [hydrateOnboarding, hydrateSession]);

	useEffect(() => {
		if (!isAuthHydrated || !isOnboardingHydrated) {
			return;
		}

		if (!isOnboardingCompleted) {
			router.replace("/(onboarding)");
			return;
		}

		if (isAuthenticated) {
			void fetchMe();
			return;
		}

		router.push("/(app)/profile");

		clearMe();
	}, [clearMe, fetchMe, isAuthenticated, isAuthHydrated, isOnboardingCompleted, isOnboardingHydrated]);

	const lightAppTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			background: Colors.light.background,
			card: Colors.light.background,
		},
	};

	const darkAppTheme = {
		...DarkTheme,
		colors: {
			...DarkTheme.colors,
			background: Colors.dark.background,
			card: Colors.dark.background,
		},
	};

	const theme = useHandleTheme((state) => state.theme);
	const appTheme = theme === 'dark' ? darkAppTheme : lightAppTheme;
	const backgroundColor = Colors[theme].background;
	const statusBarStyle = theme === "dark" ? "light-content" : "dark-content";

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>

			<ThemeProvider value={appTheme}>
				<SafeAreaProvider>
					<SafeAreaView className="flex-1 max-w-[500px]" style={{ backgroundColor }} edges={["top"]}>
						<StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
						<Stack screenOptions={{ contentStyle: { backgroundColor }, headerShown: false }} />
					</SafeAreaView>
				</SafeAreaProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
};
