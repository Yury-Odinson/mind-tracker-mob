import { apiGetMood } from "@/api/moods/get";
import { MoodDTO } from "@/types/DTO";
import { useCallback, useState } from "react";

export function useMoodList() {
	const [moods, setMoods] = useState<MoodDTO[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [limit, setLimit] = useState<number>(20);
	const [error, setError] = useState<string>("");

	const loadMoods = useCallback(async () => {
		setIsLoading(true);
		setError("");

		try {
			const response = await apiGetMood({ page, limit });
			setMoods(response.data);
			setTotal(response.total);
			setTotalPages(response.totalPages);
			setPage(response.currentPage);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to load moods";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [page, limit]);

	return {
		moods,
		setMoods,
		total,
		setTotal,
		page,
		setPage,
		totalPages,
		setTotalPages,
		isLoading,
		setIsLoading,
		error,
		loadMoods,
		limit,
		setLimit
	};
};
