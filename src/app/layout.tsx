import "./globals.css";

import { Kode_Mono, Lobster } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { HabitProvider } from "@/contexts/habit-context";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

const lobster = Lobster({
	subsets: ["latin"],
	weight: "400", // Lobster geralmente só tem peso 400
	variable: "--font-lobster",
});

// const syneMono = Syne_Mono({
// 	subsets: ["latin"],
// 	weight: "400", // Lobster geralmente só tem peso 400
// 	variable: "--font-syne-mono",
// });

const kodeMono = Kode_Mono({
	subsets: ["latin"],
	weight: "400", // Lobster geralmente só tem peso 400
	variable: "--font-kode-mono",
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
		<html lang="pt-BR" data-theme="light">
			<body
				className={` ${lobster.className}  ${kodeMono.className} antialiased `}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
