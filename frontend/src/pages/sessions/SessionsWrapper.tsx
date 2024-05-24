import { SessionsApiHelper, useApiStore } from "@/api/SessionsApiHelper";
import type { SessionSummary } from "@/types/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface SessionsWrapperProps {
	children: React.ReactNode;
}

export const SessionsWrapper: React.FC<SessionsWrapperProps> = ({
	children,
}) => {
	const { i18n } = useTranslation();
	const [sessionSummaries, setSessionSummaries] = useState<SessionSummary[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(true);
	const apiStore = useApiStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		SessionsApiHelper.initializeParliaments();
	}, [i18n]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		fetchProtocolSummaries();
	}, [apiStore.currentParliament, i18n.language]);

	const fetchProtocolSummaries = async () => {
		setIsLoading(true);
		try {
			const summaries = await SessionsApiHelper.getSessionSummaries();
			const sortedSummaries = summaries.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
			);
			setSessionSummaries(sortedSummaries);
		} catch (error) {
			console.error("Error fetching protocol summary:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSummarize = async (urls: string[]) => {
		setIsLoading(true);
		try {
			const newSummaries = await Promise.all(
				urls.map((url) => SessionsApiHelper.summarizeSession(url)),
			);
			setSessionSummaries([...sessionSummaries, ...newSummaries]);
		} catch (error) {
			console.error("Error summarizing protocol(s):", error);
		} finally {
			setIsLoading(false);
		}
	};

	const sortedSessions = useMemo(() => {
		return [...sessionSummaries].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
	}, [sessionSummaries]);

	const getPreviousSessionId = useCallback(
		(currentId: string) => {
			const currentIndex = sortedSessions.findIndex((s) => s.id === currentId);
			return currentIndex < sortedSessions.length - 1
				? sortedSessions[currentIndex + 1].id
				: "";
		},
		[sortedSessions],
	);

	const getNextSessionId = useCallback(
		(currentId: string) => {
			const currentIndex = sortedSessions.findIndex((s) => s.id === currentId);
			return currentIndex > 0 ? sortedSessions[currentIndex - 1].id : "";
		},
		[sortedSessions],
	);

	return (
		<SessionsContext.Provider
			value={{
				sessionSummaries,
				handleSummarize,
				fetchProtocolSummaries,
				isLoading,
				getPreviousSessionId,
				getNextSessionId,
			}}
		>
			{children}
		</SessionsContext.Provider>
	);
};

export const SessionsContext = React.createContext<{
	sessionSummaries: SessionSummary[];
	handleSummarize: (urls: string[]) => Promise<void>;
	fetchProtocolSummaries: () => Promise<void>;
	isLoading: boolean;
	getPreviousSessionId: (currentId: string) => string;
	getNextSessionId: (currentId: string) => string;
}>({
	sessionSummaries: [],
	handleSummarize: async () => {},
	fetchProtocolSummaries: async () => {},
	isLoading: true,
	getPreviousSessionId: () => "",
	getNextSessionId: () => "",
});

export const useSessions = () => React.useContext(SessionsContext);
