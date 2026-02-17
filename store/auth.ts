import { create } from 'zustand';

type AuthState = {
	isAuthenticated: boolean;
	login: () => void;
	logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
	isAuthenticated: false,
	login: () => set({ isAuthenticated: true }),
	logout: () => set({ isAuthenticated: false }),
}));

export default useAuth;
