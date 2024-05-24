export type Prompts = {
	prompt: string;
	systemMessage: string;
};

export enum ContentType {
	CompletePartyProgram = "Complete Party Program",
	PartyProgramSummary = "Party Program Summary",
	Session = "Session",
	Excerpt = "Excerpt",
}

function getLanguageInstruction(lang: string): string {
	return `Make sure to keep your complete answer in the language '${lang}' (2-letter unicode shortform for the requested language).`;
}

export function getFindExcerptPrompts(
	topic: string,
	contentType: ContentType,
	content: string,
	lang: string,
): Prompts {
	return {
		prompt: `Given the topic:\n\n${topic}\n\nAnd the ${contentType}:\n\n${content}\n\nFind all excerpts from the ${contentType} that match the given topic. Be concise and quote accurately from the ${contentType} that was passed to you. (${getLanguageInstruction(lang)})`,
		systemMessage: `Given a ${contentType}, you separate out the key points and summarize the intent truthfully and accurately based on a topic that you've been given. You only return the applicable text from the ${contentType} verbatim, with no preamble. Try to include the whole context that handles that topic. ${getLanguageInstruction(lang)}`,
	};
}

export function getSummarizePrompts(
	contentType: ContentType,
	content: string,
	lang: string,
): Prompts {
	return {
		prompt: `Be concise. Summarize the following ${contentType} in simple language (${getLanguageInstruction(lang)}):\n\n${content}`,
		systemMessage: `Given a whole ${contentType}, you separate out the key points and summarize the intent truthfully, concisely and accurately. ${getLanguageInstruction(lang)}`,
	};
}

export function getSessionSummaryFlexiblePrompts(
	additionalInfo: string,
	content: string,
	lang: string,
): Prompts {
	return {
		prompt: `Summarize the following parliamentary session ${additionalInfo}:\n\n${content}`,
		systemMessage: `Given a whole parliamentary session, you separate out the key points and summarize the content truthfully, concisely and accurately. ${getLanguageInstruction(lang)}`,
	};
}

export function getPartyPrompts(content: string): Prompts {
	return {
		prompt: `Be concise. Which party has written the following program:\n\n${content}`,
		systemMessage:
			"You are an assistant to identify the party that wrote a political program. Given a whole political program, you extract the party that wrote it. You only reply with the party name as they use it themselves, in their language, nothing else. Be concise.",
	};
}

export function getExplainDifferencesPrompts(
	program1: string,
	program2: string,
	lang: string,
): Prompts {
	return {
		prompt: `Compare the following two election party programs:\n\n${program1}\n\n${program2}\n\nHighlight the key similarities and differences between the two programs. Be concise.`,
		systemMessage: `You are an assistant to compare and explain the differences between two election party programs. ${getLanguageInstruction(lang)}`,
	};
}

export function getElectionPrompts(
	content: string,
	elections: string,
): Prompts {
	return {
		prompt: `Be concise. Which election is the following party program intended for:\n\n${content}`,
		systemMessage: `You are an assistant to identify the election that a political program was written for. Given a whole political program, you identify the name and year of the election, and concatenate them into an id for this election. Example: if it is the european election of 2024, the correct answer is europe2024 (your reply MUST be on of the following elections: ${elections}). You only reply with this id, nothing else.`,
	};
}

export function getDatePrompts(content: string): Prompts {
	return {
		prompt: `Be concise. Which date did the following session take place on:\n\n${content}`,
		systemMessage:
			"You are an assistant to identify the calendar date of a political session. Given a whole political session, you identify the date. Your reply MUST be in the format YYYY-MM-DD. You only reply with the date, nothing else.",
	};
}

export function getExtractParticipantsPrompts(content: string): Prompts {
	return {
		prompt: `The JSON Format for your response should be: {"participants": [{"name": "name", "party": "party"}]}. Extract the names of the parliament members who participated in the following session:\n\n${content}`,
		systemMessage:
			"You are a political journalist and data analyst tasked with extracting the names and corresponding party of parliament members who participated in a session in pure JSON.",
	};
}

export function getParliamentPrompts(
	content: string,
	parliaments: string,
): Prompts {
	return {
		prompt: `Be concise. Which parliament is the following session from:\n\n${content}`,
		systemMessage: `You are an assistant to identify the parliament that a political session took place in. Given a whole political session, you identify the name of the parliament, and concatenate them into an id for this parliament. Example: if it is the european parliament of 2024, the correct answer is europe (your reply MUST be on of the following parliaments: ${parliaments}). You only reply with this id, nothing else.`,
	};
}
