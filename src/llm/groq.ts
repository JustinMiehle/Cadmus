import type { AxiosResponse } from "axios";
import axios from "axios";
import type { Prompts } from "../prompts.js";
import { groqAPIKey } from "../server.js";
import type { RequestBody, ResponseBody } from "../types.js";

export async function groqCompletion(
	prompts: Prompts,
	jsonResponse = false,
): Promise<string> {
	const reqBody: RequestBody = {
		model: "llama3.1-70b-8192",
		messages: [
			{ role: "system", content: prompts.systemMessage },
			{ role: "user", content: prompts.prompt },
		],
	};

	if (jsonResponse) {
		reqBody.response_format = { type: "json_object" };
	}

	const response = await retryGroq(reqBody);

	const resBody: ResponseBody = response.data;

	if (resBody.choices && resBody.choices.length > 0) {
		return resBody.choices[0].message.content.trim();
	}
	throw new Error(`No choices returned from Groq API: ${response.status}`);
}

async function callGroq(reqBody: RequestBody, model: string) {
	reqBody.model = model;
	return axios.post(
		"https://api.groq.com/openai/v1/chat/completions",
		reqBody,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${groqAPIKey}`,
			},
		},
	);
}

async function retryGroq(reqBody: RequestBody) {
	const models = ["llama-3.1-70b-versatile", "llama-3.1-8b-instant"];
	let modelIndex = 0;
	let response: AxiosResponse<ResponseBody>;

	do {
		try {
			response = await callGroq(reqBody, models[modelIndex]);
			if (response.status === 429 && modelIndex < models.length - 1) {
				modelIndex++;
			} else if (response.status === 429) {
				modelIndex = 0;
				await new Promise((resolve) => setTimeout(resolve, 30000));
			}
			// biome-ignore lint/suspicious/noExplicitAny: This is a valid use case
		} catch (error: any) {
			console.error("Error when getting Groq Response:", error?.message);
			throw error;
		}
	} while (response.status === 429 && modelIndex < models.length);
	return response;
}
