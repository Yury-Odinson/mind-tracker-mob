import { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

type WheelProps = {
	onMoodSelect: (moodId: number, moodName: string) => void;
};

type MoodSegment = {
	id: number;
	name: string;
	color: string;
};

type SectorDefinition = {
	axisDeg: number;
	rings: [MoodSegment, MoodSegment, MoodSegment];
};

const VIEWPORT_HEIGHT = 400;
const SNAP_STEP_DEG = 45;
const SECTOR_ANGLE = 45;
const HALF_SECTOR_ANGLE = SECTOR_ANGLE / 2;

const SECTORS: SectorDefinition[] = [
	{
		axisDeg: -90,
		rings: [
			{ id: 17, name: "Экстаз", color: "#FFE854" },
			{ id: 9, name: "Радость", color: "#FFFF54" },
			{ id: 1, name: "Спокойствие", color: "#FFFFB1" },
		],
	},
	{
		axisDeg: -45,
		rings: [
			{ id: 18, name: "Восхищение", color: "#00B400" },
			{ id: 10, name: "Доверие", color: "#54FF54" },
			{ id: 2, name: "Признание", color: "#8CFF8C" },
		],
	},
	{
		axisDeg: 0,
		rings: [
			{ id: 19, name: "Ужас", color: "#008000" },
			{ id: 11, name: "Страх", color: "#009600" },
			{ id: 3, name: "Опасение", color: "#8CC68C" },
		],
	},
	{
		axisDeg: 45,
		rings: [
			{ id: 20, name: "Изумление", color: "#0089E0" },
			{ id: 12, name: "Удивление", color: "#59BDFF" },
			{ id: 4, name: "Отвлечение", color: "#A5DBFF" },
		],
	},
	{
		axisDeg: 90,
		rings: [
			{ id: 21, name: "Горе", color: "#0000C8" },
			{ id: 13, name: "Печаль", color: "#5151FF" },
			{ id: 5, name: "Задумчивость", color: "#8C8CFF" },
		],
	},
	{
		axisDeg: 135,
		rings: [
			{ id: 22, name: "Отвращение", color: "#DE00DE" },
			{ id: 14, name: "Брезгливость", color: "#FF54FF" },
			{ id: 6, name: "Скука", color: "#FFC6FF" },
		],
	},
	{
		axisDeg: 180,
		rings: [
			{ id: 23, name: "Ярость", color: "#D40000" },
			{ id: 15, name: "Гнев", color: "#FF0000" },
			{ id: 7, name: "Раздражение", color: "#FF8C8C" },
		],
	},
	{
		axisDeg: -135,
		rings: [
			{ id: 24, name: "Бдительность", color: "#FF7D00" },
			{ id: 16, name: "Ожидание", color: "#FFA854" },
			{ id: 8, name: "Интерес", color: "#FFC48C" },
		],
	},
];

type Point = {
	x: number;
	y: number;
};

function normalizeDeg(deg: number): number {
	const normalized = deg % 360;
	return normalized < 0 ? normalized + 360 : normalized;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number): Point {
	const angleRad = (angleDeg * Math.PI) / 180;
	return {
		x: cx + radius * Math.cos(angleRad),
		y: cy + radius * Math.sin(angleRad),
	};
}

function makeSectorPath(
	cx: number,
	cy: number,
	innerRadius: number,
	outerRadius: number,
	startAngleDeg: number,
	endAngleDeg: number,
): string {
	const outerStart = polarToCartesian(cx, cy, outerRadius, startAngleDeg);
	const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngleDeg);

	if (innerRadius <= 0) {
		return [
			`M ${cx} ${cy}`,
			`L ${outerStart.x} ${outerStart.y}`,
			`A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
			"Z",
		].join(" ");
	}

	const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngleDeg);
	const innerStart = polarToCartesian(cx, cy, innerRadius, startAngleDeg);

	return [
		`M ${outerStart.x} ${outerStart.y}`,
		`A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
		`L ${innerEnd.x} ${innerEnd.y}`,
		`A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
		"Z",
	].join(" ");
}

function textColorByBackground(hex: string): string {
	const normalized = hex.replace("#", "");
	if (normalized.length !== 6) {
		return "#1A1A1A";
	}

	const red = parseInt(normalized.slice(0, 2), 16);
	const green = parseInt(normalized.slice(2, 4), 16);
	const blue = parseInt(normalized.slice(4, 6), 16);
	const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

	return luminance > 0.62 ? "#1A1A1A" : "#FFFFFF";
}

export default function Wheel({ onMoodSelect }: WheelProps) {
	const [viewportWidth, setViewportWidth] = useState(0);
	const [selectedMoodId, setSelectedMoodId] = useState<number | null>(null);
	const rotationDeg = useSharedValue(0);
	const gestureStartAngle = useSharedValue(0);
	const gestureStartRotation = useSharedValue(0);

	const geometry = useMemo(() => {
		if (!viewportWidth) {
			return null;
		}

		const wheelRadius = Math.max(viewportWidth, 520);
		const ringRadii: [number, number, number, number] = [
			wheelRadius * 0.20,
			wheelRadius * 0.50,
			wheelRadius * 0.74,
			wheelRadius * 0.96,
		];
		const centerYGlobal = wheelRadius + 24;
		const centerXGlobal = viewportWidth / 2;

		return {
			wheelRadius,
			wheelDiameter: wheelRadius * 2,
			centerXGlobal,
			centerYGlobal,
			wheelLeft: centerXGlobal - wheelRadius,
			wheelTop: centerYGlobal - wheelRadius,
			localCenter: wheelRadius,
			ringRadii,
		};
	}, [viewportWidth]);

	const wheelAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotationDeg.value}deg` }],
	}));

	const handleLayout = (event: LayoutChangeEvent) => {
		setViewportWidth(event.nativeEvent.layout.width);
	};

	const handleMoodPick = (segment: MoodSegment) => {
		setSelectedMoodId(segment.id);
		onMoodSelect(segment.id, segment.name);
	};

	const handleTapPick = (x: number, y: number, currentRotationDeg: number) => {
		if (!geometry) {
			return;
		}

		const dx = x - geometry.centerXGlobal;
		const dy = y - geometry.centerYGlobal;
		const distance = Math.hypot(dx, dy);

		const [r0, r1, r2, r3] = geometry.ringRadii;
		if (distance < r0 || distance > r3) {
			return;
		}

		let ringIndex = 0;
		if (distance >= r1 && distance < r2) {
			ringIndex = 1;
		} else if (distance >= r2) {
			ringIndex = 2;
		}

		const startOffset = SECTORS[0].axisDeg - HALF_SECTOR_ANGLE;
		const absoluteAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
		const wheelAngle = normalizeDeg(absoluteAngle - currentRotationDeg);
		const sectorIndex = Math.floor(normalizeDeg(wheelAngle - startOffset) / SECTOR_ANGLE) % SECTORS.length;

		const selected = SECTORS[sectorIndex]?.rings[ringIndex];
		if (selected) {
			handleMoodPick(selected);
		}
	};

	const panGesture = Gesture.Pan()
		.minDistance(6)
		.onBegin((event) => {
			if (!geometry) {
				return;
			}

			const angle = Math.atan2(event.y - geometry.centerYGlobal, event.x - geometry.centerXGlobal);
			gestureStartAngle.value = angle;
			gestureStartRotation.value = rotationDeg.value;
		})
		.onUpdate((event) => {
			if (!geometry) {
				return;
			}

			const angle = Math.atan2(event.y - geometry.centerYGlobal, event.x - geometry.centerXGlobal);
			const delta = Math.atan2(
				Math.sin(angle - gestureStartAngle.value),
				Math.cos(angle - gestureStartAngle.value),
			);

			rotationDeg.value = gestureStartRotation.value + (delta * 180) / Math.PI;
		})
		.onEnd(() => {
			const snapped = Math.round(rotationDeg.value / SNAP_STEP_DEG) * SNAP_STEP_DEG;
			rotationDeg.value = withTiming(snapped, {
				duration: 220,
				easing: Easing.out(Easing.cubic),
			});
		});

	const tapGesture = Gesture.Tap().onEnd((event, success) => {
		if (!success) {
			return;
		}

		runOnJS(handleTapPick)(event.x, event.y, rotationDeg.value);
	});

	const gesture = Gesture.Exclusive(panGesture, tapGesture);

	const segmentPaths = useMemo(() => {
		if (!geometry) {
			return [];
		}

		const labelsFontSize = [15, 15, 15];

		return SECTORS.flatMap((sector, sectorIndex) => {
			const startDeg = sector.axisDeg - HALF_SECTOR_ANGLE;
			const endDeg = sector.axisDeg + HALF_SECTOR_ANGLE;

			return sector.rings.map((segment, ringIndex) => {
				const innerRadius = geometry.ringRadii[ringIndex];
				const outerRadius = geometry.ringRadii[ringIndex + 1];
				const labelRadius = (innerRadius + outerRadius) / 2;
				const labelPoint = polarToCartesian(
					geometry.localCenter,
					geometry.localCenter,
					labelRadius,
					sector.axisDeg,
				);

				return {
					...segment,
					sectorIndex,
					ringIndex,
					path: makeSectorPath(
						geometry.localCenter,
						geometry.localCenter,
						innerRadius,
						outerRadius,
						startDeg,
						endDeg,
					),
					labelX: labelPoint.x,
					labelY: labelPoint.y,
					labelSize: labelsFontSize[ringIndex],
					labelRotate: sector.axisDeg + 90,
					textColor: textColorByBackground(segment.color),
				};
			});
		});
	}, [geometry]);

	return (
		<View style={styles.container} onLayout={handleLayout}>
			{geometry ? (
				<GestureDetector gesture={gesture}>
					<View style={styles.gestureSurface}>
						<Animated.View
							style={[
								styles.wheel,
								{
									width: geometry.wheelDiameter,
									height: geometry.wheelDiameter,
									left: geometry.wheelLeft,
									top: geometry.wheelTop,
								},
								wheelAnimatedStyle,
							]}
						>
							<Svg
								width={geometry.wheelDiameter}
								height={geometry.wheelDiameter}
								viewBox={`0 0 ${geometry.wheelDiameter} ${geometry.wheelDiameter}`}
							>
								<G>
									{segmentPaths.map((segment) => (
										<Path
											key={`${segment.id}-${segment.sectorIndex}-${segment.ringIndex}`}
											d={segment.path}
											fill={segment.color}
										// stroke={selectedMoodId === segment.id ? "#111111" : "#1A1A1A"}
										// strokeWidth={selectedMoodId === segment.id ? 3 : 1.2}
										/>
									))}
								</G>

								<G pointerEvents="none" opacity={0.9}>
									<Circle
										cx={geometry.localCenter}
										cy={geometry.localCenter}
										r={geometry.ringRadii[0]}
										fill="none"
									// stroke="#1A1A1A"
									// strokeWidth={1}
									// strokeDasharray="3 6"
									/>
									<Circle
										cx={geometry.localCenter}
										cy={geometry.localCenter}
										r={geometry.ringRadii[1]}
										fill="none"
									// stroke="#1A1A1A"
									// strokeWidth={1}
									// strokeDasharray="4 8"
									/>
									<Circle
										cx={geometry.localCenter}
										cy={geometry.localCenter}
										r={geometry.ringRadii[2]}
										fill="none"
									// stroke="#1A1A1A"
									// strokeWidth={1}
									// strokeDasharray="4 8"
									/>
									<Circle
										cx={geometry.localCenter}
										cy={geometry.localCenter}
										r={geometry.ringRadii[3]}
										fill="none"
									// stroke="#1A1A1A"
									// strokeWidth={1.4}
									// strokeDasharray="5 9"
									/>
								</G>

								<G pointerEvents="none">
									{segmentPaths.map((segment) => (
										<SvgText
											key={`label-${segment.id}`}
											x={segment.labelX}
											y={segment.labelY}
											transform={`rotate(${segment.labelRotate} ${segment.labelX} ${segment.labelY})`}
											fill={segment.textColor}
											fontSize={segment.labelSize}
											fontWeight="700"
											textAnchor="middle"
											alignmentBaseline="middle"
										>
											{segment.name}
										</SvgText>
									))}
								</G>
							</Svg>
						</Animated.View>
					</View>
				</GestureDetector>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: VIEWPORT_HEIGHT,
		overflow: "hidden",
	},
	gestureSurface: {
		flex: 1,
	},
	wheel: {
		position: "absolute",
	},
});
