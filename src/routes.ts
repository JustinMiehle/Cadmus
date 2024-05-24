import type { Express, Request, Response } from "express";
import {
	explainDifferences,
	getElections,
	getExcerpts,
	getParliaments,
	getProgramsHandler,
	getSessionSummaries,
	summarizeHandler,
	summarizeSessionHandler,
} from "./handlers.js";
import { politicalTopics } from "./utils.js";

export function setupRoutes(app: Express) {
	app.post("/api/summarize", summarizeHandler);
	app.get("/api/programs", getProgramsHandler);
	app.get("/api/topics", async (_req: Request, res: Response) => {
		res.status(200).json({ topics: politicalTopics });
	});
	app.get("/api/elections", getElections);
	app.post("/api/excerpts", getExcerpts);
	app.post("/api/explainDifferences", explainDifferences);
	app.post("/api/summarizeSession", summarizeSessionHandler);
	app.get("/api/sessionSummaries", getSessionSummaries);
	app.get("/api/parliaments", getParliaments);
}
