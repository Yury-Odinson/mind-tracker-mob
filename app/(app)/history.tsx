import MoodListItem from '@/components/MoodListItem';
import { useMoodList } from '@/hooks/use-mood-list';
import { usePagination } from '@/hooks/use-pagination';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from '@react-navigation/native';
import { MoveLeft, MoveRight } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {

	const { moods, page, total, totalPages, isLoading, loadMoods } = useMoodList();

	const textColor = useThemeColor({}, "text");
	const accentColor = useThemeColor({}, "accent");
	const borderColor = useThemeColor({}, "border");
	const secondaryText = useThemeColor({}, "secondaryText");

	const pagination = usePagination({
		current: page,
		total: totalPages ?? 0,
		onChange: (nextPage) => {
			void loadMoods(nextPage);
		},
	});

	useFocusEffect(
		useCallback(() => {
			void loadMoods();
		}, [loadMoods]),
	);

	const paginationSection = () => {
		if (!totalPages || totalPages <= 1) return null;

		return (
			<View style={styles.pagination}>
				<Pressable
					onPress={pagination.goPrev}
					disabled={!pagination.canPrev || isLoading}
					style={[styles.paginationBtn, { borderColor }]}
				>
					<MoveLeft color={pagination.canPrev && !isLoading ? textColor : secondaryText} />
				</Pressable>

				{pagination.pages.map((item, index) => {
					if (item === "...") {
						return (
							<Text key={`dots-${index}`} style={{ color: secondaryText }}>
								...
							</Text>
						);
					}

					const isActive = item === page;
					return (
						<Pressable
							key={item}
							onPress={() => pagination.goTo(item)}
							disabled={isActive || isLoading}
							style={[
								styles.paginationBtn,
								{
									borderColor: isActive ? accentColor : borderColor,
									backgroundColor: isActive ? accentColor : "transparent",
								},
							]}
						>
							<Text style={{ color: isActive ? "#fff" : textColor }}>{item}</Text>
						</Pressable>
					);
				})}

				<Pressable
					onPress={pagination.goNext}
					disabled={!pagination.canNext || isLoading}
					style={[styles.paginationBtn, { borderColor }]}
				>
					<MoveRight color={pagination.canNext && !isLoading ? textColor : secondaryText} />
				</Pressable>
			</View>
		);
	}

	return (
		<>
			<View style={styles.container}>
				<Text style={[{ color: textColor, fontSize: 20 }]}>История</Text>

				<ScrollView>
					{moods && moods.map(e => (
						<MoodListItem key={e.createdAt} moodName={e.moodName} note={e.note} createdAt={e.createdAt} color={e.color} />
					))}
				</ScrollView>

			</View>
			<View style={styles.actions}>
				{paginationSection()}
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
		paddingHorizontal: 20,
		paddingVertical: 4,
		alignItems: "center",
	},
	pagination: {
		flexDirection: "row",
		gap: 8,
	},
	paginationBtn: {
		width: 36,
		height: 36,
		borderWidth: 1,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10,
	}
});
