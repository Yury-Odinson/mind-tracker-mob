import AppButton from "@/components/AppButton";
import { useRegisterAuth } from "@/hooks/use-register-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link } from "expo-router";
import React from "react";
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { authStyles } from "./login";

export default function RegisterScreen() {
	const {
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		confirmPassword,
		setConfirmPassword,
		error,
		isSubmitting,
		handleSignUp,
	} = useRegisterAuth();

	const accentColor = useThemeColor({}, "accent");
	const textColor = useThemeColor({}, "text");
	const secondaryTextColor = useThemeColor({}, "secondaryText");
	const borderStyle = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");

	return (
		<Pressable
			style={{ flex: 1 }}
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>
			<View style={authStyles.container}>
				<Text style={[{ color: textColor, marginBottom: 24, }, authStyles.title]}>Создать аккаунт</Text>
				<TextInput
					style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
					placeholder="Ваше имя"
					value={name}
					onChangeText={setName}
					autoCapitalize="none"
				/>
				<TextInput
					style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
					placeholder="E-mail"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
					placeholder="Пароль"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				<TextInput
					style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
					placeholder="Повторите пароль"
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
				/>
				<Text style={[{ color: secondaryTextColor, fontSize: 12 }]}>Пароль минимум 8 символов.</Text>

				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<AppButton
					title="Создать аккаунт"
					onPress={handleSignUp}
					loading={isSubmitting}
					style={{ marginTop: 6 }}
				/>

				<View style={[{ borderTopColor: borderStyle }, authStyles.assistant]}>
					<Text style={[{ color: secondaryTextColor }]}>
						Уже есть аккаунт?
						<Link href={"/(auth)/login"} style={[{ color: accentColor, borderBottomColor: accentColor, marginLeft: 10 }, authStyles.link]}>Войти</Link>
					</Text>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	errorText: {
		color: 'red',
		marginBottom: 10,
	},
});
