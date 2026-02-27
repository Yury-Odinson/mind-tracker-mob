import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import { useThemeColor } from '@/hooks/use-theme-color';
import useAuth from '@/store/auth';
import useMe from '@/store/me';
import useHandleTheme from '@/store/theme';
import { Moon, Sun } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, TextInput, View } from 'react-native';
import { authStyles } from '../(auth)/login';

export default function SettingsScreen() {

	const logOut = useAuth((state) => state.logout);
	const theme = useHandleTheme((state) => state.theme);
	const toggleTheme = useHandleTheme((state) => state.toggle);

	const me = useMe((state) => state.data);

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

	useEffect(() => {
		if (!me) {
			setName("");
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setIsFormDirty(false);
			return;
		}

		if (!isFormDirty) {
			setName(me.name);
			setEmail(me.email);
		}
	}, [isFormDirty, me]);

	const handleNameChange = (value: string) => {
		setIsFormDirty(true);
		setName(value);
	};

	const handleEmailChange = (value: string) => {
		setIsFormDirty(true);
		setEmail(value);
	};

	const handlePasswordChange = (value: string) => {
		setIsFormDirty(true);
		setPassword(value);
	};

	const handleConfirmPasswordChange = (value: string) => {
		setIsFormDirty(true);
		setConfirmPassword(value);
	};

	const textColor = useThemeColor({}, "text");
	const secondaryTextColor = useThemeColor({}, "secondaryText");
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

			<AppText variant={"title"} weight={"bold"}>Настройки</AppText>

			<View>
				<AppText variant={"subtitle"} weight={"semibold"} style={{ marginBottom: 10 }}>Аккаунт</AppText>

				<View style={[{ borderColor: borderColor, backgroundColor: inputBgColor }, styles.item]}>

					<View style={styles.inputLabel}>
						{name !== "" &&
							<AppText variant={"placeholder"}>Имя</AppText>
						}
						<TextInput
							style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
							placeholder="Ваше имя"
							value={name}
							onChangeText={handleNameChange}
							autoCapitalize="none"
						/>
					</View>

					<View style={styles.inputLabel}>
						{email !== "" &&
							<AppText variant={"placeholder"}>Email</AppText>
						}
						<TextInput
							style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
							placeholder="E-mail"
							value={email}
							onChangeText={handleEmailChange}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					</View>

					<View style={styles.inputLabel}>
						{password !== "" &&
							<AppText variant={"placeholder"}>Пароль</AppText>
						}
						<TextInput
							style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
							placeholder="Пароль"
							value={password}
							onChangeText={handlePasswordChange}
							secureTextEntry
						/>
					</View>

					<View style={styles.inputLabel}>
						{confirmPassword !== "" &&
							<AppText variant={"placeholder"}>Повторите пароль</AppText>
						}
						<TextInput
							style={[{ color: textColor, backgroundColor: inputBgColor, borderColor: borderColor }, authStyles.input]}
							placeholder="Повторите пароль"
							value={confirmPassword}
							onChangeText={handleConfirmPasswordChange}
							secureTextEntry
						/>
					</View>
				</View>
			</View>

			<View>
				<AppText variant={"subtitle"} weight={"semibold"} style={{ marginBottom: 10 }}>Внешний вид</AppText>

				<View style={[{ borderColor: borderColor, backgroundColor: inputBgColor, flexDirection: "row" }, styles.item]}>
					<AppText>Тема оформления</AppText>

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
		fontSize: 26,
		fontWeight: 600
	},
	subTitle: {
		marginBottom: 12,
		fontSize: 22,
		fontWeight: 600
	},
	item: {
		padding: 8,
		gap: 16,
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderRadius: 16,
	},
	inputLabel: {
		position: "relative",
		width: "100%",
	}
});
