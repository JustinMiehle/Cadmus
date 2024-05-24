import type React from "react";
import { memo } from "react";

interface FlagProps {
	country: string;
	className?: string;
}

const areEqual = (prevProps: FlagProps, nextProps: FlagProps) => {
	return prevProps.country === nextProps.country;
};

const Flag: React.FC<FlagProps> = memo(({ country, className = "" }) => {
	const getFlagUrl = (countryCode: string) => {
		return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
	};

	return (
		<img
			src={getFlagUrl(country)}
			alt={`${country} flag`}
			className={`inline-block w-5 h-auto ${className}`}
		/>
	);
}, areEqual);

Flag.displayName = "Flag";

export default Flag;
