import { useApiStore } from "@/api/SessionsApiHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DATE_FORMAT } from "@/lib/constants";
import { SessionsWrapper, useSessions } from "@/pages/sessions/SessionsWrapper";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SessionsContent: React.FC = () => {
	const { t } = useTranslation();
	const [protocolUrl, setProtocolUrl] = useState<string>("");
	const [protocolUrls, setProtocolUrls] = useState<string>("");
	const { sessionSummaries, handleSummarize, isLoading } = useSessions();
	const apiStore = useApiStore();
	const navigate = useNavigate();

	const handleSingleSummarize = () => {
		handleSummarize([protocolUrl]);
		setProtocolUrl("");
	};

	const handleMultipleSummarize = () => {
		const urls = protocolUrls.split("\n").filter((url) => url.trim() !== "");
		handleSummarize(urls);
		setProtocolUrls("");
	};

	const getHeadline = (summary: string) => {
		const firstLine = summary.split("\n")[0];
		return firstLine.length > 100 ? `${firstLine.slice(0, 100)}...` : firstLine;
	};
	const handleSummaryClick = (id: string) => {
		navigate(`/sessions/${id}`);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h2 className="text-2xl font-semibold mb-4">
				{t("protocolSummariesTitle") + apiStore.currentParliament.name}
			</h2>
			<Tabs defaultValue="single" className="mb-6">
				<TabsList>
					<TabsTrigger value="single">{t("addSingleProtocol")}</TabsTrigger>
					<TabsTrigger value="multiple">
						{t("addMultipleProtocols")}
					</TabsTrigger>
				</TabsList>
				<TabsContent value="single">
					<div className="flex items-center space-x-2">
						<Input
							type="text"
							value={protocolUrl}
							onChange={(e) => setProtocolUrl(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSingleSummarize();
								}
							}}
							placeholder="Enter protocol URL"
							className="flex-grow"
						/>
						<Button onClick={handleSingleSummarize} disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							Summarize
						</Button>
					</div>
				</TabsContent>
				<TabsContent value="multiple">
					<div className="space-y-2">
						<Textarea
							value={protocolUrls}
							onChange={(e) => setProtocolUrls(e.target.value)}
							placeholder="Enter protocol URLs (one per line)"
							rows={5}
							onKeyDown={(e) => {
								if (e.key === "Enter" && e.metaKey) {
									handleMultipleSummarize();
								}
							}}
						/>
						<Button onClick={handleMultipleSummarize} disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							Summarize All
						</Button>
					</div>
				</TabsContent>
			</Tabs>
			{isLoading && (
				<div className="flex justify-center items-center h-32">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			)}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{sessionSummaries.map((summary) => (
					<div
						key={summary.id}
						className="cursor-pointer bg-white shadow-md rounded-lg p-4 mb-4"
						onClick={() => handleSummaryClick(summary.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								handleSummaryClick(summary.id);
							}
						}}
						tabIndex={0}
						role="button"
					>
						<h3 className="text-xl font-semibold mb-2">
							{!!summary.date &&
								summary.date &&
								dayjs(summary.date).format(DATE_FORMAT)}
							,{" "}
							{
								apiStore.parliaments.find((p) => p.id === summary.parliament)
									?.name
							}
						</h3>
						<div>{getHeadline(summary.summary)}</div>
					</div>
				))}
			</div>
		</div>
	);
};

const Sessions: React.FC = () => (
	<SessionsWrapper>
		<SessionsContent />
	</SessionsWrapper>
);

export default Sessions;
