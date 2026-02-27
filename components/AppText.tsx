// components/AppText.tsx
import { ThemeColorName, useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleProp, StyleSheet, Text, TextProps, TextStyle, } from "react-native";

type Variant = "title" | "subtitle" | "body" | "caption" | "placeholder";
type Tone = "text" | "secondaryText" | "accent" | "warning" | "success";
type Weight = "regular" | "medium" | "semibold" | "bold";

type AppTextProps = TextProps & {
	variant?: Variant | Variant[];
	tone?: Tone;
	backgroundTone?: ThemeColorName;
	weight?: Weight;
	style?: StyleProp<TextStyle>;
};

const variantStyles = StyleSheet.create({
	title: { fontSize: 28, lineHeight: 34 },
	subtitle: { fontSize: 20, lineHeight: 26 },
	body: { fontSize: 16, lineHeight: 22 },
	caption: { fontSize: 12, lineHeight: 16 },
	placeholder: {
		position: "absolute",
		top: -8,
		left: 8,
		paddingHorizontal: 8,
		fontSize: 12,
		zIndex: 1,
	}
});

const weightMap: Record<Weight, TextStyle["fontWeight"]> = {
	regular: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
};

export default function AppText({
	variant = "body",
	tone,
	backgroundTone,
	weight = "regular",
	style,
	children,
	...rest
}: AppTextProps) {
	const variants = Array.isArray(variant) ? variant : [variant];
	const hasPlaceholderVariant = variants.includes("placeholder");
	const resolvedTone = tone ?? (hasPlaceholderVariant ? "secondaryText" : "text");
	const resolvedBackgroundTone = backgroundTone ?? (hasPlaceholderVariant ? "inputBg" : undefined);
	const color = useThemeColor({}, resolvedTone);
	const backgroundColor = useThemeColor({}, resolvedBackgroundTone ?? "inputBg");

	return (
		<Text
			{...rest}
			style={[
				{ color, fontWeight: weightMap[weight] },
				...variants.map((v) => variantStyles[v]),
				resolvedBackgroundTone ? { backgroundColor } : null,
				style,
			]}
		>
			{children}
		</Text>
	);
}
