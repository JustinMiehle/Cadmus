import { Button } from "@/components/ui/button";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AboutModal from "./AboutModal";
import ImprintModal from "./ImprintModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const Footer: React.FC = () => {
	const { t } = useTranslation();
	const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
	const [isImprintModalOpen, setIsImprintModalOpen] = useState(false);
	const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] =
		useState(false);

	return (
		<>
			<footer className="h-[40px] bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center text-sm fixed bottom-0 left-0 right-0 z-10 mt-8">
				<span>{t("footerText")}</span>
				&nbsp;&nbsp;|&nbsp;
				<Button
					variant="link"
					className="ml-2 p-0 h-auto text-blue-600 hover:underline"
					onClick={() => window.open("https://www.euacc.org/", "_blank")}
				>
					EU/Acc
				</Button>
				&nbsp;&nbsp;|&nbsp;
				<Button
					variant="link"
					className="ml-2 p-0 h-auto text-blue-600 hover:underline"
					onClick={() => window.open("https://x.com/justinmiehle", "_blank")}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-4 h-4 inline-block"
						aria-label="X Logo"
					>
						<title>X Logo</title>
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
				</Button>
				&nbsp;&nbsp;|&nbsp;
				<Button
					variant="link"
					className="ml-2 p-0 h-auto text-blue-600 hover:underline"
					onClick={() =>
						window.open("https://github.com/justinmiehle", "_blank")
					}
				>
					GitHub
				</Button>
				&nbsp;&nbsp;|&nbsp;
				<Button
					variant="link"
					className="ml-2 p-0 h-auto text-blue-600 hover:underline"
					onClick={() => setIsAboutModalOpen(true)}
				>
					{t("aboutLink")}
				</Button>
				&nbsp;&nbsp;|&nbsp;
				<Button
					variant="link"
					className="ml-2 p-0 h-auto text-blue-600 hover:underline"
					onClick={() => setIsImprintModalOpen(true)}
				>
					{t("imprintLink")}
				</Button>
				&nbsp;&nbsp;|&nbsp;
				<Button
					variant="link"
					className="ml-2 p-0 h-auto text-blue-600 hover:underline"
					onClick={() => setIsPrivacyPolicyModalOpen(true)}
				>
					{t("privacyLink")}
				</Button>
			</footer>
			<AboutModal
				isOpen={isAboutModalOpen}
				onClose={() => setIsAboutModalOpen(false)}
			/>
			<ImprintModal
				isOpen={isImprintModalOpen}
				onClose={() => setIsImprintModalOpen(false)}
			/>
			<PrivacyPolicyModal
				isOpen={isPrivacyPolicyModalOpen}
				onClose={() => setIsPrivacyPolicyModalOpen(false)}
			/>
		</>
	);
};
export default Footer;
