import useAuth from "@/store/auth";
import { Redirect, Stack } from "expo-router";

export default function GroupLayout() {
	const isAuthenticated = useAuth((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Redirect href="/(app)/profile" />;
	};

	return <Stack screenOptions={{ headerShown: false }} />;
};
