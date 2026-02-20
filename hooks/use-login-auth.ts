import { apiAuth } from "@/api/auth";
import useAuth from "@/store/auth";
import { useCallback, useState } from "react";

const DEFAULT_LOGIN_ERROR = "Не удалось выполнить вход. Попробуйте еще раз.";

function validateLogin(email: string, password: string): string {
	if (!email.trim()) {
		return "Введите email.";
	}

	if (!password) {
		return "Введите пароль.";
	}

	return "";
}

function toUserLoginError(error: unknown): string {
	if (!(error instanceof Error)) {
		return DEFAULT_LOGIN_ERROR;
	}

	const message = error.message.trim();
	const normalizedMessage = message.toLowerCase();

	if (normalizedMessage.includes("401")) {
		return "Неверный email или пароль.";
	}

	if (normalizedMessage.includes("500")) {
		return "Ошибка сервера. Попробуйте позже.";
	}

	return "Не удалось выполнить вход. Проверьте данные и попробуйте снова.";

}

export function useLoginAuth() {
	const [email, setEmail] = useState("we");
	const [password, setPassword] = useState("we");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const applyToken = useAuth((state) => state.applyLogin);

	const handleSignIn = useCallback(async () => {
		const normalizedEmail = email.trim();
		const validationError = validateLogin(normalizedEmail, password);

		if (validationError) {
			setError(validationError);
			return false;
		}

		setError("");
		setIsSubmitting(true);

		try {
			const { accessToken, refreshToken } = await apiAuth({ email: normalizedEmail, password });
			await applyToken(accessToken, refreshToken);
			return true;
		} catch (error) {
			setError(toUserLoginError(error));
			return false;
		} finally {
			setIsSubmitting(false);
		}
	}, [applyToken, email, password]);

	return {
		email,
		setEmail,
		password,
		setPassword,
		error,
		isSubmitting,
		handleSignIn,
	};
}
