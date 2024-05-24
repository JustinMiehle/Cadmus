import Flag from "@/components/Flag";
import ElectionSelect from "@/components/elections/ElectionSelect";
import ParliamentSelect from "@/components/sessions/ParliamentSelect";
import useLanguage from "@/hooks/useLanguage";
import { LANGUAGE_OPTIONS } from "@/i18n";
import { ReactComponent as EuropeanFlag } from "@/icons/europe.svg";
import {
	FlagIcon,
	House,
	Landmark,
	List,
	Mailbox,
	Menu,
	X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

const LanguageOption = React.memo(
	({ country, language }: { country: string; language: string }) => (
		<div className="flex items-center">
			<Flag country={country} className="mr-2" />
			<span>{language}</span>
		</div>
	),
);

LanguageOption.displayName = "LanguageOption";

const Header = () => {
	const { t } = useTranslation();
	const { changeLanguage, language } = useLanguage();
	const handleLanguageChange = (newLang: string) => {
		changeLanguage(newLang);
	};
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const languageOptions = useMemo(() => LANGUAGE_OPTIONS, []);

	return (
		<nav className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-3 flex items-center">
				<Link to="/" className="flex items-center">
					<EuropeanFlag viewBox="0 0 810 540" className="w-24 h-24 mr-3" />
					<h1 className="text-2xl font-bold text-blue-900">{t("title")}</h1>
				</Link>

				<div className="hidden md:flex items-center space-x-4 ml-auto">
					{pathname === "/elections" && <ElectionSelect />}
					{pathname === "/sessions" && <ParliamentSelect />}
				</div>
				<div className="hidden md:flex items-center space-x-4 ml-5">
					<Select onValueChange={handleLanguageChange} defaultValue={language}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder={t("selectLanguage")} />
						</SelectTrigger>
						<SelectContent>
							{languageOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									<LanguageOption
										country={option.country}
										language={option.language}
									/>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="relative md:ml-5 ml-auto">
					<button
						onClick={toggleMenu}
						className="flex items-center focus:outline-none"
						aria-label="Toggle menu"
						type="button"
					>
						{isMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
					{isMenuOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
							<Link
								to="/"
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
								onClick={toggleMenu}
							>
								<House className="h-4 w-4 mr-2" />
								{t("homeLink")}
							</Link>
							<Link
								to="/sessions"
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
								onClick={toggleMenu}
							>
								<List className="h-4 w-4 mr-2" />
								{t("sessionsLink")}
							</Link>
							<Link
								to="/elections"
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
								onClick={toggleMenu}
							>
								<Mailbox className="h-4 w-4 mr-2" />
								{t("electionsLink")}
							</Link>
							<div className="md:hidden">
								<div className="flex items-center space-x-4 px-4 py-2">
									<Landmark className="h-4 w-4" />
									{pathname === "/elections" && <ElectionSelect />}
									{pathname === "/sessions" && <ParliamentSelect />}
								</div>
								<div className="flex items-center space-x-4 px-4 py-2">
									<FlagIcon className="h-4 w-4" />
									<Select
										onValueChange={handleLanguageChange}
										defaultValue={language}
									>
										<SelectTrigger className="w-[150px]">
											<SelectValue placeholder={t("selectLanguage")} />
										</SelectTrigger>
										<SelectContent>
											{languageOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													<LanguageOption
														country={option.country}
														language={option.language}
													/>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Header;
