import AppButton from '@/components/AppButton';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {

	return (
		<View style={styles.container}>
			<Text>История</Text>
			<AppButton
				title={"Профиль"}
				onPress={() => router.push("/(app)/profile")}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		gap: 16
	},
});
