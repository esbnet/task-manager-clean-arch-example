import "./globals.css";

import { Lobster, Syne_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const lobster = Lobster({
	subsets: ["latin"],
	weight: "400", // Lobster geralmente só tem peso 400
	variable: "--font-lobster",
});

const syneMono = Syne_Mono({
	subsets: ["latin"],
	weight: "400", // Lobster geralmente só tem peso 400
	variable: "--font-syne-mono",
});

export const metadata: Metadata = {
	title: "Task Manager",
	description: "Gerenciador de Tarefas",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body
				className={` ${lobster.className}  ${syneMono.className}   antialiased`}
			>
				{children}
				<Toaster richColors />
			</body>
		</html>
	);
}
