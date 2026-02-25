import { apiMe } from "@/api/me";
import { MeResponseDTO } from "@/types/DTO";
import { create } from "zustand";

type MeState = {
	data: MeResponseDTO | null;
	isLoading: boolean;
	error: string | null;

	setMe: (data: MeResponseDTO) => void;
	clearMe: () => void;
	fetchMe: () => Promise<void>;
};

const toLimitedMe = (data: MeResponseDTO): MeResponseDTO => ({
	...data,
});

const useMe = create<MeState>((set) => ({
	data: null,
	isLoading: false,
	error: null,

	setMe: (data) => {
		set({
			data: toLimitedMe(data),
			error: null,
		});
	},

	clearMe: () => {
		set({
			data: null,
			error: null,
		});
	},

	fetchMe: async () => {
		set({
			isLoading: true,
			error: null,
		});

		try {
			const data = await apiMe();
			set({
				data: toLimitedMe(data),
				isLoading: false,
			});
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "Failed to load profile",
			});
		}
	},
}));

export default useMe;
