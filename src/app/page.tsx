"use client";

import type { Column as ColumnType, Task } from "@/components/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import {
	FcHighPriority,
	FcLowPriority,
	FcMediumPriority,
} from "react-icons/fc";

import { Column } from "@/components/column";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiTaskRepository } from "@/infra/repositories/api-task-repository";
import { CreateTaskUseCase } from "@/use-cases/create-task/create-task-use-case";
import { ListTasksUseCase } from "@/use-cases/list-tasks/list-task-use-case";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { UpdateTaskUseCase } from "@/use-cases/update-task/update-task-use-case";
import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCorners,
	useSensor,
	useSensors,
} from "@dnd-kit/core";

// const taskRepository = new InMemoryTaskRepository();
const taskRepository = new ApiTaskRepository();
const listTasks = new ListTasksUseCase(taskRepository);
const createTask = new CreateTaskUseCase(taskRepository);
const updateTask = new UpdateTaskUseCase(taskRepository);

const COLUMNS: ColumnType[] = [
	{ id: "DIARIAS", title: "Díarios" },
	{ id: "HABITOS", title: "Hábitos" },
	{ id: "AFAZERES", title: "Afarezer" },
];

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [priority, setPriority] = useState("");
	const [isDroped, setIsDroped] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

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

	async function loadTasks() {
		const result = await listTasks.execute();
		setTasks(result.tasks);
		setIsLoading(false);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadTasks();
	}, []);

	async function handleAddTask() {
		if (!title.trim()) return;
		await createTask.execute({ title, category, priority });
		setTitle("");
		setCategory("");
		setPriority("");
		await loadTasks();
		toast.success("Tarefa criada com sucesso!");
	}

	async function handleUpdateTask() {
		if (!title.trim()) return;
		await createTask.execute({ title, category, priority });
		setTitle("");
		setCategory("");
		setPriority("");
		await loadTasks();
		toast.success("Tarefa criada com sucesso!");
	}

	function handleChooseCategory(value: string) {
		setCategory(value);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over) return;

		const taskId = active.id as string;
		const newCategory = over.id as Task["category"];

		setTasks(() =>
			tasks.map((task) => {
				if (task.id === taskId) {
					const newTask = { ...task, category: newCategory };
					updateTask.execute(newTask);
					return newTask;
				}
				return task;
			}),
		);
	}

	return (
		<main className="flex flex-col gap-4 bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 p-2 min-h-screen">
			{/* Title */}
			<div className="flex bg-slate-800 shadow-xl rounded-lg text-center animate-[fadeIn_1s_ease-in-out_forwards]">
				<div className="flex justify-center items-center gap-2 bg-clip-text bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 p-4 rounded-lg w-full font-bold text-transparent text-6xl">
					Gerenciador de Tarefas
				</div>
			</div>

			{/* Form to create a new task  */}
			<div className="flex gap-2 bg-zinc-100/30 opacity-0 shadow-xl backdrop-blur-md p-4 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Nova tarefa"
					required
					className=""
				/>

				<Select required onValueChange={handleChooseCategory} value={category}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Categoria" />
					</SelectTrigger>
					<SelectContent className="w-[180px]">
						<SelectItem value="hábitos">Hábitos</SelectItem>
						<SelectItem value="diárias">Diárias</SelectItem>
						<SelectItem value="afazeres">Afazeres</SelectItem>
					</SelectContent>
				</Select>

				<Select required onValueChange={(e) => setPriority(e)} value={priority}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Prioridade" />
					</SelectTrigger>
					<SelectContent className="w-[180px]">
						<SelectItem value="baixa">
							<FcLowPriority size={24} /> Baixa
						</SelectItem>
						<SelectItem value="média">
							<FcMediumPriority size={24} /> Média
						</SelectItem>
						<SelectItem value="alta">
							<FcHighPriority size={24} /> Alta
						</SelectItem>
					</SelectContent>
				</Select>

				<Button onClick={handleAddTask}>Adicionar</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center m-auto">
					<Loader2 className="animate-spin" />
				</div>
			) : (
				<DndContext
					onDragEnd={handleDragEnd}
					collisionDetection={closestCorners}
					sensors={sensors}
					onDragStart={() => setIsDroped(true)}
					onDragCancel={() => setIsDroped(false)}
					onDragOver={() => setIsDroped(true)}
					onDragMove={() => setIsDroped(true)}
				>
					<div className="flex justify-start justify-self-start items-start gap-2 bg-white/30 shadow-xl backdrop-blur-md p-4 rounded-lg w-full align-top animate-[fadeIn_1s_ease-in-out_forwards]">
						{COLUMNS.map((column) => {
							return (
								<Column
									key={column.id}
									column={column}
									tasks={tasks.filter((task) => task.category === column.id)}
								/>
							);
						})}
					</div>
				</DndContext>
			)}
		</main>
	);
}
