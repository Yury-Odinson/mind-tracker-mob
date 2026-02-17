import useAuth from "@/store/auth";
import { Redirect } from "expo-router";

export default function Index() {

	const isAuthenticated = useAuth((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Redirect href={"/(app)/profile"} />
	}

	return (
		<Redirect href={"/(auth)/login"} />
	);
};
