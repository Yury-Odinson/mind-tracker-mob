import AppButton from '@/components/AppButton';
import useAuth from '@/store/auth';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {

	const logOut = useAuth((state) => state.logout);

	return (
		<View style={styles.container}>
			<Text>Profile Screen</Text>

			<AppButton title="Настройки" onPress={() => router.push("/(app)/settings")} />

			<AppButton
				title={"Выйти"}
				onPress={logOut}
				style={{
					marginTop: 100,
					backgroundColor: "#f38989"
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20
	}
});
