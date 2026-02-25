import { apiCreateMood } from "@/api/moods/create";
import { useCallback, useState } from "react";

type MoodSendResult = {
	isSuccess: boolean;
	message: string;
};

type StatusError = Error & { status?: number };

function extractStatus(error: unknown): number | null {
	if (typeof error === "object" && error !== null && "status" in error) {
		const status = (error as StatusError).status;
		return typeof status === "number" ? status : null;
	}

	return null;
}

function mapStatusToMessage(status: number | null): string {
	if (status === 500) {
		return "Ошибка сервера. Попробуйте позже.";
	}

	if (status === 401) {
		return "Нужно заново войти в аккаунт.";
	}

	return "Не удалось записать эмоцию.";
}

export function useMoodAdd() {
	const [moodId, setMoodId] = useState<number | null>(null);
	const [moodName, setMoodName] = useState<string>("");
	const [note, setNote] = useState<string>("");
	const [isSend, setIsSend] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const handleMoodSelect = useCallback((selectedMoodId: number, selectedMoodName: string) => {
		setMoodId(selectedMoodId);
		setMoodName(selectedMoodName);
		setError("");
	}, []);

	const handleSendMood = useCallback(async (): Promise<MoodSendResult> => {
		if (!moodId) {
			const message = "Сначала выберите эмоцию.";
			setError(message);
			return { isSuccess: false, message };
		}

		setIsSend(true);
		setError("");

		try {
			const status = await apiCreateMood({
				moodId,
				note: note.trim(),
			});

			const message = status === 200
				? "Эмоция сохранена."
				: `Эмоция отправлена. Статус: ${status}.`;

			setMoodId(null);
			setMoodName("");
			setNote("");
			return { isSuccess: true, message };
		} catch (error) {
			const status = extractStatus(error);
			const message = mapStatusToMessage(status);
			setError(message);
			return { isSuccess: false, message };
		} finally {
			setIsSend(false);
		}
	}, [moodId, note]);

	return {
		moodId,
		note,
		setNote,
		moodName,
		isSend,
		error,
		handleMoodSelect,
		handleSendMood,
	};
}
