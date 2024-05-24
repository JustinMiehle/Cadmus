import { Headline } from "@/components/elections/Headline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ElectionApiHelper } from "../../api/ElectionApiHelper";
import type { Program } from "../../types/api";
import MarkdownRenderer from "../MarkdownRenderer";

interface BatchAddProgramComponentProps {
	onProgramsAdded: (programs: Program[]) => void;
}

const BatchAddProgramComponent: React.FC<BatchAddProgramComponentProps> = ({
	onProgramsAdded,
}) => {
	const { t } = useTranslation();
	const { toast } = useToast();
	const [newBatch, setNewBatch] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [programs, setPrograms] = useState<Program[]>([]);

	const handleSubmitNewBatch = async () => {
		if (!newBatch) {
			toast({
				title: t("error"),
				description: t("pleaseProvideUrl"),
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
		try {
			const programs =
				await ElectionApiHelper.summarizeProgramsFromBatchText(newBatch);
			toast({
				title: t("success"),
				description: t("batchAddedSuccessfully"),
			});
			setNewBatch("");
			setPrograms(programs);
			onProgramsAdded(programs); // Notify parent component that a new program was added
		} catch (error) {
			console.error("Error adding new batch:", error);
			toast({
				title: t("error"),
				description: t("failedToBatchAddPrograms"),
				variant: "destructive",
			});
		}
		setLoading(false);
	};

	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">{t("addNewBatch")}</h3>
			<div className="flex space-x-2">
				<Input
					type="url"
					placeholder={t("enterBatch")}
					value={newBatch}
					onChange={(e) => setNewBatch(e.target.value)}
				/>
				<Button onClick={handleSubmitNewBatch} disabled={loading}>
					{t("BatchaddProgram")}
				</Button>
			</div>
			{loading && <p>{t("loading")}</p>}

			{programs.length > 1 &&
				programs.map((program) => (
					<div key={program.id}>
						<Headline program={program} />
						<MarkdownRenderer content={program.summary} />
					</div>
				))}
		</div>
	);
};

export default BatchAddProgramComponent;
