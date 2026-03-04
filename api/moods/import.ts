import { MoodImportEntryDTO, MoodImportRequestDTO } from "@/types/DTO";
import axios from "axios";

import { apiClient } from "../client";

export async function apiImportMoods(entries: MoodImportEntryDTO[]): Promise<number> {
	if (entries.length === 0) {
		return 200;
	}

	const payload: MoodImportRequestDTO = { entries };

	try {
		const response = await apiClient.post("/api/mood/import", payload);
		return response.status;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const status = error.response?.status;
			throw new Error(`POST /api/mood/import failed${status ? `: ${status}` : ""}`);
		}

		throw error;
	}
}
