import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import "reflect-metadata";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
