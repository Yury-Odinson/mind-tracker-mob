import { useCallback, useMemo } from "react";

export type PageItem = number | "...";

function buildPages(current: number, total: number, siblings = 2): PageItem[] {
	if (total <= 1) return total === 1 ? [1] : [];

	const pages: PageItem[] = [];

	const left = Math.max(2, current - siblings);
	const right = Math.min(total - 1, current + siblings);

	pages.push(1);

	if (left > 2) {
		pages.push('...');
	} else {
		for (let i = 2; i < left; i++) pages.push(i);
	}

	for (let i = left; i <= right; i++) pages.push(i);

	if (right < total - 1) {
		pages.push('...');
	} else {
		for (let i = right + 1; i < total; i++) pages.push(i);
	}

	if (total > 1) pages.push(total);

	return pages;
}

type UsePaginationParams = {
	current: number;
	total: number;
	siblings?: number;
	onChange: (page: number) => void;
};

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function usePagination({ current, total, siblings = 2, onChange }: UsePaginationParams) {
	const safeTotal = Math.max(0, total);
	const safeCurrent = safeTotal > 0 ? clamp(current, 1, safeTotal) : 1;
	const pages = useMemo(() => buildPages(safeCurrent, safeTotal, siblings), [safeCurrent, safeTotal, siblings]);

	const goTo = useCallback((nextPage: number) => {
		if (safeTotal <= 0) return;

		const clampedPage = clamp(nextPage, 1, safeTotal);
		if (clampedPage !== safeCurrent) {
			onChange(clampedPage);
		}
	}, [onChange, safeCurrent, safeTotal]);

	const canPrev = safeCurrent > 1;
	const canNext = safeCurrent < safeTotal;

	const goPrev = useCallback(() => {
		goTo(safeCurrent - 1);
	}, [goTo, safeCurrent]);

	const goNext = useCallback(() => {
		goTo(safeCurrent + 1);
	}, [goTo, safeCurrent]);

	return {
		current: safeCurrent,
		pages,
		total: safeTotal,
		canPrev,
		canNext,
		goTo,
		goPrev,
		goNext,
	};
}
