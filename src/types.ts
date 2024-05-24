import type { Dayjs } from "dayjs";
import type { Timestamp } from "firebase-admin/firestore";

export interface ProgramSummary {
	id: string;
	url: string;
	language: string;
	party: string;
	election: string;
	summary: string;
	createdAt: Dayjs;
}

export interface ProgramSummaryFirestore {
	id: string;
	url: string;
	language: string;
	party: string;
	election: string;
	summary: string;
	createdAt: Timestamp;
}

export interface SessionSummary {
	id: string;
	url: string;
	language: string;
	parliament: string;
	summary: string;
	participants: string[];
	summaryByParty: string;
	summaryByPerson: string;
	shortSummary: string;
	date: Dayjs;
	createdAt: Dayjs;
}

export interface SessionSummaryFirestore {
	id: string;
	url: string;
	language: string;
	parliament: string;
	summary: string;
	participants: string[];
	summaryByParty: string;
	summaryByPerson: string;
	shortSummary: string;
	date: Timestamp;
	createdAt: Timestamp;
}

export interface RequestData {
	url: string;
}

export interface BatchAddRequestData {
	batch: string;
}

export interface ProgramsRequestData {
	election: string;
}

export interface SessionsRequestData {
	parliament: string;
}

export interface ExcerptRequestData {
	topics: string[];
	election: string;
	parties: string[];
}

export interface PoliticalTopic {
	id: string;
	name: string;
	prio?: string;
}

export interface Election {
	id: string;
	name: string;
}

export interface Parliament {
	id: string;
	name: string;
}

export interface Message {
	role: string;
	content: string;
}

export interface RequestBody {
	model: string;
	messages: Message[];
	max_tokens?: number;
	response_format?: { type: string };
}

export interface Choice {
	message: Message;
}

export interface ResponseBody {
	choices: Choice[];
}

export type Participants = {
	participants: Participant[];
};

export type Participant = {
	name: string;
	party: string;
};
