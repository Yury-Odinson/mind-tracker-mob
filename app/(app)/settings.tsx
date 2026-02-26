import AppButton from '@/components/AppButton';
import { useThemeColor } from '@/hooks/use-theme-color';
import useAuth from '@/store/auth';
import useHandleTheme from '@/store/theme';
import { Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { authStyles } from '../(auth)/login';

export default function SettingsScreen() {

	const logOut = useAuth((state) => state.logout);
	const theme = useHandleTheme((state) => state.theme);
	const toggleTheme = useHandleTheme((state) => state.toggle);

	const [name, setName] = useState<string>();
	const [email, setEmail] = useState<string>();
	const [password, setPassword] = useState<string>();
	const [confirmPassword, setConfirmPassword] = useState<string>();

	const textColor = useThemeColor({}, "text");
	const borderColor = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");
	const warningColor = useThemeColor({}, "warning");

	const isLightTheme = theme === "light" ? true : false;

	const themeIcon = () => {

		if (isLightTheme) {
			return <Moon fill={"#c2c5cc"} stroke={"#c2c5cc"} />;
		} else {
			return <Sun fill={"#fcf48d"} stroke={"#fcf48d"} />;
		}
	}

	return (
		<View style={styles.container}>

			<Text style={[{ color: textColor }, styles.title]}>Настройки</Text>

			<View>

				<Text style={[{ color: textColor }, styles.title]}>Аккаунт</Text>
				<View style={[{ borderColor: borderColor, backgroundColor: inputBgColor }, styles.item]}>
					<TextInput
						style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
						placeholder="Ваше имя"
						value={name}
						onChangeText={setName}
						autoCapitalize="none"
					/>
					<TextInput
						style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
						placeholder="E-mail"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					<TextInput
						style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
						placeholder="Пароль"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>
					<TextInput
						style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
						placeholder="Повторите пароль"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
					/>
				</View>
			</View>

			<View>
				<Text style={[{ color: textColor }, styles.title]}>Внешний вид</Text>
				<View style={[{ borderColor: borderColor, backgroundColor: inputBgColor, flexDirection: "row" }, styles.item]}>
					<Text style={[{ color: textColor }, { fontSize: 20 }]}>Тема оформления</Text>
					<View style={{ marginLeft: "auto" }}>
						{themeIcon()}
					</View>
					<Switch value={!isLightTheme} onValueChange={toggleTheme} />
				</View>
			</View>

			<AppButton
				title={"Выйти из аккаунта"}
				onPress={logOut}
				style={{
					marginTop: "auto",
					backgroundColor: warningColor
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 16
	},
	title: {
		marginBottom: 12,
		fontSize: 24,
		fontWeight: 600
	},
	item: {
		padding: 8,
		gap: 16,
		// flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderRadius: 16,
	}
});
