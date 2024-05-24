import SessionDetails from "@/pages/sessions/SessionDetails";
import Sessions from "@/pages/sessions/Sessions";
import { SessionsWrapper } from "@/pages/sessions/SessionsWrapper";
import type React from "react";
import { Route, Routes } from "react-router-dom";

const SessionsRouteWrapper: React.FC = () => {
	return (
		<SessionsWrapper>
			<Routes>
				<Route index element={<Sessions />} />
				<Route path=":id" element={<SessionDetails />} />
			</Routes>
		</SessionsWrapper>
	);
};

export default SessionsRouteWrapper;
