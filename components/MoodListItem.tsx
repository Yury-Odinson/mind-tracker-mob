import { useThemeColor } from "@/hooks/use-theme-color";
import { MoodDTO } from "@/types/DTO";
import { formatedDate } from "@/utils/formatedDate";
import { StyleSheet, Text, View } from "react-native";

type Mood = Omit<MoodDTO, "id" | "moodId">;

export default function MoodListItem({ moodName, note, createdAt, color }: Mood) {

	const textColor = useThemeColor({}, "text");
	const secondaryTexColor = useThemeColor({}, "secondaryText");
	const borderColor = useThemeColor({}, "border");

	const date = formatedDate(createdAt);

	const bgColor = () => `${color}20`;

	return (
		<View style={[{ backgroundColor: bgColor(), borderColor: borderColor }, styles.item]}>
			<View style={[{ backgroundColor: color }, styles.color]}></View>
			<View style={styles.content}>
				<Text style={[{ color: secondaryTexColor }, styles.date]}>{date}</Text>
				<Text style={[{ color: textColor }, styles.name]}>{moodName}</Text>
				<Text style={[{ color: secondaryTexColor }, styles.note]}>{note}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	item: {
		position: "relative",
		marginVertical: 6,
		borderWidth: 1,
		borderRadius: 8,
		overflow: "hidden",
	},
	color: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: 10,
	},
	content: {
		padding: 12,
		paddingLeft: 22,
		gap: 4,
	},
	date: {
		fontSize: 12
	},
	name: {
		fontSize: 20

	},
	note: {
		fontSize: 16,
	}
});
