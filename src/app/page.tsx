"use client";

import { DailyColumn } from "@/components/daily/daily-column";
import { HabitColumn } from "@/components/habit/habit-column";
import { ModeToggleButton } from "@/components/mode-toggle-button";
import { TodoColumn } from "@/components/todo/todo-column";
import { DailyProvider } from "@/contexts/daily-context";
import { HabitProvider } from "@/contexts/habit-context";
import { TodoProvider } from "@/contexts/todo-context";

export default function Home() {
	return (
		<main className="relative flex flex-col gap-4 bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 m-auto p-2 lg:max-w-[80vw] min-h-screen">

			<div className="flex bg-background/80 shadow-xl rounded-lg text-center animate-[fadeIn_1s_ease-in-out_forwards]">
				<div className="flex justify-center items-center gap-2 bg-clip-text bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 p-4 rounded-lg w-full font-bold text-transparent text-6xl">
					Gerenciador de Tarefas
				</div>
			</div>

			<div className="flex flex-row gap-4">
				<HabitProvider>
					<HabitColumn />
				</HabitProvider>
				<DailyProvider>
					<DailyColumn />
				</DailyProvider>
				<TodoProvider>
					<TodoColumn />
				</TodoProvider>
			</div>

			<ModeToggleButton />
		</main>
	);
}
