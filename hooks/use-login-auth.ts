import { apiAuth } from "@/api/auth";
import useAuth from "@/store/auth";
import { useCallback, useState } from "react";

function validateLogin(email: string, password: string): string {
	if (!email.trim()) {
		return "please, enter email";
	}

	if (!password) {
		return "please, enter password";
	}

	return "";
}

export function useLoginAuth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
			const { accessToken } = await apiAuth({ email: normalizedEmail, password });
			await applyToken(accessToken);
			return true;
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				return false;
			}

			setError("Authentication failed");
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
