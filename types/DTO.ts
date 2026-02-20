export type LangDTO = "en" | "ru";

export type UserDTO = {
	id: string;
	name: string;
	email: string;
	lang: LangDTO;
};

export type AuthenticateUserDTO = {
	email: string;
	password: string;
};

export type AuthenticateResponseDTO = {
	accessToken: string;
	refreshToken: string;
};

export type MeResponseDTO = {
	name: string;
	email: string;
	lang: string;
}

export type RefreshResponseDTO = {
	accessToken: string;
	refreshToken: string;
}
