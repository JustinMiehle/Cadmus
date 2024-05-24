import { ElectionApiHelper, useApiStore } from "@/api/ElectionApiHelper";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Headline } from "@/components/elections/Headline";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Program } from "@/types/api";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SideBySideComparisonTab: React.FC = () => {
	const { t, i18n } = useTranslation();
	const [selectedProgram1, setSelectedProgram1] = useState<string>("");
	const [selectedProgram2, setSelectedProgram2] = useState<string>("");
	const [program1, setProgram1] = useState<Program>({} as Program);
	const [program2, setProgram2] = useState<Program>({} as Program);
	const [loading, setLoading] = useState<boolean>(false);
	const [programs, setPrograms] = useState<Program[]>([]);
	const currentElection = useApiStore((state) => state.currentElection);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		fetchOptions();
	}, [i18n.language, currentElection]);

	const fetchOptions = async (): Promise<void> => {
		try {
			const options = await ElectionApiHelper.getPrograms();
			setPrograms(options);
		} catch (error) {
			console.error("Error fetching options:", error);
		}
	};

	const handleProgramChange = async (
		value: string,
		setter: React.Dispatch<React.SetStateAction<string>>,
		programSetter: React.Dispatch<React.SetStateAction<Program>>,
	) => {
		setLoading(true);
		setter(value);
		const selectedOption = programs.find((option) => option.id === value);
		if (selectedOption) {
			try {
				const program = await ElectionApiHelper.summarizeProgram(
					selectedOption.url,
				);
				programSetter(program);
			} catch (error) {
				console.error("Error fetching summary:", error);
			}
		}
		setLoading(false);
	};

	return (
		<div className="space-y-4">
			<div className="flex space-x-4">
				<Select
					value={selectedProgram1}
					onValueChange={(value) =>
						handleProgramChange(value, setSelectedProgram1, setProgram1)
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={t("selectFirstProgram")} />
					</SelectTrigger>
					<SelectContent>
						{programs.map((option) => (
							<SelectItem key={option.id} value={option.id}>
								{option.party}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={selectedProgram2}
					onValueChange={(value) =>
						handleProgramChange(value, setSelectedProgram2, setProgram2)
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={t("selectSecondProgram")} />
					</SelectTrigger>
					<SelectContent>
						{programs.map((option) => (
							<SelectItem key={option.id} value={option.id}>
								{option.party}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{loading && <p>{t("loading")}</p>}

			{program1 && program2 && (
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Headline program={program1} />
						<MarkdownRenderer content={program1.summary} />
					</div>
					<div>
						<Headline program={program2} />
						<MarkdownRenderer content={program2.summary} />
					</div>
				</div>
			)}
		</div>
	);
};

export default SideBySideComparisonTab;
