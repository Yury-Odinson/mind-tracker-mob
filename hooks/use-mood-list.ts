import { apiGetMood } from "@/api/moods/get";
import { MoodDTO } from "@/types/DTO";
import { useCallback, useRef, useState } from "react";

export function useMoodList() {
	const [moods, setMoods] = useState<MoodDTO[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [limit, setLimit] = useState<number>(20);
	const [error, setError] = useState<string>("");
	const pageRef = useRef<number>(page);
	pageRef.current = page;

	const loadMoods = useCallback(async (requestedPage?: number) => {
		const targetPage = requestedPage ?? pageRef.current;

		setIsLoading(true);
		setError("");
		setPage(targetPage);

		try {
			const response = await apiGetMood({
				page: targetPage,
				limit,
			});
			setMoods(response.data);
			setTotal(response.total);
			setTotalPages(response.totalPages);
			setPage(typeof response.currentPage === "number" ? response.currentPage : targetPage);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to load moods";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [limit]);

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
