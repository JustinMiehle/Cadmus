import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type React from "react";
import { useTranslation } from "react-i18next";

interface ImprintModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ImprintModal: React.FC<ImprintModalProps> = ({ isOpen, onClose }) => {
	const { t } = useTranslation();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("imprintTitle")}</DialogTitle>
					<DialogDescription>{t("imprintDescription")}</DialogDescription>
				</DialogHeader>
				<div className="mt-4">
					<div className="space-y-6">
						<div>
							<h2 className="text-lg font-semibold">
								{t("imprintContent.responsibleForContent.heading")}
							</h2>
							<p>{t("imprintContent.responsibleForContent.name")}</p>
							<p>{t("imprintContent.responsibleForContent.address")}</p>
						</div>

						<div>
							<h2 className="text-lg font-semibold">
								{t("imprintContent.hosting.heading")}
							</h2>
							<p>{t("imprintContent.hosting.provider")}</p>
							<p>{t("imprintContent.hosting.company")}</p>
							<p>{t("imprintContent.hosting.address")}</p>
						</div>

						<div>
							<h2 className="text-lg font-semibold">
								{t("imprintContent.loggingAndPrivacy.heading")}
							</h2>
							<p>{t("imprintContent.loggingAndPrivacy.text")}</p>
						</div>

						<div>
							<h2 className="text-xl font-bold">
								{t("imprintContent.disclaimer.title")}
							</h2>
							<div className="mt-4">
								<h3 className="text-lg font-semibold">
									{t("imprintContent.disclaimer.liabilityForContent.heading")}
								</h3>
								<p>{t("imprintContent.disclaimer.liabilityForContent.text")}</p>
							</div>
							<div className="mt-4">
								<h3 className="text-lg font-semibold">
									{t("imprintContent.disclaimer.liabilityForLinks.heading")}
								</h3>
								<p>{t("imprintContent.disclaimer.liabilityForLinks.text")}</p>
							</div>
						</div>

						<div>
							<h2 className="text-lg font-semibold">
								{t("imprintContent.copyright.heading")}
							</h2>
							<p>{t("imprintContent.copyright.text")}</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ImprintModal;
