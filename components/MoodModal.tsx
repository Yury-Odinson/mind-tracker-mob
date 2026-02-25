import { authStyles } from '@/app/(auth)/login';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Dispatch, SetStateAction } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from './AppButton';

type ModalProps = {
	visible: boolean;
	mood: string | null;
	note: string;
	setNote: Dispatch<SetStateAction<string>>;
	onClose: () => void;
}

export default function MoodModal({ mood, onClose, visible, note, setNote }: ModalProps) {
	const textColor = useThemeColor({}, "text");
	const borderStyle = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.backdrop}>
				<Pressable style={styles.backdropTouch} onPress={onClose} />
				<View style={styles.container}>
					<Text style={styles.title}>Выбрано: <Text style={{ fontWeight: 600, }}>{mood ?? ""}</Text> </Text>
					<TextInput
						style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
						placeholder="Заметка (по желанию)"
						value={note}
						onChangeText={setNote}
						autoCapitalize="none"
					/>
					<AppButton title="Закрыть" onPress={onClose} />
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#00000073',
	},
	backdropTouch: {
		...StyleSheet.absoluteFillObject,
	},
	container: {
		width: '85%',
		maxWidth: 360,
		padding: 20,
		backgroundColor: "#aed6e9",
		borderRadius: 12,
		gap: 12,
	},
	title: {
		fontSize: 18,
		textAlign: 'center',
	},
});
