import { MOOD_SECTORS } from "@/constants/moods";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MoodDTO } from "@/types/DTO";
import { formatedDate } from "@/utils/formatedDate";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type MoodActionResult = {
	isSuccess: boolean;
	message: string;
};

type MoodUpdatePayload = {
	moodId?: number;
	note?: string;
};

type MoodListItemProps = Pick<MoodDTO, "id" | "moodId" | "moodName" | "note" | "createdAt" | "color"> & {
	onUpdate: (entryId: number, payload: MoodUpdatePayload) => Promise<MoodActionResult>;
	onDelete: (entryId: number) => Promise<MoodActionResult>;
};

const moodOptions = MOOD_SECTORS.flatMap((sector) => sector.rings);

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

export default function MoodListItem({
	id,
	moodId,
	moodName,
	note,
	createdAt,
	color,
	onUpdate,
	onDelete,
}: MoodListItemProps) {
	const [isEditing, setIsEditing] = useState(false);
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

	const date = formatedDate(createdAt);
	const activeColor = isEditing ? selectedMoodColor : color;
	const notePreview = (isEditing ? nextNote : note).trim() || "";

	const isChanged = useMemo(() => {
		return selectedMoodId !== moodId || nextNote.trim() !== note.trim();
	}, [moodId, nextNote, note, selectedMoodId]);

	const startEdit = () => {
		setIsEditing(true);
		setError("");
	};

	const cancelEdit = () => {
		if (isUpdating) {
			return;
		}

		setIsEditing(false);
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

		setIsEditing(false);
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
		<View style={[{ backgroundColor: `${activeColor}20`, borderColor }, styles.item]}>
			<View style={[{ backgroundColor: activeColor }, styles.color]}></View>
			<View style={styles.content}>
				<Text style={[{ color: secondaryTextColor }, styles.date]}>{date}</Text>
				<Text style={[{ color: textColor }, styles.name]}>{isEditing ? selectedMoodName : moodName}</Text>
				<Text style={[{ color: secondaryTextColor }, styles.note]}>{notePreview}</Text>

				<View style={styles.actions}>
					<Pressable
						onPress={isEditing ? cancelEdit : startEdit}
						disabled={isUpdating || isDeleting}
						style={[styles.actionBtn, { borderColor }]}
					>
						<Text style={[styles.actionText, { color: accentColor }]}>
							{isEditing ? "Отмена" : "Редактировать"}
						</Text>
					</Pressable>

					<Pressable
						onPress={requestDelete}
						disabled={isUpdating || isDeleting}
						style={[styles.actionBtn, { borderColor }]}
					>
						<Text style={[styles.actionText, { color: warningColor }]}>
							{isDeleting ? "Удаление..." : "Удалить"}
						</Text>
					</Pressable>
				</View>

				{isEditing ? (
					<View style={[styles.editor, { borderColor }]}>
						<Text style={[styles.editorLabel, { color: secondaryTextColor }]}>Эмоция</Text>
						<View style={styles.moodGrid}>
							{moodOptions.map((item) => {
								const isActive = item.id === selectedMoodId;
								return (
									<Pressable
										key={item.id}
										onPress={() => handleMoodSelect(item.id, item.name, item.color)}
										disabled={isUpdating || isDeleting}
										style={[
											styles.moodChip,
											{
												backgroundColor: isActive ? item.color : "transparent",
												borderColor: item.color,
											},
										]}
									>
										<Text
											style={[
												styles.moodChipText,
												{
													color: isActive ? textColorByBackground(item.color) : textColor,
												},
											]}
										>
											{item.name}
										</Text>
									</Pressable>
								);
							})}
						</View>

						<Text style={[styles.editorLabel, { color: secondaryTextColor }]}>Заметка</Text>
						<TextInput
							style={[
								styles.input,
								{
									color: textColor,
									borderColor,
									backgroundColor: inputBgColor,
								},
							]}
							placeholder="Добавьте заметку..."
							placeholderTextColor={secondaryTextColor}
							value={nextNote}
							onChangeText={setNextNote}
							multiline
							textAlignVertical="top"
						/>

						<View style={styles.editActions}>
							<Pressable
								onPress={cancelEdit}
								disabled={isUpdating}
								style={[styles.editBtn, { borderColor }]}
							>
								<Text style={[styles.actionText, { color: secondaryTextColor }]}>Отмена</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									void handleSave();
								}}
								disabled={!isChanged || isUpdating || isDeleting}
								style={[styles.editBtn, { borderColor }]}
							>
								<Text style={[styles.actionText, { color: accentColor }]}>
									{isUpdating ? "Сохранение..." : "Сохранить"}
								</Text>
							</Pressable>
						</View>
					</View>
				) : null}

				{error ? <Text style={[styles.error, { color: warningColor }]}>{error}</Text> : null}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	item: {
		position: "relative",
		marginVertical: 6,
		borderWidth: 1,
		borderRadius: 18,
		overflow: "hidden",
	},
	color: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: 16,
	},
	content: {
		padding: 12,
		paddingLeft: 36,
		gap: 8,
	},
	date: {
		fontSize: 12,
	},
	name: {
		fontSize: 20,
	},
	note: {
		fontSize: 16,
	},
	actions: {
		flexDirection: "row",
		gap: 10,
	},
	actionBtn: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 10,
		borderWidth: 1,
	},
	actionText: {
		fontSize: 14,
		fontWeight: "600",
	},
	editor: {
		gap: 10,
		marginTop: 4,
		paddingTop: 10,
		borderTopWidth: 1,
	},
	editorLabel: {
		fontSize: 13,
		fontWeight: "600",
	},
	moodGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	moodChip: {
		borderRadius: 10,
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	moodChipText: {
		fontSize: 13,
		fontWeight: "600",
	},
	input: {
		minHeight: 84,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 15,
	},
	editActions: {
		flexDirection: "row",
		gap: 10,
	},
	editBtn: {
		flex: 1,
		paddingVertical: 8,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		borderWidth: 1,
	},
	error: {
		fontSize: 13,
	},
});
