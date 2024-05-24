import i18n from "@/i18n";

// biome-ignore lint/complexity/noStaticOnlyClass: This is a helper class
export abstract class ApiHelperBase {
	private static API_URL = "http://localhost:5001/api/";

	private static getApiUrl(): string {
		if (window.location.href.includes("electionprograms")) {
			return "https://electionprograms.oa.r.appspot.com/api/";
		}
		return ApiHelperBase.API_URL;
	}

	public static async fetchWithLang(
		url: string,
		options: RequestInit = {},
	): Promise<Response> {
		const language = i18n.language;
		options.headers = {
			...(options.headers || {}),
			"Accept-Language": language,
		};
		return fetch(`${ApiHelperBase.getApiUrl()}${url}`, options);
	}
}
