// components/ElectionSelect.tsx
import { type Parliament, useApiStore } from "@/api/SessionsApiHelper";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type React from "react";
import { useTranslation } from "react-i18next";

const ParliamentSelect: React.FC = () => {
	const { t } = useTranslation();
	const { parliaments, currentParliament, setCurrentParliament } =
		useApiStore();

	const handleParliamentChange = (parliamentId: string) => {
		const selectedParliament = parliaments.find(
			(p: Parliament) => p.id === parliamentId,
		);
		if (selectedParliament) {
			setCurrentParliament(selectedParliament);
		}
	};

	return (
		<Select
			onValueChange={handleParliamentChange}
			value={currentParliament?.id || ""}
		>
			<SelectTrigger className="w-[150px] md:w-[205px] text-xs md:text-sm text-left">
				<SelectValue placeholder={t("selectParliament")} />
			</SelectTrigger>
			<SelectContent>
				{parliaments &&
					parliaments.length > 0 &&
					parliaments.map((parliament: Parliament) => (
						<SelectItem key={parliament.id} value={parliament.id}>
							{t(`parliaments.${parliament.id}`)}
						</SelectItem>
					))}
			</SelectContent>
		</Select>
	);
};

export default ParliamentSelect;
