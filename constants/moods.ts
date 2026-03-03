export type MoodSegment = {
	id: number;
	name: string;
	color: string;
};

export type SectorDefinition = {
	axisDeg: number;
	rings: [MoodSegment, MoodSegment, MoodSegment];
};

export const MOOD_SECTORS: SectorDefinition[] = [
	{
		axisDeg: -90,
		rings: [
			{ id: 17, name: "Экстаз", color: "#FDD835" },
			{ id: 9, name: "Радость", color: "#FFF176" },
			{ id: 1, name: "Спокойствие", color: "#FFF9C4" },
		],
	},
	{
		axisDeg: -45,
		rings: [
			{ id: 18, name: "Восхищение", color: "#81C784" },
			{ id: 10, name: "Доверие", color: "#C8E6C9" },
			{ id: 2, name: "Признание", color: "#F1F8E9" },
		],
	},
	{
		axisDeg: 0,
		rings: [
			{ id: 19, name: "Ужас", color: "#80CBC4" },
			{ id: 11, name: "Страх", color: "#B2DFDB" },
			{ id: 3, name: "Опасение", color: "#E0F2F1" },
		],
	},
	{
		axisDeg: 45,
		rings: [
			{ id: 20, name: "Изумление", color: "#29B6F6" },
			{ id: 12, name: "Удивление", color: "#4FC3F7" },
			{ id: 4, name: "Отвлечение", color: "#B3E5FC" },
		],
	},
	{
		axisDeg: 90,
		rings: [
			{ id: 21, name: "Горе", color: "#5C6BC0" },
			{ id: 13, name: "Печаль", color: "#7986CB" },
			{ id: 5, name: "Задумчивость", color: "#C5CAE9" },
		],
	},
	{
		axisDeg: 135,
		rings: [
			{ id: 22, name: "Отвращение", color: "#AB47BC" },
			{ id: 14, name: "Брезгливость", color: "#BA68C8" },
			{ id: 6, name: "Скука", color: "#F8BBD0" },
		],
	},
	{
		axisDeg: 180,
		rings: [
			{ id: 23, name: "Ярость", color: "#C62828" },
			{ id: 15, name: "Гнев", color: "#E57373" },
			{ id: 7, name: "Раздражение", color: "#EF9A9A" },
		],
	},
	{
		axisDeg: -135,
		rings: [
			{ id: 24, name: "Бдительность", color: "#FB8C00" },
			{ id: 16, name: "Ожидание", color: "#FFB74D" },
			{ id: 8, name: "Интерес", color: "#FFE0B2" },
		],
	},
];

const moodSegments = MOOD_SECTORS.flatMap((sector) => sector.rings);

const moodById = new Map<number, MoodSegment>(moodSegments.map((mood) => [mood.id, mood]));
const moodByName = new Map<string, MoodSegment>(
	moodSegments.map((mood) => [mood.name.trim().toLowerCase(), mood]),
);

export function getMoodById(moodId: number): MoodSegment | undefined {
	return moodById.get(moodId);
}

export function getMoodByName(moodName: string): MoodSegment | undefined {
	return moodByName.get(moodName.trim().toLowerCase());
}
