import AppButton from '@/components/AppButton';
import Wheel from '@/components/Wheel';
import { useThemeColor } from '@/hooks/use-theme-color';
import useMe from '@/store/me';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { authStyles } from '../(auth)/login';

export default function ProfileScreen() {
	const [moodId, setMoodId] = useState<number | null>(null);
	const [mood, setMood] = useState<string>("");
	const [note, setNote] = useState<string>("");

	const me = useMe((state) => state.data);
	const name = me?.name ?? "user";

	const isMeLoading = useMe((state) => state.isLoading);
	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");
	const borderStyle = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");

	const handleMoodSelect = (selectedMoodId: number, selectedMoodName: string) => {
		setMoodId(selectedMoodId);
		setMood(selectedMoodName);
	};

	const handleSendMood = () => {
		if (!moodId) return;
		console.log("send: ", moodId, note);
		setMoodId(null);
		setMood("");
		setNote("");
	};

	return (
		<View style={styles.container}>

			<View style={styles.profile}>

				<Text style={[{ color: textColor }, styles.title]}>
					{isMeLoading ? `loading... ` : `Привет, ${name}!`}
				</Text>
				<Text style={[{ color: textColor, fontSize: 20 }]}>Что ты сейчас чувствуешь?</Text>

				<Wheel onMoodSelect={handleMoodSelect} />

				<View style={[{ backgroundColor: backgroundColor }, styles.actions]}>
					<Text style={[{ color: textColor }, styles.actionsTitle]}>{mood}</Text>
					<TextInput
						style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
						placeholder="Добавьте заметку... (по желанию)"
						value={note}
						onChangeText={setNote}
						autoCapitalize="none"
					/>
					<AppButton title="Записать эмоцию" onPress={() => handleSendMood()} disabled={!moodId} />
				</View>

			</View>

		</View>
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
		height: 150,
		gap: 16,
		borderRadius: 8,
	},
	actionsTitle: {
		height: 36,
		fontSize: 24,
		fontWeight: 600,
		textTransform: "uppercase",
		textAlign: "center"
	}
});
