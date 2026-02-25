import Wheel from '@/components/Wheel';
import { useThemeColor } from '@/hooks/use-theme-color';
import useMe from '@/store/me';
import { formatedDate } from '@/utils/formatedDate';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
	const me = useMe((state) => state.data);
	const isMeLoading = useMe((state) => state.isLoading);
	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");
	const borderColor = useThemeColor({}, "border");
	const secondaryText = useThemeColor({}, "secondaryText");
	const name = me?.name ?? "user";

	return (
		<View style={styles.container}>

			<View style={styles.profile}>

				<Text style={[{ color: textColor }, styles.title]}>
					{isMeLoading ? `loading... ` : `Привет, ${name}!`}
				</Text>

				<Wheel />

				<View style={[{ backgroundColor: backgroundColor }, styles.recent]}>

					<Text style={[{ color: textColor, backgroundColor: backgroundColor },
					styles.recentTitle]}>Последняя запись:</Text>

					{me?.recentMoods.map((e) => (
						<View key={e.createdAt} style={{ gap: 6 }}>
							<View style={{ flexDirection: "row" }}>
								<Text style={[{ color: textColor, fontSize: 18, fontWeight: 600 }]}>
									{e.moodName}
								</Text>
								<Text style={[{ color: textColor, marginLeft: "auto" }]}>
									{formatedDate(e.createdAt.toString())}
								</Text>
							</View>
							{
								e.note &&
								<Text style={[{ color: secondaryText, borderTopColor: borderColor, borderTopWidth: 1, }]}>{e.note}</Text>
							}
						</View>
					))}

				</View>

			</View>

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 16,
	},
	profile: {
		flex: 1,
		gap: 16,
	},
	recent: {
		padding: 16,
		minHeight: 130,
		gap: 8,
		borderRadius: 8,
	},
	recentTitle: {
		paddingVertical: 8,
		fontWeight: 600,
		borderRadius: 8,
		fontSize: 20
	},
	title: {
		fontSize: 24,
		fontWeight: 600
	},
});
