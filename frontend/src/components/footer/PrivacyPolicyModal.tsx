import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type React from "react";
import { useTranslation } from "react-i18next";
import MarkdownRenderer from "../MarkdownRenderer";

interface PrivacyPolicyModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
	isOpen,
	onClose,
}) => {
	const { t } = useTranslation();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("privacyTitle")}</DialogTitle>
					<DialogDescription>{t("privacyDescription")}</DialogDescription>
				</DialogHeader>
				<div className="mt-4">
					<div className="space-y-6">
						<section>
							<MarkdownRenderer content={t("privacyContent.introduction")} />
						</section>
						<section>
							<MarkdownRenderer
								content={t("privacyContent.informationWeCollect")}
							/>
						</section>
						<section>
							<MarkdownRenderer
								content={t("privacyContent.howWeUseInformation")}
							/>
						</section>
						<section>
							<MarkdownRenderer
								content={t("privacyContent.disclosureOfInformation")}
							/>
						</section>
						<section>
							<MarkdownRenderer
								content={t("privacyContent.dataStorageSecurity")}
							/>
						</section>
						<section>
							<MarkdownRenderer content={t("privacyContent.gdprRights")} />
						</section>
						<section>
							<MarkdownRenderer content={t("privacyContent.childrenPrivacy")} />
						</section>
						<section>
							<MarkdownRenderer content={t("privacyContent.changesToPolicy")} />
						</section>
						<section>
							<MarkdownRenderer content={t("privacyContent.contactUs")} />
						</section>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PrivacyPolicyModal;
