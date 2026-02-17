import { Colors } from "@/constants/theme";
import useHandleTheme from "@/store/theme";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
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
