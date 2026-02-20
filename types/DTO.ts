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

export type RegistrationUserDTO = {
	name: string;
	email: string;
	password: string;
	lang: LangDTO;
}

export type AuthenticateResponseDTO = {
	accessToken: string;
	refreshToken: string;
};

export type MeResponseDTO = {
	name: string;
	email: string;
	lang: LangDTO;
}

export type RefreshResponseDTO = {
	accessToken: string;
	refreshToken: string;
}
