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
};

export type AuthenticateResponseDTO = {
	accessToken: string;
	refreshToken: string;
};

export type MeResponseDTO = {
	name: string;
	email: string;
	lang: LangDTO;
};

export type UpdateMeFieldDTO = "name" | "email" | "password";

export type UpdateMeFieldRequestDTO = {
	field: UpdateMeFieldDTO;
	currentValue: string;
	newValue: string;
};

export type ChangeUserNameRequestDTO = {
	name: string;
	newName: string;
};

export type ChangeUserEmailRequestDTO = {
	email: string;
	newEmail: string;
};

export type ChangeUserPasswordRequestDTO = {
	password: string;
	newPassword: string;
};

export type RefreshResponseDTO = {
	accessToken: string;
	refreshToken: string;
};

export type MoodDTO = {
	id: number;
	moodId: number;
	moodName: string;
	color: string;
	note: string;
	createdAt: string;
};

export type UserMoodDTO = {
	clientEntryId: string;
	moodId: number;
	note: string;
	createdAt: Date;
	updatedAt: Date;
};

export type CreateMoodRequestDTO = {
	moodId: number;
	note: string;
};

export type GetMoodRequestDTO = {
	page: number;
	limit: number;
};

export type MoodResponseDTO = {
	data: MoodDTO[];
	total: number;
	currentPage: number;
	totalPages: number;
};

export type MoodImportEntryDTO = {
	clientEntryId: string;
	moodId: number;
	note: string;
	createdAt: string;
	updatedAt: string;
};

export type MoodImportRequestDTO = {
	entries: MoodImportEntryDTO[];
};
