import { ElectionApiHelper, useApiStore } from "@/api/ElectionApiHelper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Excerpt, Program, Topic } from "../../types/api";
import { ExcerptCard } from "./ExcerptCard";

const TopicsTab: React.FC = () => {
	const { t, i18n } = useTranslation();
	const [topics, setTopics] = useState<Topic[]>([]);
	const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
	const [selectedParties, setSelectedParties] = useState<string[]>([]);
	const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [showMoreTopics, setShowMoreTopics] = useState<boolean>(false);
	const [programs, setPrograms] = useState<Program[]>([]);
	const currentElection = useApiStore((state) => state.currentElection);
	const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect depends on the current language and election
	useEffect(() => {
		fetchPrograms();
		fetchTopics();
	}, [i18n.language, currentElection]);

	const toggleTopicExpansion = (topic: string) => {
		setExpandedTopics((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(topic)) {
				newSet.delete(topic);
			} else {
				newSet.add(topic);
			}
			return newSet;
		});
	};

	const fetchPrograms = async (): Promise<void> => {
		try {
			const programs = await ElectionApiHelper.getPrograms();
			setPrograms(programs);
		} catch (error) {
			console.error("Error fetching parties:", error);
		}
	};

	const fetchTopics = async (): Promise<void> => {
		try {
			const topics = await ElectionApiHelper.getTopics();
			setTopics(topics);
		} catch (error) {
			console.error("Error fetching topics:", error);
		}
	};

	const fetchExcerpts = async (): Promise<void> => {
		setLoading(true);
		try {
			const excerpts = await ElectionApiHelper.getExcerpts(
				selectedTopics,
				selectedParties,
			);
			setExcerpts(excerpts);
		} catch (error) {
			console.error("Error fetching excerpts:", error);
		}
		setLoading(false);
	};

	const handleTopicChange = (topic: string): void => {
		setSelectedTopics((prev) =>
			prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
		);
	};

	const handleProgramChange = (program: string): void => {
		setSelectedParties((prev) =>
			prev.includes(program)
				? prev.filter((t) => t !== program)
				: [...prev, program],
		);
	};

	const renderExcerpts = () => {
		if (excerpts.length === 0) return null;

		return selectedTopics.map((topic) => (
			<div key={topic} className="mb-8">
				<h3 className="text-xl font-semibold mb-4">
					{t(`topics.${topics.find((t) => t.name === topic)?.id}`)}
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{selectedParties.map((party) => {
						const excerpt = excerpts.find(
							(e) => e.party === party && e.topic === topic,
						);
						return (
							<ExcerptCard
								toggleTopicExpansion={toggleTopicExpansion}
								expandedTopics={expandedTopics}
								key={`${topic}-${party}`}
								topic={topic}
								party={party}
								excerpt={excerpt}
							/>
						);
					})}
				</div>
			</div>
		));
	};

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-semibold mb-4">
				{t("selectPoliticalTopic")}
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
				{topics.slice(0, 5).map((topic) => (
					<div key={topic.id} className="flex items-center space-x-2">
						<Checkbox
							id={`topic-${topic.id}`}
							checked={selectedTopics.includes(topic.name)}
							onCheckedChange={() => handleTopicChange(topic.name)}
						/>
						<label
							htmlFor={`topic-${topic.id}`}
							className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${topic.prio === "true" ? "font-bold" : ""}`}
						>
							{t(`topics.${topic.id}`)}
						</label>
					</div>
				))}
			</div>

			{topics.length > 5 && (
				<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-4">
					<Button onClick={() => setShowMoreTopics(!showMoreTopics)}>
						{showMoreTopics ? t("hide") : t("show")}
					</Button>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
						{showMoreTopics &&
							topics.slice(5).map((topic) => (
								<div key={topic.id} className="flex items-center space-x-2">
									<Checkbox
										id={`topic-${topic.id}`}
										checked={selectedTopics.includes(topic.name)}
										onCheckedChange={() => handleTopicChange(topic.name)}
									/>
									<label
										htmlFor={`topic-${topic.id}`}
										className={
											"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										}
									>
										{t(`topics.${topic.id}`)}
									</label>
								</div>
							))}
					</div>
				</div>
			)}

			<h2 className="text-2xl font-semibold mb-4">{t("selectParties")}</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
				{programs.map((program) => (
					<div key={program.id} className="flex items-center space-x-2">
						<Checkbox
							id={`program-${program.id}`}
							checked={selectedParties.includes(program.party)}
							onCheckedChange={() => handleProgramChange(program.party)}
						/>
						<label
							htmlFor={`program-${program.id}`}
							className={
								"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							}
						>
							{program.party}
						</label>
					</div>
				))}
			</div>

			<Button
				onClick={fetchExcerpts}
				disabled={loading || selectedTopics.length === 0}
			>
				{loading ? t("loading") : t("showSelectionsBtn")}
			</Button>

			{excerpts.length > 0 && (
				<div className="mt-8">
					<h3 className="text-2xl font-semibold mb-4">{t("excerptsHeader")}</h3>
					{renderExcerpts()}
				</div>
			)}
		</div>
	);
};

export default TopicsTab;
