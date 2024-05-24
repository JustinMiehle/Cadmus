import type { Excerpt, Program, Topic } from "@/types/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ApiHelperBase } from "./ApiHelperBase";
export interface Election {
	id: string;
	name: string;
}

interface ApiState {
	currentElection: Election;
	setCurrentElection: (election: Election) => void;
	elections: Election[];
	setElections: (elections: Election[]) => void;
}

export const useApiStore = create<ApiState>()(
	persist(
		(set) => ({
			currentElection: {} as Election,
			setCurrentElection: (election: Election) =>
				set({ currentElection: election }),
			elections: [],
			setElections: (elections: Election[]) => set({ elections }),
		}),
		{
			name: "electionApiStorage", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
);

// biome-ignore lint/complexity/noStaticOnlyClass: This is a helper class
export class ElectionApiHelper extends ApiHelperBase {
	private static getCurrentElection(): Election {
		return useApiStore.getState().currentElection;
	}

	public static async getTopics(): Promise<Topic[]> {
		try {
			const response = await ElectionApiHelper.fetchWithLang("topics");
			const data = await response.json();
			if (data.topics) {
				return data.topics;
			}
			return [];
		} catch (error) {
			console.error("Error fetching topics:", error);
			throw error;
		}
	}

	public static async getExcerpts(
		selectedTopics: string[],
		selectedParties: string[],
	): Promise<Excerpt[]> {
		try {
			const response = await ElectionApiHelper.fetchWithLang("excerpts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					topics: selectedTopics,
					parties: selectedParties,
					election: ElectionApiHelper.getCurrentElection().id,
				}),
			});
			const data = await response.json();
			if (data.excerpts) {
				return data.excerpts;
			}
			return [];
		} catch (error) {
			console.error("Error fetching excerpts:", error);
			throw error;
		}
	}

	public static async getPrograms(): Promise<Program[]> {
		try {
			const params = new URLSearchParams({
				election: ElectionApiHelper.getCurrentElection().id,
			});
			const response = await ElectionApiHelper.fetchWithLang(
				`programs?${params.toString()}`,
			);
			const data = await response.json();
			if (data.programs) {
				return data.programs;
			}
			return [];
		} catch (error) {
			console.error("Error fetching programs:", error);
			throw error;
		}
	}

	public static async summarizeProgram(url: string): Promise<Program> {
		try {
			const response = await ElectionApiHelper.fetchWithLang("summarize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url }),
			});
			const data = await response.json();
			return data.program;
		} catch (error) {
			console.error("Error fetching summary:", error);
			throw error;
		}
	}

	public static async summarizeProgramsFromBatchText(
		batchText: string,
	): Promise<Program[]> {
		try {
			const programs: Program[] = [];
			for (const line of batchText.split("\n")) {
				if (line.trim() === "") continue;
				const url = line.trim();
				if (!url.startsWith("http")) continue;
				try {
					const program = await ElectionApiHelper.summarizeProgram(url);
					if (program.summary.length > 0) {
						programs.push(program);
					}
				} catch (error) {
					console.error("Error summarizing program:", error);
					throw error;
				}
			}
			return programs;
		} catch (error) {
			console.error("Error summarizing programs from batch text:", error);
			throw error;
		}
	}

	public static async explainDifferences(
		url1: string,
		url2: string,
	): Promise<string> {
		try {
			const response = await ElectionApiHelper.fetchWithLang(
				"explainDifferences",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url1, url2 }),
				},
			);
			const data = await response.json();
			return data.differences;
		} catch (error) {
			console.error("Error fetching differences:", error);
			throw error;
		}
	}

	static async getElections(): Promise<Election[]> {
		try {
			const response = await ElectionApiHelper.fetchWithLang("elections");
			const data = await response.json();
			return data.elections;
		} catch (error) {
			console.error("Error fetching differences:", error);
			throw error;
		}
	}

	static async initializeElections() {
		const elections = await ElectionApiHelper.getElections();
		useApiStore.getState().setElections(elections);
		if (elections.length > 0 && !useApiStore.getState().currentElection.id) {
			useApiStore.getState().setCurrentElection(elections[0]);
		}
	}
}
