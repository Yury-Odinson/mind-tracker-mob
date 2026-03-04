import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import AppText from "./AppText";

type MoodIslandProps = {
	moodName: string;
	color?: string;
};

const PILL_HEIGHT = 38;
const COLLAPSED_WIDTH = 42;
const HORIZONTAL_PADDING = 16;
const MAX_EXPANDED_WIDTH = 300;

function hexToRgba(hex: string, alpha: number): string {
	const normalized = hex.replace("#", "");
	const red = parseInt(normalized.slice(0, 2), 16);
	const green = parseInt(normalized.slice(2, 4), 16);
	const blue = parseInt(normalized.slice(4, 6), 16);

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function textColorByBackground(hex: string): string {
	const normalized = hex.replace("#", "");
	const red = parseInt(normalized.slice(0, 2), 16);
	const green = parseInt(normalized.slice(2, 4), 16);
	const blue = parseInt(normalized.slice(4, 6), 16);
	const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

	return luminance > 0.62 ? "#212529" : "#FFFFFF";
}

export default function MoodIsland({ moodName, color = "" }: MoodIslandProps) {
	const [isMounted, setIsMounted] = useState(Boolean(moodName.trim()));
	const [contentWidth, setContentWidth] = useState(0);
	const [displayMoodName, setDisplayMoodName] = useState(moodName.trim());
	const [displayColor, setDisplayColor] = useState(color);

	const fallbackTextColor = useThemeColor({}, "text");
	const fallbackSurfaceColor = useThemeColor({}, "surfaceElevated");
	const fallbackBorderColor = useThemeColor({}, "border");

	const hasMood = moodName.trim().length > 0;

	useEffect(() => {
		const trimmedMood = moodName.trim();

		if (trimmedMood) {
			setDisplayMoodName(trimmedMood);
		}
	}, [moodName]);

	useEffect(() => {
		if (hasMood) {
			setDisplayColor(color);
		}
	}, [color, hasMood]);

	const activeColor = displayColor;
	const backgroundColor = useMemo(
		() => (activeColor ? hexToRgba(activeColor, 0.28) : fallbackSurfaceColor),
		[activeColor, fallbackSurfaceColor],
	);
	const borderColor = useMemo(
		() => (activeColor ? hexToRgba(activeColor, 0.52) : fallbackBorderColor),
		[activeColor, fallbackBorderColor],
	);
	const textColor = activeColor ? textColorByBackground(activeColor) : fallbackTextColor;
	const dotColor = activeColor || fallbackTextColor;

	const expandedWidth = Math.min(
		MAX_EXPANDED_WIDTH,
		Math.max(COLLAPSED_WIDTH, contentWidth + HORIZONTAL_PADDING * 2),
	);

	const islandWidth = useSharedValue(COLLAPSED_WIDTH);
	const islandOpacity = useSharedValue(0);
	const islandTranslateY = useSharedValue(-10);
	const contentOpacity = useSharedValue(0);

	useEffect(() => {
		if (hasMood) {
			if (!isMounted) {
				setIsMounted(true);
			}

			islandWidth.value = COLLAPSED_WIDTH;
			islandOpacity.value = withTiming(1, {
				duration: 220,
				easing: Easing.out(Easing.cubic),
			});
			islandTranslateY.value = withTiming(0, {
				duration: 260,
				easing: Easing.out(Easing.cubic),
			});
			contentOpacity.value = withDelay(
				80,
				withTiming(1, {
					duration: 160,
					easing: Easing.out(Easing.cubic),
				}),
			);

			return;
		}

		contentOpacity.value = withTiming(0, {
			duration: 100,
			easing: Easing.out(Easing.quad),
		});
		islandWidth.value = withTiming(COLLAPSED_WIDTH, {
			duration: 220,
			easing: Easing.out(Easing.cubic),
		});
		islandTranslateY.value = withTiming(-10, {
			duration: 220,
			easing: Easing.inOut(Easing.cubic),
		});
		islandOpacity.value = withTiming(
			0,
			{
				duration: 180,
				easing: Easing.in(Easing.cubic),
			},
			(finished) => {
				if (finished) {
					runOnJS(setIsMounted)(false);
				}
			},
		);
	}, [contentOpacity, hasMood, islandOpacity, islandTranslateY, islandWidth, isMounted]);

	useEffect(() => {
		if (!hasMood || !isMounted) {
			return;
		}

		islandWidth.value = withTiming(expandedWidth, {
			duration: 280,
			easing: Easing.out(Easing.cubic),
		});
	}, [expandedWidth, hasMood, islandWidth, isMounted]);

	const handleMeasure = (event: LayoutChangeEvent) => {
		const nextWidth = Math.ceil(event.nativeEvent.layout.width);
		setContentWidth((prevWidth) => (prevWidth === nextWidth ? prevWidth : nextWidth));
	};

	const islandAnimatedStyle = useAnimatedStyle(() => ({
		width: islandWidth.value,
		opacity: islandOpacity.value,
		transform: [{ translateY: islandTranslateY.value }],
	}));

	const contentAnimatedStyle = useAnimatedStyle(() => ({
		opacity: contentOpacity.value,
	}));

	if (!isMounted) {
		return null;
	}

	return (
		<View style={styles.anchor} pointerEvents="none">
			<Animated.View
				style={[
					styles.pill,
					{
						backgroundColor,
						borderColor,
					},
					islandAnimatedStyle,
				]}
			>
				<Animated.View style={[styles.content, contentAnimatedStyle]}>
					<View style={[styles.dot, { backgroundColor: dotColor }]} />
					<AppText weight="bold" numberOfLines={1} style={[styles.label, { color: textColor }]}>
						{displayMoodName}
					</AppText>
				</Animated.View>
			</Animated.View>

			<View style={styles.measure}>
				<View style={styles.content} onLayout={handleMeasure}>
					<View style={[styles.dot, { backgroundColor: dotColor }]} />
					<AppText weight="bold" numberOfLines={1} style={styles.label}>
						{displayMoodName || " "}
					</AppText>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	anchor: {
		position: "absolute",
		left: 0,
		right: 0,
		top: -36,
		alignItems: "center",
		zIndex: 4,
	},
	pill: {
		height: PILL_HEIGHT,
		borderRadius: PILL_HEIGHT / 2,
		overflow: "hidden",
		borderWidth: 1,
		justifyContent: "center",
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingHorizontal: HORIZONTAL_PADDING,
		height: PILL_HEIGHT,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	label: {
		textTransform: "uppercase",
		letterSpacing: 0.4,
	},
	measure: {
		position: "absolute",
		opacity: 0,
	},
});
