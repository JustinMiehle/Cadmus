import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ElectionApiHelper } from "../../api/ElectionApiHelper";
import type { Program } from "../../types/api";
import MarkdownRenderer from "../MarkdownRenderer";
import { Headline } from "./Headline";

interface AddProgramComponentProps {
	onProgramAdded: (program: Program) => void;
}

const AddProgramComponent: React.FC<AddProgramComponentProps> = ({
	onProgramAdded,
}) => {
	const { t } = useTranslation();
	const { toast } = useToast();
	const [newProgramUrl, setNewProgramUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [program, setProgram] = useState<Program>({} as Program);

	const handleSubmitNewProgram = async () => {
		if (!newProgramUrl) {
			toast({
				title: t("error"),
				description: t("pleaseProvideUrl"),
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
		try {
			const program = await ElectionApiHelper.summarizeProgram(newProgramUrl);
			toast({
				title: t("success"),
				description: t("programAddedSuccessfully"),
			});
			setNewProgramUrl("");
			setProgram(program);
			onProgramAdded(program); // Notify parent component that a new program was added
		} catch (error) {
			console.error("Error adding new program:", error);
			toast({
				title: t("error"),
				description: t("failedToAddProgram"),
				variant: "destructive",
			});
		}
		setLoading(false);
	};

	return (
		<div>
			<div className="flex space-x-2">
				<Input
					type="url"
					placeholder={t("enterProgramUrl")}
					value={newProgramUrl}
					onChange={(e) => setNewProgramUrl(e.target.value)}
				/>
				<Button onClick={handleSubmitNewProgram} disabled={loading}>
					{t("addProgram")}
				</Button>
			</div>
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

export default AddProgramComponent;
