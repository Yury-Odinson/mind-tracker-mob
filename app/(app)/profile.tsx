import AppButton from '@/components/AppButton';
import Wheel from '@/components/Wheel';
import { useMoodAdd } from '@/hooks/use-mood-add';
import { useThemeColor } from '@/hooks/use-theme-color';
import useMe from '@/store/me';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { authStyles } from '../(auth)/login';

export default function ProfileScreen() {
	const {
		moodId,
		note,
		setNote,
		moodName,
		isSend,
		handleMoodSelect,
		handleSendMood,
	} = useMoodAdd();

	const me = useMe((state) => state.data);
	const name = me?.name ?? "user";

	const isMeLoading = useMe((state) => state.isLoading);
	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");
	const borderStyle = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");

	const handleSubmit = async () => {
		const result = await handleSendMood();
		Alert.alert(result.isSuccess ? "Успешно" : "Ошибка", result.message);
	};

	return (
		<Pressable
			style={{ flex: 1 }}
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>

			<View style={styles.container}>

				<View style={styles.profile}>

					<Text style={[{ color: textColor }, styles.title]}>
						{isMeLoading ? `loading... ` : `Привет, ${name}!`}
					</Text>
					<Text style={[{ color: textColor, fontSize: 20 }]}>Что ты сейчас чувствуешь?</Text>

					<Wheel onMoodSelect={handleMoodSelect} />

					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "position" : "height"}
						keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
					>
						<View style={[{ backgroundColor: backgroundColor, borderColor: borderStyle }, styles.actions]}>
							<Text style={[{ color: textColor }, styles.actionsTitle]}>{moodName}</Text>
							<TextInput
								style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
								placeholder="Добавьте заметку... (по желанию)"
								readOnly={!moodId}
								value={note}
								onChangeText={setNote}
								autoCapitalize="none"
							/>
							<AppButton
								title={isSend ? "Отправка..." : "Записать эмоцию"}
								onPress={() => handleSubmit()}
								disabled={!moodId || isSend}
								loading={isSend}
							/>
						</View>
					</KeyboardAvoidingView>

				</View>

			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 16,
	},
	profile: {
		flex: 1,
		gap: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 600
	},
	actions: {
		padding: 20,
		gap: 16,
		borderRadius: 8,
		borderWidth: 1
	},
	actionsTitle: {
		height: 36,
		fontSize: 24,
		fontWeight: 600,
		textTransform: "uppercase",
		textAlign: "center"
	}
});
