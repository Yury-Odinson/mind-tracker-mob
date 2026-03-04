import useAuth from "@/store/auth";
import { Redirect } from "expo-router";

export default function Index() {

	const isHydrated = useAuth((state) => state.isHydrated);

	if (!isHydrated) {
		return null;
	}

	return <Redirect href={"/(app)/profile"} />
};
