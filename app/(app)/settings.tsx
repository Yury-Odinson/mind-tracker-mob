import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import AppModal from "@/components/Modal";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateUserData } from "@/hooks/use-update-user-data";
import useAuth from "@/store/auth";
import useMe from "@/store/me";
import useHandleTheme from "@/store/theme";
import { UpdateMeFieldDTO } from "@/types/DTO";
import { Link } from "expo-router";
import { Moon, Pencil, Sun } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardTypeOptions, StyleSheet, Switch, View } from "react-native";
import { authStyles } from "../(auth)/login";

type EditableFieldConfig = {
	label: string;
	placeholder: string;
	modalTitle: string;
	keyboardType?: KeyboardTypeOptions;
	secureTextEntry?: boolean;
};

const editableFields: UpdateMeFieldDTO[] = ["name", "email", "password"];

const editableFieldConfig: Record<UpdateMeFieldDTO, EditableFieldConfig> = {
	name: {
		label: "Имя",
		placeholder: "Ваше имя",
		modalTitle: "Изменить имя"
	},
	email: {
		label: "Email",
		placeholder: "E-mail",
		modalTitle: "Изменить email",
	},
	password: {
		label: "Пароль",
		placeholder: "Новый пароль",
		modalTitle: "Изменить пароль",
		secureTextEntry: true,
	},
};

export default function SettingsScreen() {
	const logOut = useAuth((state) => state.logout);
	const theme = useHandleTheme((state) => state.theme);
	const toggleTheme = useHandleTheme((state) => state.toggle);

	const userStatus = useAuth((state) => state.status);
	const me = useMe((state) => state.data);

	const [activeField, setActiveField] = useState<UpdateMeFieldDTO | null>(null);
	const [modalValue, setModalValue] = useState("");
	const [modalError, setModalError] = useState("");

	const { isSubmitting, updateUserData } = useUpdateUserData();

	const textColor = useThemeColor({}, "text");
	const secondaryTextColor = useThemeColor({}, "secondaryText");
	const accentColor = useThemeColor({}, "accent");
	const borderStyle = useThemeColor({}, "border");
	const borderColor = useThemeColor({}, "border");
	const inputBgColor = useThemeColor({}, "inputBg");
	const warningColor = useThemeColor({}, "warning");

	const isLightTheme = theme === "light";

	const themeIcon = () => {
		if (isLightTheme) {
			return <Moon fill={"#c2c5cc"} stroke={"#c2c5cc"} />;
		}
		return <Sun fill={"#fcf48d"} stroke={"#fcf48d"} />;
	};

	const getDisplayValue = (field: UpdateMeFieldDTO): string => {
		if (field === "name") return me?.name?.trim() ? me.name : "Не указано";
		if (field === "email") return me?.email?.trim() ? me.email : "Не указан";
		return "••••••••";
	};

	const openFieldEditor = (field: UpdateMeFieldDTO) => {
		setActiveField(field);
		setModalError("");

		if (field === "name") {
			setModalValue(me?.name ?? "");
			return;
		}

		if (field === "email") {
			setModalValue(me?.email ?? "");
			return;
		}

		setModalValue("");
	};

	const closeFieldEditor = () => {
		if (isSubmitting) return;
		setActiveField(null);
		setModalValue("");
		setModalError("");
	};

	const handleSaveField = async () => {
		if (!activeField) return;

		const result = await updateUserData(activeField, modalValue);

		if (!result.isSuccess) {
			setModalError(result.message);
			return;
		}

		closeFieldEditor();
		Alert.alert("Успешно", result.message);
	};

	const userAction = () => {
		if (userStatus !== "auth") {
			return (
				<View style={[{ borderTopColor: borderStyle }, authStyles.assistant]}>
					<Link
						href={"/(auth)/login"}
						style={[{
							color: accentColor,
							borderBottomColor: accentColor,
						}, authStyles.link]}
					>
						Авторизоваться
					</Link>
				</View>
			);
		}

		return (
			<AppButton
				title={"Выйти из аккаунта"}
				onPress={logOut}
				style={{
					marginTop: "auto",
					backgroundColor: warningColor,
				}}
			/>
		);
	};

	const currentFieldConfig = activeField ? editableFieldConfig[activeField] : null;

	return (
		<View style={styles.container}>
			<AppText variant={"title"} weight={"bold"}>Настройки</AppText>

			{userStatus === "auth" && (
				<View>
					<AppText variant={"subtitle"} weight={"semibold"} style={{ marginBottom: 10 }}>Аккаунт</AppText>

					<View style={[{ borderColor, backgroundColor: inputBgColor }, styles.item]}>
						{editableFields.map((field) => (
							<View key={field} style={styles.inputLabel}>
								<AppText variant={"placeholder"}>{editableFieldConfig[field].label}</AppText>

								<View style={[styles.readonlyInput, { borderColor, backgroundColor: inputBgColor }]}>
									<AppText numberOfLines={1} style={[styles.readonlyText, { color: textColor }]}>
										{getDisplayValue(field)}
									</AppText>

									<AppButton
										style={styles.inputBtn}
										onPress={() => openFieldEditor(field)}
										fullWidth={false}
										icon={<Pencil size={16} stroke={secondaryTextColor} />}
									/>
								</View>
							</View>
						))}
					</View>
				</View>
			)}

			<View>
				<AppText variant={"subtitle"} weight={"semibold"} style={{ marginBottom: 10 }}>Внешний вид</AppText>

				<View style={[{ borderColor, backgroundColor: inputBgColor }, styles.item, styles.appearanceItem]}>
					<AppText>Тема оформления</AppText>

					<View style={{ marginLeft: "auto" }}>
						{themeIcon()}
					</View>

					<Switch value={!isLightTheme} onValueChange={toggleTheme} />
				</View>
			</View>

			{userAction()}

			<AppModal
				visible={Boolean(currentFieldConfig)}
				title={currentFieldConfig?.modalTitle ?? ""}
				placeholder={currentFieldConfig?.placeholder ?? ""}
				value={modalValue}
				onChangeValue={setModalValue}
				onClose={closeFieldEditor}
				onSave={handleSaveField}
				isSubmitting={isSubmitting}
				error={modalError}
				secureTextEntry={Boolean(currentFieldConfig?.secureTextEntry)}
				keyboardType={currentFieldConfig?.keyboardType}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 16,
	},
	item: {
		padding: 8,
		gap: 16,
		borderWidth: 1,
		borderRadius: 16,
	},
	appearanceItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	inputLabel: {
		position: "relative",
		width: "100%",
	},
	readonlyInput: {
		width: "100%",
		height: 40,
		borderWidth: 1,
		borderRadius: 8,
		paddingLeft: 10,
		paddingRight: 4,
		flexDirection: "row",
		alignItems: "center",
	},
	readonlyText: {
		flex: 1,
		paddingRight: 8,
	},
	inputBtn: {
		minHeight: 32,
		width: 32,
		paddingHorizontal: 0,
		borderRadius: 8,
		backgroundColor: "transparent",
	},
});
