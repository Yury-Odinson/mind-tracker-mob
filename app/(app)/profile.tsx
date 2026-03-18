import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import MoodIsland from '@/components/MoodIsland';
import Wheel from '@/components/Wheel';
import { useMoodAdd } from '@/hooks/use-mood-add';
import { useThemeColor } from '@/hooks/use-theme-color';
import useMe from '@/store/me';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

export default function ProfileScreen() {
	const {
		moodId,
		note,
		setNote,
		moodName,
		moodColor,
		isSend,
		handleMoodSelect,
		handleSendMood,
	} = useMoodAdd();

	const me = useMe((state) => state.data);
	const name = me?.name ?? "Гость";

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
			className="flex-1"
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>

			<View className="flex-1 gap-4 p-5">

				<View className="flex-1 justify-between">

					<View className="gap-4">
						<AppText variant={"title"} weight={"bold"}>{isMeLoading ? `Привет!` : `Привет, ${name}!`}</AppText>
						<AppText variant={"subtitle"}>Что ты сейчас чувствуешь?</AppText>
					</View>

					<View className="-mx-5 mt-5 max-w-[500px]">
						<Wheel onMoodSelect={handleMoodSelect} />
					</View>

					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "position" : "height"}
						keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
					>
						<View className="mt-11 gap-4 rounded-[30px] p-5" style={{ backgroundColor }}>

							<MoodIsland moodName={moodName} color={moodColor} />
							<TextInput
								className="relative h-10 w-full rounded-2xl border px-2.5"
								style={{
									color: textColor,
									backgroundColor: inputBgColor,
									borderColor: borderStyle,
								}}
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
}
