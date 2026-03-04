import { Colors } from "@/constants/theme";
import useHandleTheme from "@/store/theme";
import React from "react";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type AppButtonProps = {
	title?: string;
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
	variant?: "primary" | "secondary";
	fullWidth?: boolean;
	style?: StyleProp<ViewStyle>;
	leftIcon?: React.ReactNode;
	icon?: React.ReactNode;
};

export default function AppButton({
	title,
	onPress,
	disabled = false,
	loading = false,
	variant = "primary",
	fullWidth = true,
	style,
	icon,
}: AppButtonProps) {
	const isBlocked = disabled || loading;

	const theme = useHandleTheme((state) => state.theme);
	const palette = Colors[theme].button[variant];
	const textColor = isBlocked ? palette.disabledText : palette.text;

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
				<ActivityIndicator color={textColor} />
			) : (
				<View style={styles.content}>
					{title && <Text style={[styles.text, { color: textColor }]}>{title}</Text>}
					{icon ? <View style={styles.icon}>{icon}</View> : null}
				</View>
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
	content: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	icon: {
		alignItems: "center",
		justifyContent: "center",
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
