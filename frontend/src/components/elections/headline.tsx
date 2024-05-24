import { useTranslation } from "react-i18next";
import type { Program } from "../../types/api";

export const Headline: React.FC<{ context?: string; program: Program }> = ({
	context = "summaryOf",
	program,
}) => {
	const { t } = useTranslation();
	return (
		<>
			{!!program.election && (
				<h3 className="text-2xl font-semibold mb-4">
					{t(context)}{" "}
					<a
						className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
						href={program.url}
					>
						{program.party}
						{` - ${t(`elections.${program.election}`)}`}
					</a>
				</h3>
			)}
		</>
	);
};
