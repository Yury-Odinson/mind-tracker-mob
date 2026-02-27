import { Colors } from "@/constants/theme";
import useHandleTheme from "@/store/theme";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type AppButtonProps = {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
	variant?: "primary" | "secondary";
	fullWidth?: boolean;
	style?: ViewStyle;
};

export default function AppButton({
	title,
	onPress,
	disabled = false,
	loading = false,
	variant = "primary",
	fullWidth = true,
	style,
}: AppButtonProps) {
	const isBlocked = disabled || loading;

	const theme = useHandleTheme((state) => state.theme);
	const palette = Colors[theme].button[variant];

	return (
		<Pressable
			onPress={onPress}
			disabled={isBlocked}
			style={({ pressed }) => [
				styles.base,
				fullWidth && styles.fullWidth,
				{
					backgroundColor: isBlocked
						? palette.disabledBg
						: pressed
							? palette.pressedBg
							: palette.bg,
				},
				style,
			]}
		>
			{loading ? (
				<ActivityIndicator color={isBlocked ? palette.disabledText : palette.text} />
			) : (
				<Text style={[styles.text, { color: isBlocked ? palette.disabledText : palette.text }]}>
					{title}
				</Text>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		minHeight: 48,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	primary: {
		backgroundColor: "#333",
	},
	secondary: {
		backgroundColor: "#E5E7EB",
	},
	text: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
	},
	secondaryText: {
		color: "#333",
	},
	fullWidth: {
		width: "100%",
	},
	pressed: {
		opacity: 0.85,
		transform: [{ scale: 0.99 }],
	},
	disabled: {
		opacity: 0.5,
	},
});
