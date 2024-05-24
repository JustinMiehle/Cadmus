import { type Election, useApiStore } from "@/api/ElectionApiHelper";
// components/ElectionSelect.tsx
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type React from "react";
import { useTranslation } from "react-i18next";

const ElectionSelect: React.FC = () => {
	const { t } = useTranslation();
	const { elections, currentElection, setCurrentElection } = useApiStore();

	const handleElectionChange = (electionId: string) => {
		const selectedElection = elections.find(
			(e: Election) => e.id === electionId,
		);
		if (selectedElection) {
			setCurrentElection(selectedElection);
		}
	};

	return (
		<Select
			onValueChange={handleElectionChange}
			value={currentElection?.id || ""}
		>
			<SelectTrigger className="w-[150px] md:w-[205px] text-xs md:text-sm text-left">
				<SelectValue placeholder={t("selectElection")} />
			</SelectTrigger>
			<SelectContent>
				{elections &&
					elections.length > 0 &&
					elections.map((election: Election) => (
						<SelectItem key={election.id} value={election.id}>
							{t(`elections.${election.id}`)}
						</SelectItem>
					))}
			</SelectContent>
		</Select>
	);
};

export default ElectionSelect;
