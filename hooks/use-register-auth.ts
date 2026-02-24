import { apiRegistration } from "@/api/registration";
import useAuth from "@/store/auth";
import { LangDTO } from "@/types/DTO";
import { useCallback, useState } from "react";

type ValidateRegister = {
	email: string;
	password: string;
	confirmPassword: string;
}

function validateRegister({ email, password, confirmPassword }: ValidateRegister): string {

	if (!email.trim()) {
		return "Пожалуйста, введите email";
	}

	if (!password) {
		return "Пожалуйста, введите пароль";
	}

	if (password !== confirmPassword) {
		return "Пароли не совпадают"
	}

	return "";
}

export function useRegisterAuth() {
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [lang, setLang] = useState<LangDTO>("ru");
	const [error, setError] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const applyToken = useAuth((state) => state.applyLogin);

	const handleSignUp = useCallback(async () => {
		const normalizedName = name.trim();
		const normalizedEmail = email.trim();
		const validationError = validateRegister({ email, password, confirmPassword });

		if (validationError) {
			setError(validationError);
			return false;
		}

		setError("");
		setIsSubmitting(true);

		try {
			const { accessToken, refreshToken } = await apiRegistration({
				name: normalizedName,
				email: normalizedEmail,
				password,
				lang,
			});
			await applyToken(accessToken, refreshToken);
			return true;
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				return false;
			}

			setError("Что-то пошло не так");
			return false;
		} finally {
			setIsSubmitting(false);
		}
	}, [applyToken, email, lang, name, password, confirmPassword]);

	return {
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		confirmPassword,
		setConfirmPassword,
		lang,
		setLang,
		error,
		isSubmitting,
		handleSignUp,
	};
}
