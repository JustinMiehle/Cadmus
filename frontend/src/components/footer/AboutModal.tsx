import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type React from "react";
import { useTranslation } from "react-i18next";

interface AboutModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
	const { t } = useTranslation();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("aboutTitle")}</DialogTitle>
					<DialogDescription>{t("aboutDescription")}</DialogDescription>
				</DialogHeader>
				<div className="mt-4">
					<p>{t("aboutContent")}</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AboutModal;
