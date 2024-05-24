import { ElectionApiHelper, useApiStore } from "@/api/ElectionApiHelper";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
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

const CompareProgramsTab: React.FC = () => {
	const { t, i18n } = useTranslation();
	const { toast } = useToast();
	const [selectedProgram1, setSelectedProgram1] = useState<string>("");
	const [selectedProgram2, setSelectedProgram2] = useState<string>("");
	const [differenceExplanation, setDifferenceExplanation] =
		useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [programs, setPrograms] = useState<Program[]>([]);
	const currentElection = useApiStore((state) => state.currentElection);

	// biome-ignore lint/correctness/useExhaustiveDependencies: both are intentional
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
	const fetchDifferences = async () => {
		if (selectedProgram1 && selectedProgram2) {
			setLoading(true);
			try {
				const url1 = programs.find(
					(option) => option.id === selectedProgram1,
				)?.url;
				const url2 = programs.find(
					(option) => option.id === selectedProgram2,
				)?.url;
				if (url1 && url2) {
					const differences = await ElectionApiHelper.explainDifferences(
						url1,
						url2,
					);
					setDifferenceExplanation(differences);
				}
			} catch (error) {
				console.error("Error fetching differences:", error);
				toast({
					title: t("error"),
					description: t("failedToFetchDifferences"),
					variant: "destructive",
				});
			}
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex space-x-4">
				<Select onValueChange={setSelectedProgram1} value={selectedProgram1}>
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

				<Select onValueChange={setSelectedProgram2} value={selectedProgram2}>
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

			<Button
				onClick={fetchDifferences}
				disabled={!selectedProgram1 || !selectedProgram2 || loading}
			>
				{t("compareProgramsButton")}
			</Button>

			{loading && <p>{t("loading")}</p>}

			{differenceExplanation && (
				<div>
					<h3 className="text-lg font-semibold">
						{t("explanationOfDifferences")}
					</h3>
					<MarkdownRenderer content={differenceExplanation} />
				</div>
			)}
		</div>
	);
};

export default CompareProgramsTab;
