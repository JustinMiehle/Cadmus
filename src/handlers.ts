import dayjs from "dayjs";
import type { Request, Response } from "express";
import { Timestamp } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import { firestoreClient } from "./server.js";
import type {
	ExcerptRequestData,
	ProgramSummary,
	ProgramSummaryFirestore,
	RequestData,
	SessionSummary,
	SessionSummaryFirestore,
	SessionsRequestData,
} from "./types.js";
import {
	elections,
	explainDifferencesBasedOnCompleteProgram,
	extractText,
	findRelevantExcerptBasedOnCompleteProgram,
	getDate,
	getElection,
	getParliament,
	getParticipants,
	getParty,
	parliaments,
	shortSummarizeSession,
	summarizePartyProgram,
	summarizeSession,
	summarizeSessionByParty,
	summarizeSessionByPerson,
} from "./utils.js";

export const LLM_INPUT_LENGTH = 20000;

export async function summarizeHandler(req: Request, res: Response) {
	const { url } = req.body;
	const language = req.header("Accept-Language") || "en";

	try {
		const summariesRef = firestoreClient.collection("summaries");
		const query = summariesRef
			.where("url", "==", url)
			.where("language", "==", language)
			.limit(1);
		const docs = await query.get();

		if (!docs.empty) {
			const existingSummary = docs.docs[0].data() as ProgramSummary;
			return res.status(200).json({ program: existingSummary });
		}

		const summary = await summarizePartyProgram(url, language);
		const party = await getParty(summary);
		const election = await getElection(url);

		const timestamp = Timestamp.now();

		const newSummary: ProgramSummaryFirestore = {
			id: uuidv4(),
			createdAt: timestamp,
			summary: summary,
			url,
			party: party,
			election: election,
			language: language,
		};

		await summariesRef.add(newSummary);

		res.status(200).json({
			program: {
				...newSummary,
				createdAt: dayjs(timestamp.toDate()),
			} as ProgramSummary,
		});
	} catch (error) {
		console.error("Error in summarize:", error);
		res.status(500).json({ error: "Failed to summarize" });
	}
}

export async function getProgramsHandler(req: Request, res: Response) {
	const { election } = req.query;
	const language = req.header("Accept-Language") || "en";

	try {
		const summariesRef = firestoreClient.collection("summaries");
		const query = summariesRef
			.where("election", "==", election)
			.where("language", "==", language);
		const docs = await query.get();

		const summaries: ProgramSummary[] = docs.docs.map((doc) => {
			return {
				...(doc.data() as ProgramSummaryFirestore),
				id: doc.id,
				createdAt: dayjs(doc.get("createdAt").toDate()),
			};
		});

		res.status(200).json({ programs: summaries });
	} catch (error) {
		console.error("Error in getPrograms:", error);
		res.status(500).json({ error: "Failed to fetch summaries" });
	}
}

export const getElections = async (_req: Request, res: Response) => {
	res.status(200).json({ elections });
};

export const getParliaments = async (_req: Request, res: Response) => {
	res.status(200).json({ parliaments });
};

export const getExcerpts = async (req: Request, res: Response) => {
	const excerptRequest: ExcerptRequestData = req.body;
	const acceptLanguage = req.headers["accept-language"] as string;

	try {
		const summariesRef = firestoreClient.collection("summaries");
		const query = summariesRef
			.where("party", "in", excerptRequest.parties)
			.where("election", "==", excerptRequest.election)
			.where("language", "==", acceptLanguage);

		const docs = await query.get();
		const excerpts = [];
		const requests = [];

		const extractTextPromises = docs.docs.map(async (doc) => {
			const summary = doc.data() as ProgramSummary;
			summary.id = doc.id;
			return { doc, contentForLlm: await extractText(summary.url) };
		});

		const extractedTexts = await Promise.all(extractTextPromises);

		for (const { doc, contentForLlm } of extractedTexts) {
			const trimmedContent =
				contentForLlm.length > LLM_INPUT_LENGTH
					? contentForLlm.slice(0, LLM_INPUT_LENGTH)
					: contentForLlm;

			for (const topic of excerptRequest.topics) {
				const request = findRelevantExcerptBasedOnCompleteProgram(
					topic,
					trimmedContent,
					acceptLanguage,
					doc.id,
				);
				requests.push(request);
			}
		}

		const results = await Promise.all(requests);

		for (const resultObject of results) {
			const docId = resultObject.id;
			const topic = resultObject.topic;
			const doc = docs.docs.find((d) => d.id === docId);
			if (doc) {
				const summary = doc.data() as ProgramSummary;
				const result = resultObject.result;

				if (result.length > 0) {
					excerpts.push({
						id: doc.id,
						party: summary.party,
						election: summary.election,
						excerpt: result,
						topic,
					});
				}
			}
		}

		res.status(200).json({ excerpts });
	} catch (error) {
		console.error("Error in getExcerpts:", error);
		res.status(500).json({ error: "Failed to fetch excerpts" });
	}
};
export const explainDifferences = async (req: Request, res: Response) => {
	const { url1, url2 } = req.body;
	const acceptLanguage = req.headers["accept-language"] as string;

	try {
		const summariesRef = firestoreClient.collection("summaries");
		const query1 = summariesRef
			.where("url", "==", url1)
			.where("language", "==", acceptLanguage);

		const query2 = summariesRef
			.where("url", "==", url2)
			.where("language", "==", acceptLanguage);

		const doc1 = await query1.get();
		const doc2 = await query2.get();

		if (doc1.empty || doc2.empty) {
			return res.status(400).json({ error: "Could not find both summaries" });
		}

		const summaries = [doc1, doc2].map(
			(doc) =>
				({
					...doc.docs[0].data(),
					id: doc.docs[0].id,
				}) as ProgramSummary,
		);

		let [summary1, summary2] = summaries;
		if (summary1.url === url1) {
			[summary1, summary2] = [summary2, summary1];
		}

		const result = await explainDifferencesBasedOnCompleteProgram(
			summary1.url,
			summary2.url,
			acceptLanguage,
		);
		res.status(200).json({ differences: result });
	} catch (error) {
		console.error("Error in explainDifferences:", error);
		res.status(500).json({ error: "Failed to explain differences" });
	}
};

export const summarizeSessionHandler = async (req: Request, res: Response) => {
	const requestData: RequestData = req.body;
	const acceptLanguage = req.headers["accept-language"] as string;

	try {
		const summariesRef = firestoreClient.collection("sessions");

		// Check if summary already exists
		const query = summariesRef
			.where("url", "==", requestData.url)
			.where("language", "==", acceptLanguage)
			.limit(1);

		const docs = await query.get();

		if (!docs.empty) {
			const existingSessionSummary = docs.docs[0].data() as SessionSummary;
			return res.status(200).json({ summary: existingSessionSummary });
		}

		let contentForLlm = await extractText(requestData.url);
		if (contentForLlm.length > LLM_INPUT_LENGTH) {
			contentForLlm = contentForLlm.slice(0, LLM_INPUT_LENGTH);
		}
		const [
			summary,
			summaryByParty,
			summaryByParticipant,
			shortSummary,
			participants,
			sessionDate,
			sessionParliament,
		] = await Promise.all([
			summarizeSession(contentForLlm, acceptLanguage),
			summarizeSessionByParty(contentForLlm, acceptLanguage),
			summarizeSessionByPerson(contentForLlm, acceptLanguage),
			shortSummarizeSession(contentForLlm, acceptLanguage),
			getParticipants(contentForLlm),
			getDate(contentForLlm),
			getParliament(contentForLlm),
		]);

		const timestamp = Timestamp.now();

		const newSummary: SessionSummaryFirestore = {
			id: uuidv4(),
			createdAt: timestamp,
			summary: summary,
			url: requestData.url,
			language: acceptLanguage,
			date: Timestamp.fromMillis(sessionDate.valueOf()),
			parliament: sessionParliament,
			summaryByParty: summaryByParty,
			summaryByPerson: summaryByParticipant,
			shortSummary: shortSummary,
			participants: participants.participants.map(
				(p) => `${p.name} (${p.party})`,
			),
		};

		await summariesRef.add(newSummary);
		res.status(200).json({
			summary: {
				...newSummary,
				date: sessionDate,
				createdAt: dayjs(timestamp.toDate()),
			} as SessionSummary,
		});
	} catch (error) {
		console.error("Error in summarizeSession:", error);
		res.status(500).json({ error: "Failed to summarize session" });
	}
};

export const getSessionSummaries = async (req: Request, res: Response) => {
	// biome-ignore lint/suspicious/noExplicitAny: This is a valid use case
	const requestData: SessionsRequestData = req.query as any;
	const acceptLanguage = req.headers["accept-language"] as string;

	try {
		const sessionsRef = firestoreClient.collection("sessions");
		const query = sessionsRef
			.where("language", "==", acceptLanguage)
			.where("parliament", "==", requestData.parliament);

		const docs = await query.get();
		const summaries: SessionSummaryFirestore[] = docs.docs.map(
			(doc) => doc.data() as SessionSummaryFirestore,
		);

		const summariesForReturn: SessionSummary[] = [];

		for (const summary of summaries) {
			const newSummary: SessionSummary = {
				...summary,
				date: dayjs(summary.date.toDate()),
				createdAt: dayjs(summary.createdAt.toDate()),
			};
			summariesForReturn.push(newSummary);
		}

		res.status(200).json({ summaries: summariesForReturn });
	} catch (error) {
		console.error("Error in getSessionSummaries:", error);
		res.status(500).json({ error: "Failed to fetch session summaries" });
	}
};
