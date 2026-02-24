import AppButton from '@/components/AppButton';
import Wheel from '@/components/Wheel';
import { useThemeColor } from '@/hooks/use-theme-color';
import useMe from '@/store/me';
import { formatedDate } from '@/utils/formatedDate';
import { Link, router } from 'expo-router';
import { Settings } from 'lucide-react-native';
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
				<View style={styles.header}>
					{!isMeLoading &&
						<Text style={[{ color: textColor }, styles.title]}>Привет, {name}!</Text>
					}
					<Link href={"/(app)/settings"} style={{ marginLeft: "auto" }}>
						<Settings size={34} color={textColor} />
					</Link>
				</View>

				<Wheel />

				<View style={[{ backgroundColor: backgroundColor }, styles.recent]}>

					<Text style={[{ color: textColor, backgroundColor: backgroundColor },
					styles.recentTitle]}>Последняя запись:</Text>

					{me?.recentMoods.map((e) => (
						<View key={e.createdAt} style={{ gap: 4 }}>
							<Text style={[{ color: textColor, }, styles.recentItem]}>
								<Text style={{ marginRight: 10, fontWeight: 600 }}>
									{e.moodName}
								</Text>
								{formatedDate(e.createdAt.toString())}
							</Text>
							{
								e.note &&
								<Text style={[{ color: secondaryText, borderTopColor: borderColor, borderTopWidth: 1, }]}>{e.note}</Text>
							}
						</View>
					))}

					<AppButton title="Открыть историю" onPress={() => router.push("/(app)/history")} style={{ marginTop: "auto" }} />
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
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	recent: {
		padding: 16,
		minHeight: 200,
		gap: 8,
		borderRadius: 8
	},
	recentTitle: {
		padding: 8,
		fontWeight: 600,
		borderRadius: 8
	},
	recentItem: {
		display: "flex",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 24,
		textAlign: "center",
	},
});
