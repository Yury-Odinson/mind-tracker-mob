import { apiRegistration } from "@/api/registration";
import useAuth from "@/store/auth";
import { LangDTO } from "@/types/DTO";
import { useCallback, useState } from "react";

function validateRegister(email: string, password: string): string {

	if (!email.trim()) {
		return "please, enter email";
	}

	if (!password) {
		return "please, enter password";
	}

	return "";
}

export function useRegisterAuth() {
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("we");
	const [password, setPassword] = useState<string>("we");
	const [lang, setLang] = useState<LangDTO>("ru");
	const [error, setError] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const applyToken = useAuth((state) => state.applyLogin);

	const handleSignUp = useCallback(async () => {
		const normalizedName = name.trim();
		const normalizedEmail = email.trim();
		const validationError = validateRegister(normalizedEmail, password);

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

			setError("Registration failed");
			return false;
		} finally {
			setIsSubmitting(false);
		}
	}, [applyToken, email, lang, name, password]);

	return {
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		lang,
		setLang,
		error,
		isSubmitting,
		handleSignUp,
	};
}
