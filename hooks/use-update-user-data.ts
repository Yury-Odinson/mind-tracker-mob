import { apiUpdateUserField } from "@/api/user-data";
import useMe from "@/store/me";
import { UpdateMeFieldDTO } from "@/types/DTO";
import { useCallback, useState } from "react";

type UpdateResult = {
	isSuccess: boolean;
	message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFieldValue(field: UpdateMeFieldDTO, value: string): string {
	if (!value.trim()) {
		if (field === "name") return "Введите имя.";
		if (field === "email") return "Введите email.";
		return "Введите пароль.";
	}

	if (field === "email" && !emailPattern.test(value.trim())) {
		return "Введите корректный email.";
	}

	if (field === "password" && value.length < 8) {
		return "Пароль должен быть не короче 8 символов.";
	}

	return "";
}

function getSuccessMessage(field: UpdateMeFieldDTO): string {
	if (field === "name") return "Имя успешно обновлено.";
	if (field === "email") return "Email успешно обновлён.";
	return "Пароль успешно обновлён.";
}

export function useUpdateUserData() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const me = useMe((state) => state.data);
	const setMe = useMe((state) => state.setMe);
	const fetchMe = useMe((state) => state.fetchMe);

	const updateUserData = useCallback(async (field: UpdateMeFieldDTO, rawNewValue: string): Promise<UpdateResult> => {
		const normalizedNewValue = field === "password" ? rawNewValue : rawNewValue.trim();
		const validationError = validateFieldValue(field, normalizedNewValue);

		if (validationError) {
			return {
				isSuccess: false,
				message: validationError,
			};
		}

		const currentValue = field === "name"
			? (me?.name ?? "").trim()
			: field === "email"
				? (me?.email ?? "").trim()
				: normalizedNewValue;

		if ((field === "name" || field === "email") && !currentValue) {
			return {
				isSuccess: false,
				message: field === "name" ? "Не удалось определить текущее имя." : "Не удалось определить текущий email.",
			};
		}

		setIsSubmitting(true);

		try {
			await apiUpdateUserField({
				field,
				currentValue,
				newValue: normalizedNewValue,
			});

			if (field === "name" || field === "email") {
				if (me) {
					setMe({
						...me,
						[field]: normalizedNewValue,
					});
				}
				await fetchMe();
			}

			return {
				isSuccess: true,
				message: getSuccessMessage(field),
			};
		} catch (error) {
			return {
				isSuccess: false,
				message: error instanceof Error ? error.message : "Не удалось обновить данные. Попробуйте снова.",
			};
		} finally {
			setIsSubmitting(false);
		}
	}, [fetchMe, me, setMe]);

	return {
		isSubmitting,
		updateUserData,
	};
}
