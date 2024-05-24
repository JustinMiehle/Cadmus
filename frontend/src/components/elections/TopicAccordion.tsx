import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import MarkdownRenderer from "../MarkdownRenderer";

export const TopicAccordion = ({
	topic,
	content,
}: { topic: string; content: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="border rounded-lg mb-4">
			<button
				className="w-full p-4 text-left font-semibold flex justify-between items-center"
				onClick={() => setIsOpen(!isOpen)}
				type="button"
			>
				{topic}
				{isOpen ? (
					<ChevronUpIcon className="h-5 w-5" />
				) : (
					<ChevronDownIcon className="h-5 w-5" />
				)}
			</button>
			{isOpen && (
				<div className="p-4">
					{content.split("\n").map((paragraph: string) => (
						<MarkdownRenderer key={paragraph} content={paragraph} />
					))}
				</div>
			)}
		</div>
	);
};
