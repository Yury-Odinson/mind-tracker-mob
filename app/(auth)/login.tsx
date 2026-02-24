import AppButton from "@/components/AppButton";
import { useLoginAuth } from "@/hooks/use-login-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link } from "expo-router";
import React from "react";
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
	const {
		email,
		setEmail,
		password,
		setPassword,
		error,
		isSubmitting,
		handleSignIn,
	} = useLoginAuth();

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
				<Text style={[{ color: textColor }, authStyles.title]}>Mind tracker</Text>
				<Text style={[{ color: secondaryTextColor }, authStyles.description]}>Отмечайте эмоции и наблюдайте динамику</Text>
				<TextInput
					style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }, authStyles.input]}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				{error ? <Text style={authStyles.errorText}>{error}</Text> : null}

				<AppButton
					title="Войти"
					onPress={handleSignIn}
					loading={isSubmitting}
					fullWidth={true}
					style={{ marginTop: 16 }}
				/>

				<Link href={"/(auth)/register"}
					style={[{ color: accentColor, borderBottomColor: accentColor, borderBottomWidth: 1 },
					authStyles.linkPass]}
				>Забыли пароль?</Link>

				<View style={[{ borderTopColor: borderStyle }, authStyles.assistant]}>
					<Text style={[{ color: secondaryTextColor }]}>Нет аккаунта?</Text>
					<Link href={"/(auth)/register"} style={[{ color: accentColor, borderBottomColor: accentColor }, authStyles.link]}>Зарегистрироваться</Link>
				</View>
			</View>
		</Pressable>
	);
};

export const authStyles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 16,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		marginTop: 100,
		fontSize: 34,
		fontWeight: 600,
	},
	description: {
		marginBottom: 20,
		fontSize: 20,
		textAlign: "center",
	},
	input: {
		width: "100%",
		height: 40,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
	},
	assistant: {
		padding: 16,
		gap: 10,
		marginTop: "auto",
		width: "100%",
		borderTopWidth: 1,
		alignItems: "center"
	},
	link: {
		fontSize: 18,
		fontWeight: 600,
		borderBottomWidth: 1
	},
	linkPass: {
		fontWeight: 600
	}
});
