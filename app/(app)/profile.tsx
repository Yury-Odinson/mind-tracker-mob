import AppButton from '@/components/AppButton';
import { useThemeColor } from '@/hooks/use-theme-color';
import useMe from '@/store/me';
import { formatedDate } from '@/utils/formatedDate';
import { Link, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import GearIcon from '../../assets/images/gear.svg';

export default function ProfileScreen() {
	const me = useMe((state) => state.data);
	const isMeLoading = useMe((state) => state.isLoading);
	const textColor = useThemeColor({}, "text");
	const name = me?.name ?? "user";

	return (
		<View style={styles.container}>

			<View style={styles.profile}>
				<View style={styles.header}>
					{!isMeLoading &&
						<>
							<Text style={[{ color: textColor }, styles.title]}>Привет, {name}!</Text>

							<Link href={"/(app)/settings"} style={styles.gear}>
								<GearIcon width={34} height={34} />
							</Link>
						</>
					}
				</View>

				<View style={styles.wheel}>
					<Text style={[{ color: textColor, fontWeight: 600 }]}>wheel</Text>
				</View>

				<View style={styles.recent}>

					<Text style={[{ color: textColor, fontWeight: 600 }]}>Последние записи:</Text>

					{me?.recentMoods.map(e => (
						<View key={e.createdAt} style={styles.recentItem}>
							<Text style={[{ color: textColor }]}>{e.moodName}</Text>
							<Text style={[{ color: textColor }]}>{formatedDate(e.createdAt.toString())}</Text>
							<Text style={[{ color: textColor }]}>{e.note}</Text>
						</View>
					))}

					<AppButton title="Открыть историю" onPress={() => router.push("/(app)/history")} />
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
		backgroundColor: "#b7dfff"
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
	gear: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: 44,
		height: 44,
		backgroundColor: "#fff",
		borderRadius: 8
	},
	wheel: {
		flex: 1,
		borderWidth: 1
	},
	recent: {
		padding: 16,
		backgroundColor: "#fff",
		borderRadius: 8
	},
	recentItem: {
		borderBottomWidth: 1,
		borderBottomColor: "red"
	},
	title: {
		fontSize: 24,
		textAlign: "center",
	},
});
