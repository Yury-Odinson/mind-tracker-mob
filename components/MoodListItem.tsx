import { useThemeColor } from "@/hooks/use-theme-color";
import { MoodDTO } from "@/types/DTO";
import { formatedDate } from "@/utils/formatedDate";
import { StyleSheet, Text, View } from "react-native";

type Mood = Omit<MoodDTO, "id" | "moodId">;

export default function MoodListItem({ moodName, note, createdAt }: Mood) {

	const textColor = useThemeColor({}, "text");
	const secondaryTexColor = useThemeColor({}, "secondaryText");
	const borderColor = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");

	// tint потом заменить на цвет, приходящий из бэка (который соответствует эмоции)
	const tintColor = useThemeColor({}, "tint");

	const date = formatedDate(createdAt);

	return (
		<View style={[{ backgroundColor: inputBgColor, borderColor: borderColor }, styles.item]}>
			<View style={[{ backgroundColor: tintColor }, styles.color]}></View>
			<View style={{ padding: 12, gap: 4 }}>
				<Text style={[{ color: secondaryTexColor }, styles.date]}>{date}</Text>
				<Text style={[{ color: textColor }, styles.name]}>{moodName}</Text>
				<Text style={[{ color: secondaryTexColor }, styles.note]}>{note}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		marginVertical: 6,
		borderWidth: 1,
		borderRadius: 8,
		overflow: "hidden"
	},
	color: {
		width: 10,
		height: 100,
	},
	date: {
		fontSize: 12
	},
	name: {
		fontSize: 20

	},
	note: {
		fontSize: 16
	}
});
