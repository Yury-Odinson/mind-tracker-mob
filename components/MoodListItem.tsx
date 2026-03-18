import { MOOD_SECTORS } from "@/constants/moods";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MoodDTO } from "@/types/DTO";
import { formatedDate } from "@/utils/formatedDate";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import Animated, {
	Easing,
	FadeIn,
	FadeOut,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

type MoodActionResult = {
	isSuccess: boolean;
	message: string;
};

type MoodUpdatePayload = {
	moodId?: number;
	note?: string;
};

type MoodListItemProps = Pick<MoodDTO, "id" | "moodId" | "moodName" | "note" | "createdAt" | "color"> & {
	isEditing: boolean;
	onEditingChange: (entryId: number, nextIsEditing: boolean) => void;
	onUpdate: (entryId: number, payload: MoodUpdatePayload) => Promise<MoodActionResult>;
	onDelete: (entryId: number) => Promise<MoodActionResult>;
};

const moodOptions = MOOD_SECTORS.flatMap((sector) => sector.rings);
const cardLayoutTransition = LinearTransition.duration(260).easing(Easing.out(Easing.cubic));
const colorTransition = {
	duration: 240,
	easing: Easing.out(Easing.cubic),
};

function textColorByBackground(hex: string): string {
	const normalized = hex.replace("#", "");
	if (normalized.length !== 6) {
		return "#212529";
	}

	const red = parseInt(normalized.slice(0, 2), 16);
	const green = parseInt(normalized.slice(2, 4), 16);
	const blue = parseInt(normalized.slice(4, 6), 16);
	const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

	return luminance > 0.62 ? "#212529" : "#FFFFFF";
}

function hexToRgba(hex: string, alpha: number): string {
	const normalized = hex.replace("#", "");
	if (normalized.length !== 6) {
		return `rgba(33, 37, 41, ${alpha})`;
	}

	const red = parseInt(normalized.slice(0, 2), 16);
	const green = parseInt(normalized.slice(2, 4), 16);
	const blue = parseInt(normalized.slice(4, 6), 16);

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function MoodListItem({
	id,
	moodId,
	moodName,
	note,
	createdAt,
	color,
	isEditing,
	onEditingChange,
	onUpdate,
	onDelete,
}: MoodListItemProps) {
	const [selectedMoodId, setSelectedMoodId] = useState(moodId);
	const [selectedMoodName, setSelectedMoodName] = useState(moodName);
	const [selectedMoodColor, setSelectedMoodColor] = useState(color);
	const [nextNote, setNextNote] = useState(note);
	const [error, setError] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const textColor = useThemeColor({}, "text");
	const secondaryTextColor = useThemeColor({}, "secondaryText");
	const borderColor = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");
	const warningColor = useThemeColor({}, "warning");
	const accentColor = useThemeColor({}, "accent");
	const date = formatedDate(createdAt);
	const activeColor = (isEditing ? selectedMoodColor : color) || "#64748B";
	const moodTitle = isEditing ? selectedMoodName : moodName;
	const notePreview = (isEditing ? nextNote : note).trim() || "";
	const cardColor = useSharedValue(hexToRgba(activeColor, 0.12));
	const stripeColor = useSharedValue(activeColor);

	const cardAnimatedStyle = useAnimatedStyle(() => ({
		backgroundColor: cardColor.value,
	}));
	const stripeAnimatedStyle = useAnimatedStyle(() => ({
		backgroundColor: stripeColor.value,
	}));

	useEffect(() => {
		if (isEditing) {
			return;
		}

		setSelectedMoodId(moodId);
		setSelectedMoodName(moodName);
		setSelectedMoodColor(color);
		setNextNote(note);
		setError("");
	}, [color, isEditing, moodId, moodName, note]);

	useEffect(() => {
		cardColor.value = withTiming(hexToRgba(activeColor, 0.12), colorTransition);
		stripeColor.value = withTiming(activeColor, colorTransition);
	}, [activeColor, cardColor, stripeColor]);

	const isChanged = useMemo(() => {
		return selectedMoodId !== moodId || nextNote.trim() !== note.trim();
	}, [moodId, nextNote, note, selectedMoodId]);

	const startEdit = () => {
		onEditingChange(id, true);
		setError("");
	};

	const cancelEdit = () => {
		if (isUpdating) {
			return;
		}

		onEditingChange(id, false);
		setSelectedMoodId(moodId);
		setSelectedMoodName(moodName);
		setSelectedMoodColor(color);
		setNextNote(note);
		setError("");
	};

	const handleMoodSelect = (nextMoodId: number, nextMoodName: string, nextMoodColor: string) => {
		setSelectedMoodId(nextMoodId);
		setSelectedMoodName(nextMoodName);
		setSelectedMoodColor(nextMoodColor);
		setError("");
	};

	const handleSave = async () => {
		if (!isChanged || isUpdating || isDeleting) {
			return;
		}

		setError("");
		setIsUpdating(true);

		const payload: MoodUpdatePayload = {
			...(selectedMoodId !== moodId ? { moodId: selectedMoodId } : {}),
			...(nextNote.trim() !== note.trim() ? { note: nextNote.trim() } : {}),
		};

		const result = await onUpdate(id, payload);

		if (!result.isSuccess) {
			setError(result.message);
			setIsUpdating(false);
			return;
		}

		onEditingChange(id, false);
		setIsUpdating(false);
	};

	const runDelete = async () => {
		if (isDeleting || isUpdating) {
			return;
		}

		setError("");
		setIsDeleting(true);

		const result = await onDelete(id);
		if (!result.isSuccess) {
			setError(result.message);
			setIsDeleting(false);
			return;
		}

		onEditingChange(id, false);
		setIsDeleting(false);
	};

	const requestDelete = () => {
		Alert.alert("Удалить запись?", "Это действие нельзя отменить.", [
			{
				text: "Отмена",
				style: "cancel",
			},
			{
				text: "Удалить",
				style: "destructive",
				onPress: () => {
					void runDelete();
				},
			},
		]);
	};

	return (
		<Animated.View
			layout={cardLayoutTransition}
			style={[
				{
					position: "relative",
					marginVertical: 6,
					overflow: "hidden",
					borderRadius: 18,
					borderWidth: 1,
					borderColor,
				},
				cardAnimatedStyle,
			]}
		>
			<Animated.View
				style={[
					{
						position: "absolute",
						bottom: 0,
						left: 0,
						top: 0,
						width: 16,
					},
					stripeAnimatedStyle,
				]}
			/>

			<View className="gap-2 p-3 pl-9">
				<Text className="text-xs" style={{ color: secondaryTextColor }}>{date}</Text>
				<View className="min-h-7 justify-center">
					<Animated.Text
						key={moodTitle}
						entering={FadeIn.duration(170)}
						exiting={FadeOut.duration(120)}
						className="text-[20px]"
						style={{ color: textColor }}
					>
						{moodTitle}
					</Animated.Text>
				</View>
				<Text className="text-base" style={{ color: secondaryTextColor }}>{notePreview}</Text>

				<View className="flex-row gap-2.5">
					<Pressable
						onPress={isEditing ? cancelEdit : startEdit}
						disabled={isUpdating || isDeleting}
						className="rounded-[10px] border px-3 py-1.5"
						style={{ borderColor }}
					>
						<Text className="text-sm font-semibold" style={{ color: accentColor }}>
							{isEditing ? "Отмена" : "Редактировать"}
						</Text>
					</Pressable>

					<Pressable
						onPress={requestDelete}
						disabled={isUpdating || isDeleting}
						className="rounded-[10px] border px-3 py-1.5"
						style={{ borderColor }}
					>
						<Text className="text-sm font-semibold" style={{ color: warningColor }}>
							{isDeleting ? "Удаление..." : "Удалить"}
						</Text>
					</Pressable>
				</View>

				{isEditing ? (
					<Animated.View
						layout={cardLayoutTransition}
						entering={FadeIn.duration(180)}
						exiting={FadeOut.duration(120)}
						style={{
							marginTop: 4,
							gap: 10,
							borderTopWidth: 1,
							paddingTop: 10,
							borderColor,
						}}
					>
						<Text className="text-[13px] font-semibold" style={{ color: secondaryTextColor }}>Эмоция</Text>
						<View className="flex-row flex-wrap gap-2">
							{moodOptions.map((item) => {
								const isActive = item.id === selectedMoodId;
								return (
									<Pressable
										key={item.id}
										onPress={() => handleMoodSelect(item.id, item.name, item.color)}
										disabled={isUpdating || isDeleting}
										className="rounded-[10px] border px-2.5 py-1.5"
										style={{
											backgroundColor: isActive ? item.color : "transparent",
											borderColor: item.color,
										}}
									>
										<Text
											className="text-[13px] font-semibold"
											style={{ color: isActive ? textColorByBackground(item.color) : textColor }}
										>
											{item.name}
										</Text>
									</Pressable>
								);
							})}
						</View>

						<Text className="text-[13px] font-semibold" style={{ color: secondaryTextColor }}>Заметка</Text>
						<TextInput
							className="min-h-[84px] rounded-xl border px-3 py-2.5 text-[15px]"
							style={{ color: textColor, borderColor, backgroundColor: inputBgColor }}
							placeholder="Добавьте заметку..."
							placeholderTextColor={secondaryTextColor}
							value={nextNote}
							onChangeText={setNextNote}
							multiline
							textAlignVertical="top"
						/>

						<View className="flex-row gap-2.5">
							<Pressable
								onPress={cancelEdit}
								disabled={isUpdating}
								className="flex-1 items-center justify-center rounded-[10px] border py-2"
								style={{ borderColor }}
							>
								<Text className="text-sm font-semibold" style={{ color: secondaryTextColor }}>Отмена</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									void handleSave();
								}}
								disabled={!isChanged || isUpdating || isDeleting}
								className="flex-1 items-center justify-center rounded-[10px] border py-2"
								style={{ borderColor }}
							>
								<Text className="text-sm font-semibold" style={{ color: accentColor }}>
									{isUpdating ? "Сохранение..." : "Сохранить"}
								</Text>
							</Pressable>
						</View>
					</Animated.View>
				) : null}

				{error ? <Text className="text-[13px]" style={{ color: warningColor }}>{error}</Text> : null}
			</View>
		</Animated.View>
	);
}
