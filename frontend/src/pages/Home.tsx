import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home = () => {
	const { t } = useTranslation();

	return (
		<>
			<div className="container mx-auto px-4 py-8 relative overflow-hidden">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">{t("welcome_heading")}</h2>
					<p className="text-xl max-w-2xl mx-auto">{t("welcome_subtitle")}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Card>
						<CardHeader>
							<CardTitle>{t("election_program_title")}</CardTitle>
							<CardDescription>
								{t("election_program_description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">{t("election_program_content")}</p>
							<Link to="/elections">
								<Button>{t("election_program_button")}</Button>
							</Link>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t("parliamentary_session_title")}</CardTitle>
							<CardDescription>
								{t("parliamentary_session_description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">{t("parliamentary_session_content")}</p>
							<Link to="/sessions">
								<Button>{t("parliamentary_session_button")}</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default Home;
