// Layout.tsx
import { ReactComponent as EuropeanBackground } from "../icons/background.svg";
import Header from "./Header";
import Footer from "./footer/Footer";

const Layout = ({ children }) => {
	return (
		<div>
			<EuropeanBackground className="fixed inset-0 w-full h-full -z-10 opacity-10" />
			<Header />
			{children}
			<Footer />
		</div>
	);
};

export default Layout;
