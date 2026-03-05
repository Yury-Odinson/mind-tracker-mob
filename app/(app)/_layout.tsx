import { useThemeColor } from "@/hooks/use-theme-color";
import useAuth from "@/store/auth";
import { Tabs } from "expo-router";
import { CircleUserRound, History, Settings } from "lucide-react-native";

export default function GroupLayout() {
	const isHydrated = useAuth((state) => state.isHydrated);
	const accentColor = useThemeColor({}, "accent");
	const secondaryTextColor = useThemeColor({}, "secondaryText");
	const backgroundColor = useThemeColor({}, "background");
	const borderColor = useThemeColor({}, "border");

	if (!isHydrated) {
		return null;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: accentColor,
				tabBarInactiveTintColor: secondaryTextColor,
				sceneStyle: {
					backgroundColor,
				},
				tabBarStyle: {
					backgroundColor,
					borderTopColor: borderColor,
				},
			}}
		>
			<Tabs.Screen
				name="diary"
				options={{
					title: "Дневник",
					tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Профиль",
					tabBarIcon: ({ color, size }) => <CircleUserRound color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Настройки",
					tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
				}}
			/>
		</Tabs>
	);
};
