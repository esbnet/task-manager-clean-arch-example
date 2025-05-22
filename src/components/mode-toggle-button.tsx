"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export function ModeToggleButton() {
	const { setTheme, theme } = useTheme();

	return (
		<div className="top-4 right-4 fixed">
			<Button
				aria-label="Toggle dark mode"
				className="p-0 rounded-full w-8 h-8"
				variant="ghost"
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			>
				{theme === "dark" ? (
					<Sun className="w-[1.2rem] h-[1.2rem] rotate-90 dark:rotate-0 scale-0 dark:scale-100 transition-all" />
				) : (
					<Moon className="w-[1.2rem] h-[1.2rem] rotate-0 dark:-rotate-90 scale-100 dark:scale-0 transition-all" />
				)}
			</Button>
		</div>
	);
}
