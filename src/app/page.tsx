"use client";

import {
	FcHighPriority,
	FcLowPriority,
	FcMediumPriority,
} from "react-icons/fc";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { ApiTaskRepository } from "@/infra/repositories/api-task-repository";
import { Button } from "@/components/ui/button";
import { CreateTaskUseCase } from "@/use-cases/create-task/create-task-use-case";
import { Input } from "@/components/ui/input";
import { ListTasksUseCase } from "@/use-cases/list-tasks/list-task-use-case";
import type { Task } from "@/domain/entities/task";
import { TaskCard } from "@/components/task-card";

// const taskRepository = new InMemoryTaskRepository();
const taskRepository = new ApiTaskRepository();
const listTasks = new ListTasksUseCase(taskRepository);
const createTask = new CreateTaskUseCase(taskRepository);

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [priority, setPriority] = useState("");

	async function loadTasks() {
		const result = await listTasks.execute();
		setTasks(result.tasks);
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
	}

	async function handleToggle(id: string) {
		const task = tasks.find((t) => t.id === id);
		if (!task) return;

		await taskRepository.toggleComplete(id);
		await loadTasks();
	}

	async function handleDelete(id: string) {
		await taskRepository.delete(id);
		await loadTasks();
	}

	function handleChangeCategory(value: string) {
		setCategory(value);
	}

	return (
		<main className="mx-auto p-8 max-w-6xl">
			<h1 className="mb-4 font-bold text-4xl">Gerenciador de Tarefas</h1>

			<div className="flex gap-2 bg-zinc-100 mb-4 p-2 border rounded-lg">
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Nova tarefa"
				/>

				<Select required onValueChange={handleChangeCategory}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Categoria" />
					</SelectTrigger>
					<SelectContent className="w-[180px]">
						<SelectItem value="hábitos">Hábitos</SelectItem>
						<SelectItem value="diárias">Diárias</SelectItem>
						<SelectItem value="afazeres">Afazeres</SelectItem>
					</SelectContent>
				</Select>

				<Select required onValueChange={(e) => setPriority(e)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Prioridade" />
					</SelectTrigger>
					<SelectContent className="w-[180px]">
						<SelectItem value="baixa">
							{" "}
							<FcLowPriority size={24} /> Baixa
						</SelectItem>
						<SelectItem value="média">
							{" "}
							<FcMediumPriority size={24} /> Média
						</SelectItem>
						<SelectItem value="alta">
							{" "}
							<FcHighPriority size={24} /> Alta
						</SelectItem>
					</SelectContent>
				</Select>

				<Button onClick={handleAddTask}>Adicionar</Button>
			</div>

			<div className="gap-3 grid grid-cols-3">
				<div className="space-y-2 bg-green-300/20 p-2 border rounded-lg h-[20rem]">
					<h1 className="bg-zinc-300 p-2 rounded-lg text-center">
						Tarefas Hábitos
					</h1>
					<div className="flex flex-col gap-2">
						{tasks
							.filter((task) => task.category === "hábitos")
							.map((task) => (
								<TaskCard
									key={task.id}
									task={task}
									onToggle={() => handleToggle(task.id)}
									onDelete={() => handleDelete(task.id)}
								/>
							))}
					</div>
				</div>

				<div className="space-y-2 bg-red-300/20 p-2 border rounded-lg">
					<h1 className="bg-zinc-300 p-2 rounded-lg text-center">
						Tarefas Diárias
					</h1>
					<div className="flex flex-col gap-2">
						{tasks
							.filter((task) => task.category === "diárias")
							.map((task) => (
								<TaskCard
									key={task.id}
									task={task}
									onToggle={() => handleToggle(task.id)}
									onDelete={() => handleDelete(task.id)}
								/>
							))}
					</div>
				</div>

				<div className="space-y-2 bg-yellow-300/20 p-2 border rounded-lg">
					<h1 className="bg-zinc-300 p-2 rounded-lg text-center">Afazeres</h1>
					<div className="flex flex-col gap-2">
						{tasks
							.filter((task) => task.category === "afazeres")
							.map(
								(task) =>
									task.category === "afazeres" && (
										<TaskCard
											key={task.id}
											task={task}
											onToggle={() => handleToggle(task.id)}
											onDelete={() => handleDelete(task.id)}
										/>
									),
							)}
					</div>
				</div>
			</div>
		</main>
	);
}
