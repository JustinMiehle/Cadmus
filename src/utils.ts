import fs from "node:fs";
import axios from "axios";
import crawler from "crawler-request";
import dayjs, { type Dayjs } from "dayjs";
import { request } from "express";
import { groqCompletion } from "./llm/groq.js";
import {
	ContentType,
	getDatePrompts,
	getElectionPrompts,
	getExplainDifferencesPrompts,
	getExtractParticipantsPrompts,
	getFindExcerptPrompts,
	getParliamentPrompts,
	getPartyPrompts,
	getSessionSummaryFlexiblePrompts,
	getSummarizePrompts,
} from "./prompts.js";
import type {
	Election,
	Parliament,
	Participants,
	PoliticalTopic,
} from "./types.js";

const path = fs.existsSync("dist/data/") ? "dist/data/" : "src/data/";
export const politicalTopics: PoliticalTopic[] = JSON.parse(
	fs.readFileSync(`${path}political_topics.json`, "utf8"),
);
export const parliaments: Parliament[] = JSON.parse(
	fs.readFileSync(`${path}parliaments.json`, "utf8"),
);
export const elections: Election[] = JSON.parse(
	fs.readFileSync(`${path}elections.json`, "utf8"),
);

export async function findRelevantExcerptBasedOnSummary(
	topic: string,
	summary: string,
	lang: string,
): Promise<string> {
	const prompts = getFindExcerptPrompts(
		topic,
		ContentType.PartyProgramSummary,
		summary,
		lang,
	);

	return groqCompletion(prompts);
}

export async function findRelevantExcerptBasedOnCompleteProgram(
	topic: string,
	url: string,
	lang: string,
	id: string,
): Promise<{ id: string; result: string; topic: string }> {
	const prompts = getFindExcerptPrompts(
		topic,
		ContentType.CompletePartyProgram,
		url,
		lang,
	);

	return { id: id, topic: topic, result: await groqCompletion(prompts) };
}

export async function summarizePartyProgram(
	text: string,
	lang: string,
): Promise<string> {
	const prompts = getSummarizePrompts(
		ContentType.CompletePartyProgram,
		text,
		lang,
	);

	return groqCompletion(prompts);
}

export async function getParty(text: string): Promise<string> {
	const prompts = getPartyPrompts(text);

	return groqCompletion(prompts);
}

export async function getParliament(text: string): Promise<string> {
	const examples = parliaments.map((p) => p.id).join(", ");
	const prompts = getParliamentPrompts(text, examples);

	return groqCompletion(prompts);
}

export async function summarizeSession(
	text: string,
	lang: string,
): Promise<string> {
	const prompts = getSummarizePrompts(ContentType.Session, text, lang);

	return groqCompletion(prompts);
}

export async function getParticipants(text: string): Promise<Participants> {
	const prompts = getExtractParticipantsPrompts(text);

	const response = await groqCompletion(prompts, true);
	return JSON.parse(response) as Participants;
}

export async function summarizeSessionByParty(
	text: string,
	lang: string,
): Promise<string> {
	const prompts = getSessionSummaryFlexiblePrompts(
		"by the parties that participated.",
		text,
		lang,
	);
	return groqCompletion(prompts);
}

export async function summarizeSessionByPerson(
	text: string,
	lang: string,
): Promise<string> {
	const prompts = getSessionSummaryFlexiblePrompts(
		"by the persons that spoke during the session",
		text,
		lang,
	);

	return groqCompletion(prompts);
}

export async function shortSummarizeSession(
	text: string,
	lang: string,
): Promise<string> {
	const prompts = getSessionSummaryFlexiblePrompts(
		"in 200 characters or less",
		text,
		lang,
	);

	return groqCompletion(prompts);
}

export async function getDate(text: string): Promise<Dayjs> {
	const prompts = getDatePrompts(text);

	const dateString = await groqCompletion(prompts);
	return dayjs(dateString);
}

export async function getElection(url: string): Promise<string> {
	const examples = elections.map((e) => e.id).join(", ");
	const prompts = getElectionPrompts(url, examples);

	return groqCompletion(prompts);
}

export async function explainDifferencesBasedOnCompleteProgram(
	url1: string,
	url2: string,
	lang: string,
): Promise<string> {
	const prompts = getExplainDifferencesPrompts(url1, url2, lang);

	return groqCompletion(prompts);
}

export async function extractText(url: string): Promise<string> {
	const response = await axios.get(url, { responseType: "arraybuffer" });
	const contentType = response.headers["content-type"];

	if (contentType?.includes("application/pdf")) {
		const pdfCrawlerResult = await crawler(url);
		return pdfCrawlerResult.text ? pdfCrawlerResult.text.trim() : "";
	}
	if (contentType?.includes("text/html")) {
		// Groq can read links, this saves tokens like crazy i believe :D
		return url;
		//return extractHTMLText(response.data.toString());
	}
	if (contentType?.includes("text/plain")) {
		return url;
		// return response.data.toString();
	}

	throw new Error("Unsupported file type");
}
