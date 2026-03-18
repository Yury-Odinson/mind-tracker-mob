// components/AppText.tsx
import { ThemeColorName, useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

type Variant = "title" | "subtitle" | "body" | "caption" | "placeholder";
type Tone = "text" | "secondaryText" | "accent" | "warning" | "success";
type Weight = "regular" | "medium" | "semibold" | "bold";

type AppTextProps = TextProps & {
	variant?: Variant | Variant[];
	tone?: Tone;
	backgroundTone?: ThemeColorName;
	weight?: Weight;
	style?: StyleProp<TextStyle>;
	className?: string;
};

const variantClasses: Record<Variant, string> = {
	title: "text-[28px] leading-[34px]",
	subtitle: "text-[20px] leading-[26px]",
	body: "text-base leading-[22px]",
	caption: "text-xs leading-4",
	placeholder: "absolute -top-2 left-2 z-10 px-2 text-xs",
};

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
	className,
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
			className={[...variants.map((v) => variantClasses[v]), className].filter(Boolean).join(" ")}
			style={[
				{ color, fontWeight: weightMap[weight] },
				resolvedBackgroundTone ? { backgroundColor } : null,
				style,
			]}
		>
			{children}
		</Text>
	);
}
