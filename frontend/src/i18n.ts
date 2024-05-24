// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import sv from "./locales/sv.json";

export const LANGUAGE_OPTIONS = [
	{ value: "en", country: "gb", language: "English" },
	{ value: "de", country: "de", language: "Deutsch" },
	{ value: "fr", country: "fr", language: "Français" },
	{ value: "es", country: "es", language: "Espanol" },
	{ value: "sv", country: "se", language: "Svensk" },
	{ value: "it", country: "it", language: "Italiano" },
];

// Define the structure of your translations
interface TranslationResource {
	[language: string]: {
		[namespace: string]: {
			[key: string]:
				| string
				| {
						[key: string]:
							| string
							| {
									[key: string]:
										| string
										| string
										| {
												[key: string]: string;
										  };
							  };
				  };
		};
	};
}

// Assert the type of your translations
const typedTranslations: TranslationResource = {
	en: { translation: en },
	de: { translation: de },
	es: { translation: es },
	fr: { translation: fr },
	it: { translation: it },
	sv: { translation: sv },
};

i18n
	.use(initReactI18next) // Passes i18n down to react-i18next
	.init({
		resources: typedTranslations,
		lng: "en", // Default language
		fallbackLng: "en", // Fallback language if translation not available
		interpolation: {
			escapeValue: false, // React already escapes values to prevent XSS
		},
	});

export default i18n;
