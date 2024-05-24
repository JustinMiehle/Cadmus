import type { SessionSummary } from "@/types/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ApiHelperBase } from "./ApiHelperBase";

export interface Parliament {
	id: string;
	name: string;
}

interface ApiState {
	currentParliament: Parliament;
	setCurrentParliament: (parliament: Parliament) => void;
	parliaments: Parliament[];
	setParliaments: (parliaments: Parliament[]) => void;
	sessionSummaries: SessionSummary[];
	setSessionSummaries: (summaries: SessionSummary[]) => void;
}

export const useApiStore = create<ApiState>()(
	persist(
		(set) => ({
			currentParliament: {} as Parliament,
			setCurrentParliament: (parliament: Parliament) =>
				set({ currentParliament: parliament }),
			parliaments: [],
			setParliaments: (parliaments: Parliament[]) => set({ parliaments }),
			sessionSummaries: [],
			setSessionSummaries: (summaries: SessionSummary[]) =>
				set({ sessionSummaries: summaries }),
		}),
		{
			name: "sessionApiStorage", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
);

// biome-ignore lint/complexity/noStaticOnlyClass: This is a helper class
export class SessionsApiHelper extends ApiHelperBase {
	private static getCurrentParliament(): Parliament {
		return useApiStore.getState().currentParliament;
	}

	static async getParliaments(): Promise<Parliament[]> {
		try {
			const response = await SessionsApiHelper.fetchWithLang("parliaments");
			const data = await response.json();
			return data.parliaments;
		} catch (error) {
			console.error("Error fetching parliaments:", error);
			throw error;
		}
	}

	static async initializeParliaments() {
		const parliaments = await SessionsApiHelper.getParliaments();
		useApiStore.getState().setParliaments(parliaments);
		if (
			parliaments.length > 0 &&
			!useApiStore.getState().currentParliament.id
		) {
			useApiStore.getState().setCurrentParliament(parliaments[0]);
		}
	}

	static async getSessionSummaries(): Promise<SessionSummary[]> {
		try {
			const response = await SessionsApiHelper.fetchWithLang(
				`sessionSummaries?parliament=${SessionsApiHelper.getCurrentParliament().id}`,
			);
			const data = await response.json();
			const summaries = data.summaries;
			useApiStore.getState().setSessionSummaries(summaries);
			return summaries;
		} catch (error) {
			console.error("Error fetching protocol summary:", error);
			throw error;
		}
	}

	static async summarizeSession(url: string): Promise<SessionSummary> {
		try {
			const response = await SessionsApiHelper.fetchWithLang(
				"summarizeSession",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url }),
				},
			);
			const data = await response.json();
			const newSummary = data.summary;

			// Update the session summaries in the store
			const currentSummaries = useApiStore.getState().sessionSummaries;
			useApiStore
				.getState()
				.setSessionSummaries([...currentSummaries, newSummary]);

			return newSummary;
		} catch (error) {
			console.error("Error summarizing session:", error);
			throw error;
		}
	}
}
