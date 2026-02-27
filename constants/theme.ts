/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
	light: {
		accent: '#3197eb',
		text: '#212529',
		secondaryText: '#6C757D',
		background: '#F8F9FA',
		inputBg: '#FFFFFF',
		border: '#DEE2E6',

		surface: '#FFFFFF',
		surfaceElevated: '#FFFFFF',

		warning: "#DC3545",
		success: "#28A745",

		button: {
			primary: {
				bg: "#3197eb",
				text: "#FFFFFF",
				pressedBg: "#1D74BD",
				disabledBg: "#A6D3F5",
				disabledText: "#FFFFFF"
			},
			secondary: {
				bg: "#E2E8F0",
				text: "#212529",
				border: "transparent",
				pressedBg: "#CBD5E1",
				disabledBg: "#F1F5F9",
				disabledText: "#94A3B8"
			}
		}
	},
	dark: {
		accent: '#7ec3f3',
		text: '#ECE9E6',
		secondaryText: '#A1A7AB',
		background: '#121212',
		inputBg: '#1E1E1E',
		border: '#2C2C2C',

		surface: '#1E1E1E',
		surfaceElevated: '#2A2A2A',

		warning: "#E74C3C",
		success: "#2ECC71",

		button: {
			primary: {
				bg: "#7ec3f3",
				text: "#121212",
				pressedBg: "#A6D3F5",
				disabledBg: "#333333",
				disabledText: "#6C757D"
			},
			secondary: {
				bg: "rgba(226, 232, 240, 0.1)",
				text: "#ECE9E6",
				border: "transparent",
				pressedBg: "rgba(226, 232, 240, 0.2)",
				disabledBg: "rgba(255, 255, 255, 0.05)",
				disabledText: "#6C757D"
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
