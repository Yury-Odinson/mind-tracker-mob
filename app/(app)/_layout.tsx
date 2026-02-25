import { useThemeColor } from "@/hooks/use-theme-color";
import useAuth from "@/store/auth";
import { Redirect, Tabs } from "expo-router";
import { History, Settings, User } from "lucide-react-native";

export default function GroupLayout() {
	const isAuthenticated = useAuth((state) => state.isAuthenticated);
	const isHydrated = useAuth((state) => state.isHydrated);
	const accentColor = useThemeColor({}, "accent");
	const secondaryTextColor = useThemeColor({}, "secondaryText");
	const backgroundColor = useThemeColor({}, "background");
	const borderColor = useThemeColor({}, "border");

	if (!isHydrated) {
		return null;
	}

	if (!isAuthenticated) {
		return <Redirect href="/(auth)/login" />;
	};

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
				name="profile"
				options={{
					title: "Профиль",
					tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "История",
					tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
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
