import AppText from '@/components/AppText';
import MoodListItem from '@/components/MoodListItem';
import { useMoodList } from '@/hooks/use-mood-list';
import { usePagination } from '@/hooks/use-pagination';
import { useThemeColor } from '@/hooks/use-theme-color';
import { deleteMood, updateMood } from '@/repositories/mood.repository';
import { useFocusEffect } from '@react-navigation/native';
import { MoveLeft, MoveRight } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type MoodActionResult = {
	isSuccess: boolean;
	message: string;
};

type MoodUpdatePayload = {
	moodId?: number;
	note?: string;
};

type StatusError = Error & { status?: number };

function extractStatus(error: unknown): number | null {
	if (typeof error === "object" && error !== null && "status" in error) {
		const status = (error as StatusError).status;
		return typeof status === "number" ? status : null;
	}

	return null;
}

function mapActionError(action: "update" | "delete", status: number | null): string {
	if (status === 404) {
		return "Запись не найдена. Обновите список.";
	}

	if (status === 401) {
		return "Нужно заново войти в аккаунт.";
	}

	if (status === 500) {
		return "Ошибка сервера. Попробуйте позже.";
	}

	return action === "update"
		? "Не удалось обновить запись."
		: "Не удалось удалить запись.";
}

export default function DiaryScreen() {

	const { moods, page, totalPages, isLoading, loadMoods } = useMoodList();

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

	const handleUpdateMood = useCallback(async (entryId: number, payload: MoodUpdatePayload): Promise<MoodActionResult> => {
		try {
			await updateMood({
				entryId,
				moodId: payload.moodId,
				note: payload.note,
			});
			await loadMoods(page);
			return {
				isSuccess: true,
				message: "Запись обновлена.",
			};
		} catch (error) {
			return {
				isSuccess: false,
				message: mapActionError("update", extractStatus(error)),
			};
		}
	}, [loadMoods, page]);

	const handleDeleteMood = useCallback(async (entryId: number): Promise<MoodActionResult> => {
		try {
			await deleteMood({ entryId });
			await loadMoods(page);
			return {
				isSuccess: true,
				message: "Запись удалена.",
			};
		} catch (error) {
			return {
				isSuccess: false,
				message: mapActionError("delete", extractStatus(error)),
			};
		}
	}, [loadMoods, page]);

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
				<AppText variant={"title"} weight={"bold"}>Дневник</AppText>

				<ScrollView>
					{moods && moods.map(e => (
						<MoodListItem
							key={e.id}
							id={e.id}
							moodId={e.moodId}
							moodName={e.moodName}
							note={e.note}
							createdAt={e.createdAt}
							color={e.color}
							onUpdate={handleUpdateMood}
							onDelete={handleDeleteMood}
						/>
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
