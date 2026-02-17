import AppButton from "@/components/AppButton";
import useAuth from "@/store/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const logIn = useAuth((state) => state.login);

	const handleSignIn = async () => {
		let validationError = "";

		if (!email.trim()) {
			validationError = "please, enter email";
		} else if (!password) {
			validationError = "please, enter password";
		};

		if (validationError) {
			setError(validationError);
			return;
		};

		setError("");

		try {
			console.log("Signing in with:", { email, password });
			logIn();
		} catch (err) {
			console.log(err);
			setError("Invalid email or password");
		};
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Авторизация</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
			<View style={styles.controls}>
				<AppButton
					title="Регистрация"
					onPress={() => router.replace("/(auth)/register")}
					fullWidth={false}
					variant="secondary"
					style={{
						alignSelf: "flex-start"
					}}
				/>
				<AppButton
					title="Войти"
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
