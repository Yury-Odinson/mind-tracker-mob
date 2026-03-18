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
import { Alert, KeyboardTypeOptions, Switch, View } from "react-native";

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
				<View className="mt-auto w-full items-center gap-2.5 border-t pt-4" style={{ borderTopColor: borderStyle }}>
					<Link
						href={"/(auth)/login"}
						className="border-b text-[18px] font-semibold"
						style={{
							color: accentColor,
							borderBottomColor: accentColor,
						}}
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
		<View className="flex-1 gap-4 p-5">
			<AppText variant={"title"} weight={"bold"}>Настройки</AppText>

			{userStatus === "auth" && (
				<View>
					<AppText variant={"subtitle"} weight={"semibold"} className="mb-2.5">Аккаунт</AppText>

					<View
						className="gap-4 rounded-[18px] border p-2"
						style={{ borderColor, backgroundColor: inputBgColor }}
					>
						{editableFields.map((field) => (
							<View key={field} className="relative w-full">
								<AppText variant={"placeholder"}>{editableFieldConfig[field].label}</AppText>

								<View
									className="h-10 w-full flex-row items-center rounded-xl border pl-2.5 pr-1"
									style={{ borderColor, backgroundColor: inputBgColor }}
								>
									<AppText numberOfLines={1} className="flex-1 pr-2" style={{ color: textColor }}>
										{getDisplayValue(field)}
									</AppText>

									<AppButton
										style={{
											minHeight: 32,
											width: 32,
											backgroundColor: "transparent",
										}}
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
				<AppText variant={"subtitle"} weight={"semibold"} className="mb-2.5">Внешний вид</AppText>

				<View
					className="flex-row items-center gap-4 rounded-[18px] border p-2"
					style={{ borderColor, backgroundColor: inputBgColor }}
				>
					<AppText>Тема оформления</AppText>

					<View className="ml-auto">
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
