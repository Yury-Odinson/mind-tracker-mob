import AppButton from '@/components/AppButton';
import { useThemeColor } from '@/hooks/use-theme-color';
import useHandleTheme from '@/store/theme';
import { router } from 'expo-router';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {

	const theme = useHandleTheme((state) => state.theme);
	const toggleTheme = useHandleTheme((state) => state.toggle);

	const textColor = useThemeColor({}, "text");
	const tintColor = useThemeColor({}, "tint");

	const isLightTheme = theme === "light" ? true : false;

	return (
		<View style={styles.container}>
			<Text style={[{ color: textColor }]}>Settings Screen</Text>

			<View style={[{ borderColor: tintColor }, styles.item]}>
				<Text style={[{ color: textColor }, { fontSize: 24 }]}>Светлая тема</Text>
				<Switch value={isLightTheme} onValueChange={toggleTheme} />
			</View>

			<AppButton title="Профиль" onPress={() => router.push("/(app)/profile")} />
			<AppButton title="test secondary" onPress={() => null} variant="secondary" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		gap: 16
	},
	item: {
		padding: 8,
		gap: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderRadius: 16,
	}
});
