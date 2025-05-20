import "./globals.css";

import { Lobster, Syne_Mono } from "next/font/google";

import type { Metadata } from "next";
import { TaskProvider } from "@/contexts/TaskContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
					<TaskProvider>{children}</TaskProvider>
				</ThemeProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
