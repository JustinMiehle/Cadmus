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
import { useToast } from "@/components/ui/use-toast";
import type { Program } from "@/types/api";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SingleProgramTab: React.FC = () => {
	const { t, i18n } = useTranslation();
	const { toast } = useToast();
	const [selectedProgram, setSelectedProgram] = useState<string>("");
	const [program, setProgram] = useState<Program>({} as Program);
	const [loading, setLoading] = useState<boolean>(false);
	const [programs, setPrograms] = useState<Program[]>([]);
	const currentElection = useApiStore((state) => state.currentElection);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect depends on the current language and election
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

	const handleProgramChange = async (value: string) => {
		setLoading(true);
		setSelectedProgram(value);
		const selectedOption = programs.find((option) => option.id === value);
		if (selectedOption) {
			try {
				const program = await ElectionApiHelper.summarizeProgram(
					selectedOption.url,
				);
				setProgram(program);
			} catch (error) {
				console.error("Error fetching summary:", error);
				toast({
					title: t("error"),
					description: t("failedToFetchSummary"),
					variant: "destructive",
				});
			}
		}
		setLoading(false);
	};

	return (
		<div className="space-y-4">
			<Select onValueChange={handleProgramChange} value={selectedProgram}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={t("selectProgram")} />
				</SelectTrigger>
				<SelectContent>
					{programs.map((option) => (
						<SelectItem key={option.id} value={option.id}>
							{option.party}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{loading && <p>{t("loading")}</p>}

			{program.summary && (
				<div>
					<Headline program={program} />
					<MarkdownRenderer content={program.summary} />
				</div>
			)}
		</div>
	);
};

export default SingleProgramTab;
