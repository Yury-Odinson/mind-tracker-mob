/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#7da6ff';
const tintColorDark = '#fff';

export const Colors = {
	light: {
		text: '#333',
		background: '#fff',
		tint: tintColorLight,
		icon: '#687076',
		tabIconDefault: '#687076',
		tabIconSelected: tintColorLight,
		button: {
			primary: {
				bg: "#22d3ee",
				text: "#333",
				border: "transparent",
				pressedBg: "#0e7490",
				disabledBg: "#c9c9c9",
				disabledText: "#777"
			},
			secondary: {
				bg: "#f8fafc",
				text: "#333",
				border: "#cbd5e1",
				pressedBg: "#f1f5f9",
				disabledBg: "#64748b",
				disabledText: "#1e293b"
			}
		}
	},
	dark: {
		text: '#ECEDEE',
		background: '#151718',
		tint: tintColorDark,
		icon: '#9BA1A6',
		tabIconDefault: '#9BA1A6',
		tabIconSelected: tintColorDark,
		button: {
			primary: {
				bg: "#22d3ee",
				text: "#333",
				border: "transparent",
				pressedBg: "#0e7490",
				disabledBg: "#c9c9c9",
				disabledText: "#777"
			},
			secondary: {
				bg: "#f8fafc",
				text: "#333",
				border: "#cbd5e1",
				pressedBg: "#e2e8f0",
				disabledBg: "#64748b",
				disabledText: "#1e293b"
			}
		}
	}
};

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: 'system-ui',
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: 'ui-serif',
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: 'ui-rounded',
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: 'ui-monospace',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});
