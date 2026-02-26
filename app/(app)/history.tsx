import MoodListItem from '@/components/MoodListItem';
import { useMoodList } from '@/hooks/use-mood-list';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {

	const { moods, page, total, loadMoods } = useMoodList();

	const textColor = useThemeColor({}, "text");

	useFocusEffect(
		useCallback(() => {
			void loadMoods();
		}, [loadMoods]),
	);

	return (
		<>
			<View style={styles.container}>
				<Text style={[{ color: textColor, fontSize: 20 }]}>История</Text>

				<ScrollView>
					{moods && moods.map(e => (
						<MoodListItem key={e.createdAt} moodName={e.moodName} note={e.note} createdAt={e.createdAt} />
					))}
				</ScrollView>

			</View>
			<View style={styles.actions}>
				<Text>page: {page}</Text>
				<Text>total: {total}</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 16
	},
	actions: {
		padding: 20,
	}
});
