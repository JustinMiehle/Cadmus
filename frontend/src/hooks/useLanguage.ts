import { useEffect, useState } from "react";
import i18n from "../i18n";

const useLanguage = () => {
	const [language, setLanguage] = useState(() => {
		const storedLanguage = sessionStorage.getItem("language");
		return storedLanguage || i18n.language;
	});

	useEffect(() => {
		i18n.changeLanguage(language);
	});

	useEffect(() => {
		i18n.changeLanguage(language);
		sessionStorage.setItem("language", language);
	}, [language]);

	const changeLanguage = (newLanguage) => {
		setLanguage(newLanguage);
	};

	return { language, changeLanguage };
};

export default useLanguage;
