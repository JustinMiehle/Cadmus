import { useApiStore } from "@/api/SessionsApiHelper";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DATE_FORMAT } from "@/lib/constants";
import { useSessions } from "@/pages/sessions/SessionsWrapper";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const SessionDetails: React.FC = () => {
	const { t } = useTranslation();
	const { id = "" } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const {
		sessionSummaries,
		fetchProtocolSummaries,
		isLoading,
		getPreviousSessionId,
		getNextSessionId,
	} = useSessions();
	const apiStore = useApiStore();

	useEffect(() => {
		// This is incredibly wasteful, but it's a quick fix for the initial load @TODO
		fetchProtocolSummaries();
	});

	useEffect(() => {
		if (sessionSummaries.length === 0 && !isLoading) {
			fetchProtocolSummaries();
		}
	}, [sessionSummaries, fetchProtocolSummaries, isLoading]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				{t("loading")}...
			</div>
		);
	}
	const session = sessionSummaries.find((s) => s.id === id);

	if (!session) {
		return (
			<div className="flex justify-center items-center h-screen">
				{t("sessionNotFound")}
			</div>
		);
	}

	const previousSessionId = getPreviousSessionId(id);
	const nextSessionId = getNextSessionId(id);

	const navigateToSession = (sessionId: string | null) => {
		if (sessionId) {
			navigate(`/sessions/${sessionId}`);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-4">
				<Button onClick={() => navigate("/sessions")} variant="outline">
					{t("backToSessions")}
				</Button>
			</div>
			<div className="flex justify-between items-center mb-4">
				<Button
					onClick={() => navigateToSession(previousSessionId)}
					disabled={!previousSessionId}
					variant="outline"
				>
					<ChevronLeft className="mr-2 h-4 w-4" /> {t("previousSession")}
				</Button>
				<Button
					onClick={() => navigateToSession(nextSessionId)}
					disabled={!nextSessionId}
					variant="outline"
				>
					{t("nextSession")} <ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</div>

			<Card className="mb-8">
				<CardHeader>
					<CardTitle className="text-2xl font-semibold">
						{
							apiStore.parliaments.find((p) => p.id === session.parliament)
								?.name
						}{" "}
						- {dayjs(session.date).format(DATE_FORMAT)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{session.shortSummary}</p>
					<p>
						<strong>{t("createdAt")}:</strong>{" "}
						{new Date(session.createdAt).toLocaleString()}
					</p>
					<p>
						<strong>{t("url")}:</strong>{" "}
						<a
							href={session.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							{session.url}
						</a>
					</p>
				</CardContent>
			</Card>

			<Tabs defaultValue="summary" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="summary">{t("summary")}</TabsTrigger>
					<TabsTrigger value="participants">{t("participants")}</TabsTrigger>
					<TabsTrigger value="party">{t("byParty")}</TabsTrigger>
					<TabsTrigger value="individual">{t("byParticipant")}</TabsTrigger>
				</TabsList>
				<TabsContent value="summary">
					<Card>
						<CardHeader>
							<CardTitle>{t("sessionSummary")}</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[400px] w-full rounded-md border p-4">
								<MarkdownRenderer content={session.summary} />
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="participants">
					<Card>
						<CardHeader>
							<CardTitle>
								{t("participants")} VERY BUGGY SO FAR, not sure if will be
								included
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="list-disc list-inside">
								{!!session?.participants?.length &&
									session.participants.map((participant) => (
										<li key={participant}>{participant}</li>
									))}
							</ul>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="party">
					<Card>
						<CardHeader>
							<CardTitle>{t("summaryByParty")}</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[400px] w-full rounded-md border p-4">
								<MarkdownRenderer content={session.summaryByParty} />
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="individual">
					<Card>
						<CardHeader>
							<CardTitle>{t("summaryByParticipant")}</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[400px] w-full rounded-md border p-4">
								<MarkdownRenderer content={session.summaryByPerson} />
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default SessionDetails;
