import type { Excerpt } from "@/types/api";
import { useTranslation } from "react-i18next";
import MarkdownRenderer from "../MarkdownRenderer";
import { Button } from "../ui/button";

export const ExcerptCard: React.FC<{
	toggleTopicExpansion: (topic: string) => void;
	expandedTopics: Set<string>;
	topic: string;
	party: string;
	excerpt: Excerpt | undefined;
}> = ({ toggleTopicExpansion, expandedTopics, topic, party, excerpt }) => {
	const { t } = useTranslation();
	const isExpanded = expandedTopics.has(topic);

	return (
		<div className="border rounded-lg p-4">
			<h4 className="font-semibold mb-2">{party}</h4>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 overflow-y-auto" : "max-h-20"}`}
			>
				{excerpt ? (
					excerpt.excerpt
						.split("\n")
						.map((paragraph) => (
							<MarkdownRenderer key={paragraph} content={paragraph} />
						))
				) : (
					<p className="text-gray-500">{t("notAvailable")}</p>
				)}
			</div>
			{excerpt && (
				<Button
					onClick={() => toggleTopicExpansion(topic)}
					className="mt-2"
					variant="outline"
				>
					{isExpanded ? t("showLess") : t("showMore")}
				</Button>
			)}
		</div>
	);
};
