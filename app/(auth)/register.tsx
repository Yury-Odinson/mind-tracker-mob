import AppButton from "@/components/AppButton";
import useAuth from "@/store/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const logIn = useAuth((state) => state.login);

	const handleSignIn = async () => {
		let validationError = "";

		if (!email.trim()) {
			validationError = "Пожалуйста, введите email";
		} else if (!password) {
			validationError = "Пожалуйста, введите пароль";
		};

		if (validationError) {
			setError(validationError);
			return;
		};

		setError("");

		try {
			console.log("Registration data:", { name, email, password });
			logIn();
		} catch (err) {
			console.log(err);
			setError("Invalid data");
		};
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Регистрация</Text>
			<TextInput
				style={styles.input}
				placeholder="Ваше имя"
				value={name}
				onChangeText={setName}
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="E-mail"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Пароль"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
			<View style={styles.controls}>
				<AppButton
					title="Войти"
					onPress={() => router.replace("/(auth)/login")}
					fullWidth={false}
					variant="secondary"
					style={{
						alignSelf: "flex-start"
					}}
				/>
				<AppButton
					title="Зарегистрироваться"
					onPress={handleSignIn}
					fullWidth={false}
					style={{
						flex: 1
					}}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
	},
	input: {
		width: "100%",
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
	},
	controls: {
		marginTop: 16,
		flexDirection: "row",
		gap: 16,
		width: "100%"
	},
});
