import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import { useLoginAuth } from "@/hooks/use-login-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link } from "expo-router";
import React from "react";
import { Keyboard, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

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
	const borderStyle = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");

	return (
		<Pressable
			style={{ flex: 1 }}
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>
			<View style={authStyles.container}>
				<AppText variant={"title"} weight={"bold"} style={{ marginTop: 100, fontSize: 34 }}>Mind tracker</AppText>
				<AppText variant={"subtitle"} tone={"secondaryText"} style={authStyles.description}>Отмечайте эмоции и наблюдайте динамику</AppText>

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
				{error ? <AppText tone={"warning"}>{error}</AppText> : null}

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
					<AppText tone={"secondaryText"}>Нет аккаунта?</AppText>
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
