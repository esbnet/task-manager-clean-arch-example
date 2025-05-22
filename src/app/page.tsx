"use client";

import type { Column as ColumnType, TaskCategory } from "@/components/types";
import { useRef, useState } from "react";

import { Column } from "@/components/column";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { ModeToggleButton } from "@/components/mode-toggle-button";
import { TaskForm } from "@/components/task-form";
import { useTaskContext } from "@/contexts/TaskContext";
import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCorners,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { PlusCircle } from "lucide-react";

const COLUMNS: ColumnType[] = [
	{ id: "DIARIAS", title: "Díarios" },
	{ id: "HABITOS", title: "Hábitos" },
	{ id: "AFAZERES", title: "Afarezer" },
];

export default function Home() {
	const { tasks, updateTask } = useTaskContext();

	const [isDroped, setIsDroped] = useState(false);

	const renderCount = useRef(0);
	renderCount.current += 1;
	console.log(
		"page - esse componente re-renderizou",
		renderCount.current,
		"vezes",
	);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	if (tasks.length <= 0) return;

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;

		const taskId = active.id as string;
		const newCategory = over.id as TaskCategory;

		tasks.map(async (task) => {
			if (task.id === taskId) {
				const newTask = { ...task, category: newCategory };
				await updateTask(newTask);
			}
		});
	}

	return (
		<main className="relative flex flex-col gap-4 bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 m-auto p-2 lg:max-w-[80vw] min-h-screen">
			{/* Title */}
			<div className="flex bg-background/80 shadow-xl rounded-lg text-center animate-[fadeIn_1s_ease-in-out_forwards]">
				<div className="flex justify-center items-center gap-2 bg-clip-text bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 p-4 rounded-lg w-full font-bold text-transparent text-6xl">
					Gerenciador de Tarefas
				</div>
			</div>

			<TaskForm
				task={{
					title: "",
					category: "DIARIAS",
					priority: "BAIXA",
				}}
				icon={
					<div className="flex justify-self-end items-center gap-2 bg-background/30 shadow-xl p-2 rounded-lg w-fit animate-[fadeIn_1s_ease-in-out_forwards]">
						<PlusCircle className="text-foreground/40" />
						<span className="text-foreground/40' text-sm">
							Adicionar Tarefa
						</span>
					</div>
				}
			/>

			<DndContext
				onDragEnd={handleDragEnd}
				collisionDetection={closestCorners}
				sensors={sensors}
				onDragStart={() => setIsDroped(true)}
				onDragCancel={() => setIsDroped(false)}
				onDragOver={() => setIsDroped(true)}
				onDragMove={() => setIsDroped(true)}
			>
				<div className="flex justify-start justify-self-start items-start gap-2 bg-background/30 shadow-xl backdrop-blur-md p-4 rounded-lg w-full align-top animate-[fadeIn_1s_ease-in-out_forwards]">
					{COLUMNS.map((column) => {
						return (
							<Column
								key={column.id}
								column={column}
								tasks={tasks.filter(
									(task) => task.category === column.id,
								)}
							/>
						);
					})}
				</div>
			</DndContext>
			<ModeToggleButton />
		</main>
	);
}
