import { apiMe } from '@/api/me';
import { apiRefresh } from '@/api/refresh';
import AppButton from '@/components/AppButton';
import { useThemeColor } from '@/hooks/use-theme-color';
import useAuth from '@/store/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {

	const [name, setName] = useState<string>("userName");

	const refreshToken = useAuth((state) => state.refreshToken);

	const textColor = useThemeColor({}, "text");

	const applyLogin = useAuth((state) => state.applyLogin);

	const handleMe = async () => {
		const userData = await apiMe();
		setName(userData.name);
	};

	const handleRefresh = async () => {
		if (!refreshToken) return;

		const nextTokens = await apiRefresh(refreshToken);
		await applyLogin(nextTokens.accessToken, nextTokens.refreshToken);
	}

	const logOut = useAuth((state) => state.logout);

	return (
		<View style={styles.container}>

			<View style={styles.profile}>
				<Text style={[{ color: textColor }, styles.title]}>Добро пожаловать, {name}!</Text>
				<AppButton title="Настройки" onPress={() => router.push("/(app)/settings")} />
				<AppButton title="/api/me" onPress={() => handleMe()} />
				<AppButton title="/api/auth/refresh" onPress={() => handleRefresh()} />
			</View>

			<AppButton
				title={"Выйти"}
				onPress={logOut}
				style={{
					backgroundColor: "#f38989"
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20
	},
	profile: {
		flex: 1,
		gap: 16
	},
	title: {
		fontSize: 24,
		textAlign: "center"
	},
});
