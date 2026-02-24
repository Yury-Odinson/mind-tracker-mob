import { Colors } from "@/constants/theme";
import useAuth from "@/store/auth";
import useMe from "@/store/me";
import useHandleTheme from "@/store/theme";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	const hydrateSession = useAuth((state) => state.hydrateSession);
	const isAuthenticated = useAuth((state) => state.isAuthenticated);
	const isHydrated = useAuth((state) => state.isHydrated);
	const fetchMe = useMe((state) => state.fetchMe);
	const clearMe = useMe((state) => state.clearMe);

	useEffect(() => {
		void hydrateSession();
	}, [hydrateSession]);

	useEffect(() => {
		if (!isHydrated) {
			return;
		}

		if (isAuthenticated) {
			void fetchMe();
			return;
		}

		clearMe();
	}, [clearMe, fetchMe, isAuthenticated, isHydrated]);

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

	return (
		<ThemeProvider value={appTheme}>
			<SafeAreaProvider>
				<SafeAreaView style={[styles.container, { backgroundColor }]} edges={["top"]}>
					<StatusBar />
					<Stack screenOptions={{ contentStyle: { backgroundColor }, headerShown: false }} />
				</SafeAreaView>
			</SafeAreaProvider>
		</ThemeProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
