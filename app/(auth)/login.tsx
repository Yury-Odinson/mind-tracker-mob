import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import { useLoginAuth } from "@/hooks/use-login-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link } from "expo-router";
import React from "react";
import { Keyboard, Platform, Pressable, TextInput, View } from "react-native";

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
			className="flex-1"
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>
			<View className="flex-1 items-center justify-center gap-4 p-5">
				<AppText variant={"title"} weight={"bold"} className="mt-[100px] text-[34px] leading-[40px]">
					Mind tracker
				</AppText>
				<AppText variant={"subtitle"} tone={"secondaryText"} className="mb-5 text-center">
					Отмечайте эмоции и наблюдайте динамику
				</AppText>

				<TextInput
					className="relative h-10 w-full rounded-[18px] border px-2.5"
					style={{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					className="relative h-10 w-full rounded-[18px] border px-2.5"
					style={{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }}
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

				<Link
					href={"/(auth)/register"}
					className="border-b font-semibold"
					style={{ color: accentColor, borderBottomColor: accentColor }}
				>
					Забыли пароль?
				</Link>

				<View className="mt-auto w-full items-center gap-2.5 border-t pt-4" style={{ borderTopColor: borderStyle }}>
					<AppText tone={"secondaryText"}>Нет аккаунта?</AppText>
					<Link
						href={"/(auth)/register"}
						className="border-b text-[18px] font-semibold"
						style={{ color: accentColor, borderBottomColor: accentColor }}
					>
						Зарегистрироваться
					</Link>
				</View>
			</View>
		</Pressable>
	);
}
