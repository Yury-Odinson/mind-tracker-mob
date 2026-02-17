import { create } from 'zustand';

type ThemeState = {
	theme: "light" | "dark";
	toggle: () => void;
}

const useHandleTheme = create<ThemeState>((set) => ({
	theme: "light",
	toggle: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }))
}));

export default useHandleTheme;
