import AppButton from "@/components/AppButton";
import { useRegisterAuth } from "@/hooks/use-register-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link } from "expo-router";
import React from "react";
import { Keyboard, Platform, Pressable, Text, TextInput, View } from "react-native";

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
	const warningColor = useThemeColor({}, "warning");

	return (
		<Pressable
			className="flex-1"
			onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
		>
			<View className="flex-1 items-center justify-center gap-4 p-5">
				<Text className="mb-6 text-[34px] font-bold leading-[40px]" style={{ color: textColor }}>
					Создать аккаунт
				</Text>
				<TextInput
					className="relative h-10 w-full rounded-[18px] border px-2.5"
					style={{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }}
					placeholder="Ваше имя"
					value={name}
					onChangeText={setName}
					autoCapitalize="none"
				/>
				<TextInput
					className="relative h-10 w-full rounded-[18px] border px-2.5"
					style={{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }}
					placeholder="E-mail"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					className="relative h-10 w-full rounded-[18px] border px-2.5"
					style={{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }}
					placeholder="Пароль"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
				<TextInput
					className="relative h-10 w-full rounded-[18px] border px-2.5"
					style={{ color: textColor, backgroundColor: inputBgColor, borderColor: borderStyle }}
					placeholder="Повторите пароль"
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
				/>
				<Text style={[{ color: secondaryTextColor, fontSize: 12 }]}>Пароль минимум 8 символов.</Text>

				{error ? <Text className="mb-2.5" style={{ color: warningColor }}>{error}</Text> : null}

				<AppButton
					title="Создать аккаунт"
					onPress={handleSignUp}
					loading={isSubmitting}
					style={{ marginTop: 6 }}
				/>

				<View className="mt-auto w-full items-center gap-2.5 border-t pt-4" style={{ borderTopColor: borderStyle }}>
					<Text style={[{ color: secondaryTextColor }]}>
						Уже есть аккаунт?
						<Link
							href={"/(auth)/login"}
							className="ml-2.5 border-b text-[18px] font-semibold"
							style={{ color: accentColor, borderBottomColor: accentColor }}
						>
							Войти
						</Link>
					</Text>
				</View>
			</View>
		</Pressable>
	);
}
