import AppText from "@/components/AppText";
import { useThemeColor } from "@/hooks/use-theme-color";
import { KeyboardTypeOptions, Modal as NativeModal, Pressable, StyleSheet, TextInput, View } from "react-native";
import AppButton from "./AppButton";

type AppModalProps = {
	visible: boolean;
	title: string;
	placeholder: string;
	value: string;
	onChangeValue: (value: string) => void;
	onClose: () => void;
	onSave: () => void;
	saveLabel?: string;
	isSubmitting?: boolean;
	error?: string;
	secureTextEntry?: boolean;
	keyboardType?: KeyboardTypeOptions;
};

export default function AppModal({
	visible,
	title,
	placeholder,
	value,
	onChangeValue,
	onClose,
	onSave,
	saveLabel = "Сохранить",
	isSubmitting = false,
	error = "",
	secureTextEntry = false,
	keyboardType = "default",
}: AppModalProps) {
	const textColor = useThemeColor({}, "text");
	const borderColor = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");
	const surfaceColor = useThemeColor({}, "surface");

	return (
		<NativeModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View style={styles.overlay}>
				<Pressable style={styles.backdrop} onPress={isSubmitting ? undefined : onClose} />

				<View style={[styles.container, { backgroundColor: surfaceColor, borderColor }]}>
					<AppText variant="subtitle" weight="semibold">{title}</AppText>

					<TextInput
						style={[styles.input, { color: textColor, backgroundColor: inputBgColor, borderColor }]}
						placeholder={placeholder}
						value={value}
						onChangeText={onChangeValue}
						secureTextEntry={secureTextEntry}
						keyboardType={keyboardType}
						autoCapitalize="none"
						autoFocus
						onSubmitEditing={onSave}
					/>

					{error ? <AppText tone="warning">{error}</AppText> : null}

					<View style={styles.actions}>
						<AppButton
							title="Отмена"
							onPress={onClose}
							variant="secondary"
							fullWidth={false}
							disabled={isSubmitting}
							style={styles.actionBtn}
						/>
						<AppButton
							title={saveLabel}
							onPress={onSave}
							loading={isSubmitting}
							disabled={isSubmitting}
							fullWidth={false}
							style={styles.actionBtn}
						/>
					</View>
				</View>
			</View>
		</NativeModal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#00000073",
	},
	container: {
		borderRadius: 16,
		padding: 16,
		gap: 12,
		maxWidth: 480,
		width: "100%",
		alignSelf: "center",
	},
	input: {
		width: "100%",
		height: 44,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
	},
	actions: {
		flexDirection: "row",
		gap: 10,
	},
	actionBtn: {
		flex: 1,
	},
});
