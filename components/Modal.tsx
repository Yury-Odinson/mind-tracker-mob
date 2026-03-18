import AppText from "@/components/AppText";
import { useThemeColor } from "@/hooks/use-theme-color";
import { KeyboardTypeOptions, Modal as NativeModal, Pressable, TextInput, View } from "react-native";
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
			<View className="flex-1 justify-center px-5">
				<Pressable className="absolute inset-0 bg-black/45" onPress={isSubmitting ? undefined : onClose} />

				<View
					className="w-full max-w-[480px] self-center rounded-2xl border p-4"
					style={{ backgroundColor: surfaceColor, borderColor, gap: 12 }}
				>
					<AppText variant="subtitle" weight="semibold">{title}</AppText>

					<TextInput
						className="h-11 w-full rounded-lg border px-3"
						style={{ color: textColor, backgroundColor: inputBgColor, borderColor }}
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

					<View className="flex-row gap-2.5">
						<AppButton
							title="Отмена"
							onPress={onClose}
							variant="secondary"
							fullWidth={false}
							disabled={isSubmitting}
							style={{ flex: 1 }}
						/>
						<AppButton
							title={saveLabel}
							onPress={onSave}
							loading={isSubmitting}
							disabled={isSubmitting}
							fullWidth={false}
							style={{ flex: 1 }}
						/>
					</View>
				</View>
			</View>
		</NativeModal>
	);
}
