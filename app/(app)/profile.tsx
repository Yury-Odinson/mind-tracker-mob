import { apiMe } from '@/api/me';
import AppButton from '@/components/AppButton';
import useAuth from '@/store/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {

	const [name, setName] = useState<string>("userName");

	const accessToken = useAuth((state) => state.accessToken);

	const handleMe = async () => {
		if (!accessToken) return;

		const userData = await apiMe(accessToken);
		setName(userData.name);
	};

	const logOut = useAuth((state) => state.logout);

	return (
		<View style={styles.container}>

			<View style={styles.profile}>
				<Text style={styles.title}>Добро пожаловать, {name}!</Text>
				<AppButton title="Настройки" onPress={() => router.push("/(app)/settings")} />
				<AppButton title="check" onPress={() => handleMe()} />
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
