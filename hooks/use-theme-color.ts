import { Colors } from "@/constants/theme";
import useHandleTheme from "@/store/theme";

type ThemeName = keyof typeof Colors; // "light" | "dark"
type Palette = (typeof Colors)["light"];

type StringKeys<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type ThemeColorName = StringKeys<Palette>;

export function useThemeColor(
	props: Partial<Record<ThemeName, string>>,
	colorName: ThemeColorName
): string {
	const theme = useHandleTheme((s) => s.theme);
	return props[theme] ?? Colors[theme][colorName];
}
