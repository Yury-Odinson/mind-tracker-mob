import { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	cancelAnimation,
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDecay,
	withTiming,
} from "react-native-reanimated";
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
const FOCUS_AXIS_DEG = -90;
const AUTO_ALIGN_DURATION_MS = 280;
const SNAP_DURATION_MS = 220;
const MOMENTUM_DECELERATION = 0.995;
const MIN_MOMENTUM_SPEED_DEG = 12;
const MIN_MOMENTUM_RADIUS_PX = 24;
const LABEL_FONT_SIZES = [18, 20, 22] as const;

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
const SECTOR_START_OFFSET_DEG = SECTORS[0].axisDeg - HALF_SECTOR_ANGLE;

type Point = {
	x: number;
	y: number;
};

function normalizeDeg(deg: number): number {
	const normalized = deg % 360;
	return normalized < 0 ? normalized + 360 : normalized;
}

function closestTurnAngle(baseDeg: number, currentDeg: number): number {
	const turns = Math.round((currentDeg - baseDeg) / 360);
	return baseDeg + turns * 360;
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

	return luminance > 0.62 ? "#212529" : "#FFFFFF";
}

export default function Wheel({ onMoodSelect }: WheelProps) {
	const [viewportWidth, setViewportWidth] = useState(0);
	const rotationDeg = useSharedValue(0);
	const gestureStartAngle = useSharedValue(0);
	const gestureStartRotation = useSharedValue(0);

	const geometry = useMemo(() => {
		if (!viewportWidth) {
			return null;
		}

		const wheelRadius = Math.max(viewportWidth, 420);
		const ringRadii: [number, number, number, number] = [
			wheelRadius * 0.20,
			wheelRadius * 0.50,
			wheelRadius * 0.74,
			wheelRadius * 1,
		];
		const centerYGlobal = wheelRadius;
		const centerXGlobal = viewportWidth / 2;

		return {
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
		const nextWidth = event.nativeEvent.layout.width;
		setViewportWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
	};

	const segmentPaths = useMemo(() => {
		if (!geometry) {
			return [];
		}

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
					labelSize: LABEL_FONT_SIZES[ringIndex],
					labelRotate: sector.axisDeg + 90,
					textColor: textColorByBackground(segment.color),
				};
			});
		});
	}, [geometry]);

	if (!geometry) {
		return <View style={styles.container} onLayout={handleLayout} />;
	}

	const {
		centerXGlobal,
		centerYGlobal,
		localCenter,
		ringRadii,
		wheelDiameter,
		wheelLeft,
		wheelTop,
	} = geometry;
	const [r0, r1, r2, r3] = ringRadii;

	const handleTapPick = (x: number, y: number, currentRotationDeg: number) => {
		const dx = x - centerXGlobal;
		const dy = y - centerYGlobal;
		const distance = Math.hypot(dx, dy);

		if (distance < r0 || distance > r3) {
			return;
		}

		const ringIndex = distance < r1 ? 0 : distance < r2 ? 1 : 2;
		const absoluteAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
		const wheelAngle = normalizeDeg(absoluteAngle - currentRotationDeg);
		const sectorIndex =
			Math.floor(normalizeDeg(wheelAngle - SECTOR_START_OFFSET_DEG) / SECTOR_ANGLE) % SECTORS.length;
		const selectedSector = SECTORS[sectorIndex];
		const selected = selectedSector.rings[ringIndex];

		onMoodSelect(selected.id, selected.name);

		const targetRotation = closestTurnAngle(
			FOCUS_AXIS_DEG - selectedSector.axisDeg,
			currentRotationDeg,
		);

		rotationDeg.value = withTiming(targetRotation, {
			duration: AUTO_ALIGN_DURATION_MS,
			easing: Easing.out(Easing.cubic),
		});
	};

	const panGesture = Gesture.Pan()
		.minDistance(6)
		.onBegin((event) => {
			cancelAnimation(rotationDeg);

			const angle = Math.atan2(event.y - centerYGlobal, event.x - centerXGlobal);
			gestureStartAngle.value = angle;
			gestureStartRotation.value = rotationDeg.value;
		})
		.onUpdate((event) => {
			const angle = Math.atan2(event.y - centerYGlobal, event.x - centerXGlobal);
			const delta = Math.atan2(
				Math.sin(angle - gestureStartAngle.value),
				Math.cos(angle - gestureStartAngle.value),
			);

			rotationDeg.value = gestureStartRotation.value + (delta * 180) / Math.PI;
		})
		.onEnd((event) => {
			const snapToStep = () => {
				"worklet";
				const snapped = Math.round(rotationDeg.value / SNAP_STEP_DEG) * SNAP_STEP_DEG;
				rotationDeg.value = withTiming(snapped, {
					duration: SNAP_DURATION_MS,
					easing: Easing.out(Easing.cubic),
				});
			};

			const dx = event.x - centerXGlobal;
			const dy = event.y - centerYGlobal;
			const radiusSq = dx * dx + dy * dy;

			if (radiusSq < MIN_MOMENTUM_RADIUS_PX * MIN_MOMENTUM_RADIUS_PX) {
				snapToStep();
				return;
			}

			const angularVelocityRad = (dx * event.velocityY - dy * event.velocityX) / radiusSq;
			const angularVelocityDeg = (angularVelocityRad * 180) / Math.PI;

			if (Math.abs(angularVelocityDeg) < MIN_MOMENTUM_SPEED_DEG) {
				snapToStep();
				return;
			}

			rotationDeg.value = withDecay(
				{
					velocity: angularVelocityDeg,
					deceleration: MOMENTUM_DECELERATION,
				},
				(finished) => {
					if (finished) {
						snapToStep();
					}
				},
			);
		});

	const tapGesture = Gesture.Tap().onEnd((event, success) => {
		if (!success) {
			return;
		}

		runOnJS(handleTapPick)(event.x, event.y, rotationDeg.value);
	});

	const gesture = Gesture.Exclusive(panGesture, tapGesture);

	return (
		<View style={styles.container} onLayout={handleLayout}>
			<GestureDetector gesture={gesture}>
				<View style={styles.gestureSurface}>
					<Animated.View
						style={[
							styles.wheel,
							{
								width: wheelDiameter,
								height: wheelDiameter,
								left: wheelLeft,
								top: wheelTop,
							},
							wheelAnimatedStyle,
						]}
					>
						<Svg
							width={wheelDiameter}
							height={wheelDiameter}
							viewBox={`0 0 ${wheelDiameter} ${wheelDiameter}`}
						>
							<G>
								{segmentPaths.map((segment) => (
									<Path
										key={`${segment.id}-${segment.sectorIndex}-${segment.ringIndex}`}
										d={segment.path}
										fill={segment.color}
									/>
								))}
							</G>

							<G pointerEvents="none" opacity={0.9}>
								{ringRadii.map((radius, index) => (
									<Circle
										key={`ring-${index}`}
										cx={localCenter}
										cy={localCenter}
										r={radius}
										fill="none"
									/>
								))}
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
