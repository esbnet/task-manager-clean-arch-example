"use client";

// import type { TaskCategory } from "@/types";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCorners,
	useSensor,
	useSensors,
} from "@dnd-kit/core";

import { DailyColumn } from "@/components/daily/daily-column";
import { DailyProvider } from "@/contexts/daily-context";
import { HabitColumn } from "@/components/habit/habit-column";
import { HabitProvider } from "@/contexts/habit-context";
import { ModeToggleButton } from "@/components/mode-toggle-button";
import { PlusCircle } from "lucide-react";
import { TodoColumn } from "@/components/todo/todo-column";
import { TodoProvider } from "@/contexts/todo-context";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";

export default function Home() {
	// const { tasks, updateTask } = useTaskContext();
	const [isDroped, setIsDroped] = useState(false);

	if (isDroped) {
		document.body.style.overflow = "hidden";
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// if (tasks.length <= 0) return;

	// function handleDragEnd(event: DragEndEvent) {
	// 	const { active, over } = event;

	// 	if (!over) return;

	// 	const taskId = active.id as string;
	// 	const newCategory = over.id as TaskCategory;

	// 	tasks.map(async (task) => {
	// 		if (task.id === taskId) {
	// 			const newTask = { ...task, category: newCategory };
	// 			await updateTask(newTask);
	// 		}
	// 		return task;
	// 	});
	// }

	return (
		<main className="relative flex flex-col gap-4 bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 m-auto p-2 lg:max-w-[80vw] min-h-screen">
			{/* Title */}
			<div className="flex bg-background/80 shadow-xl rounded-lg text-center animate-[fadeIn_1s_ease-in-out_forwards]">
				<div className="flex justify-center items-center gap-2 bg-clip-text bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 p-4 rounded-lg w-full font-bold text-transparent text-6xl">
					Gerenciador de Tarefas
				</div>
			</div>

			{/* <TaskForm
				task={{
					title: "",
					category: "DIARIAS",
					priority: "BAIXA",
				}}
				icon={<AddTaskButton />}
			/> */}

			<DndContext
				// onDragEnd={handleDragEnd}
				collisionDetection={closestCorners}
				sensors={sensors}
				onDragStart={() => setIsDroped(true)}
				onDragCancel={() => setIsDroped(false)}
				onDragOver={() => setIsDroped(true)}
				onDragMove={() => setIsDroped(true)}
			>
				<HabitProvider>
					<HabitColumn />
				</HabitProvider>
				<DailyProvider>
					<DailyColumn />
				</DailyProvider>
				<TodoProvider>
					<TodoColumn />
				</TodoProvider>
			</DndContext>
			<ModeToggleButton />
		</main>
	);
}

function AddTaskButton() {
	return (
		<div className="flex justify-self-end items-center gap-2 bg-background/30 shadow-xl p-2 rounded-lg w-fit animate-[fadeIn_1s_ease-in-out_forwards]">
			<PlusCircle className="text-foreground/40" />
			<span className="text-foreground/40' text-sm">
				Adicionar Tarefa
			</span>
		</div>
	);
}
