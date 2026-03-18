import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import useOnboarding from '@/store/onboarding';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function HistoryScreen() {

	const endOnboarding = useOnboarding((state) => state.completeOnboarding);

	return (
		<View className="flex-1 gap-4 p-5">
			<AppText variant={"title"} weight="bold">onboarding screen</AppText>

			<Link href={"/(auth)/register"}>регистрация</Link>
			<Link href={"/(auth)/login"}>авторизация</Link>

			<AppButton title="done" onPress={endOnboarding} />
		</View>
	);
}
