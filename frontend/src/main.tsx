import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import i18n from "./i18n";
import "./index.css";
import Elections from "./pages/Elections";
import Home from "./pages/Home";
import SessionsRouteWrapper from "./pages/sessions/SessionsRouteWrapper";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<ThemeProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path="/" index element={<Home />} />
							<Route path="/elections" element={<Elections />} />
							<Route path="/sessions/*" element={<SessionsRouteWrapper />} />
						</Routes>
					</Layout>
				</Router>
			</ThemeProvider>
		</I18nextProvider>
	</React.StrictMode>,
);
