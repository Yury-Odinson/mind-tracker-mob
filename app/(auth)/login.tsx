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

	return (
		<Pressable
			style={{ flex: 1 }}
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>
			<View style={styles.container}>
				<Text style={[{ color: textColor }, styles.title]}>Mind tracker</Text>
				<Text style={[{ color: secondaryTextColor }, styles.description]}>Отмечайте эмоции и наблюдайте динамику</Text>
				<TextInput
					style={[{ color: textColor, borderColor: borderStyle }, styles.input]}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					style={[{ color: textColor, borderColor: borderStyle }, styles.input]}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<AppButton
					title="Войти"
					onPress={handleSignIn}
					loading={isSubmitting}
					fullWidth={true}
					style={{ marginTop: 16 }}
				/>

				<Link href={"/(auth)/register"}
					style={[{ color: accentColor, borderBottomColor: accentColor, borderBottomWidth: 1 },
					styles.linkPass]}
				>Забыли пароль?</Link>

				<View style={[{ borderTopColor: borderStyle }, styles.assistant]}>
					<Text style={[{ color: textColor }]}>Нет аккаунта?</Text>
					<Link href={"/(auth)/register"} style={[{ color: accentColor, borderBottomColor: accentColor }, styles.link]}>Зарегистрироваться</Link>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 16,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		marginTop: 34,
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
		backgroundColor: "#fff",
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
