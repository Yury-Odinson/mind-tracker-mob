import AppButton from '@/components/AppButton';
import { useThemeColor } from '@/hooks/use-theme-color';
import useAuth from '@/store/auth';
import useHandleTheme from '@/store/theme';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {

	const logOut = useAuth((state) => state.logout);
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

			<AppButton
				title={"Выйти"}
				onPress={logOut}
				style={{
					marginTop: "auto",
					backgroundColor: "#f38989"
				}}
			/>
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
