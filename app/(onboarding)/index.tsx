import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import useOnboarding from '@/store/onboarding';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function HistoryScreen() {

	const endOnboarding = useOnboarding((state) => state.completeOnboarding);

	return (
		<View style={styles.container}>
			<AppText variant={"title"} weight="bold">onboarding screen</AppText>

			<Link href={"/(auth)/register"}>регистрация</Link>
			<Link href={"/(auth)/login"}>авторизация</Link>

			<AppButton title="done" onPress={endOnboarding} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 16
	}
});
