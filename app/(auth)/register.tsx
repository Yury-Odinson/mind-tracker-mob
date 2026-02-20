import AppButton from "@/components/AppButton";
import { useRegisterAuth } from "@/hooks/use-register-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import React from "react";
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function RegisterScreen() {
	const {
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		error,
		isSubmitting,
		handleSignUp,
	} = useRegisterAuth();

	const textColor = useThemeColor({}, "text");

	return (
		<Pressable
			style={{ flex: 1 }}
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>
			<View style={styles.container}>
				<Text style={[{ color: textColor }, styles.title]}>Регистрация</Text>
				<TextInput
					style={[{ color: textColor }, styles.input]}
					placeholder="Ваше имя"
					value={name}
					onChangeText={setName}
					autoCapitalize="none"
				/>
				<TextInput
					style={[{ color: textColor }, styles.input]}
					placeholder="E-mail"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					style={[{ color: textColor }, styles.input]}
					placeholder="Пароль"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				{error ? <Text style={styles.errorText}>{error}</Text> : null}
				<View style={styles.controls}>
					<AppButton
						title="Войти"
						onPress={() => router.push("/(auth)/login")}
						disabled={isSubmitting}
						fullWidth={false}
						variant="secondary"
						style={{
							alignSelf: "flex-start"
						}}
					/>
					<AppButton
						title="Зарегистрироваться"
						onPress={handleSignUp}
						loading={isSubmitting}
						fullWidth={false}
						style={{
							flex: 1
						}}
					/>
				</View>
			</View>
		</Pressable>
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
