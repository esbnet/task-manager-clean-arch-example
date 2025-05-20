import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import type { Task, TaskCategory, TaskPriority } from "./types";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";

interface TaskFormProps {
	task: Partial<Task> & Pick<Task, "category" | "priority" | "title">;
	icon: React.ReactNode;
}

export function TaskForm({ task, icon }: TaskFormProps) {
	const { updateTask, addTask } = useTaskContext();

	const [title, setTitle] = useState(task.title || "");
	const [category, setCategory] = useState<TaskCategory>(task.category);
	const [priority, setPriority] = useState<TaskPriority>(task.priority);
	const [open, setOpen] = useState(false);

	async function handleUpdateTask() {
		if (!title.trim()) return;

		try {
			await updateTask({
				...task,
				title,
				category,
				priority,
			} as Task);

			toast.success("Tarefa atualizada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error("Erro ao atualizar tarefa");
		}
	}

	async function handleAddTask() {
		if (!title.trim()) {
			toast.warning("Título da tarefa é obrigatório");
			return;
		}

		try {
			await addTask(title, category, priority);
			setTitle("");
			setCategory("DIARIAS");
			setPriority("BAIXA");
			toast.success("Tarefa criada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error("Erro ao criar tarefa");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				{icon}
				<span className="sr-only">Edit task</span>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-2 bg-transparent backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle>Editar Tarefa</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{task.id
							? "Edite os detalhes da tarefa"
							: "Adicione uma nova tarefa"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2 bg-zinc-100/30 opacity-0 shadow-xl backdrop-blur-md p-4 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Nova tarefa"
						required
					/>
					<Select
						onValueChange={(value) =>
							setCategory(value as "DIARIAS" | "HABITOS" | "AFAZERES")
						}
						value={category}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Categoria" className="text-zinc-300" />
						</SelectTrigger>
						<SelectContent className="w-[180px]" defaultValue={category}>
							<SelectItem value="HABITOS">Hábitos</SelectItem>
							<SelectItem value="DIARIAS">Diárias</SelectItem>
							<SelectItem value="AFAZERES">Afazeres</SelectItem>
						</SelectContent>
					</Select>

					<Select
						onValueChange={(value) =>
							setPriority(value as "BAIXA" | "MEDIA" | "ALTA")
						}
						value={priority}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Prioridade" />
						</SelectTrigger>
						<SelectContent className="w-[180px]">
							<SelectItem value="BAIXA">
								<FcLowPriority size={24} /> Baixa
							</SelectItem>
							<SelectItem value="MEDIA">
								<FcMediumPriority size={24} /> Média
							</SelectItem>
							<SelectItem value="ALTA">
								<FcHighPriority size={24} /> Alta
							</SelectItem>
						</SelectContent>
					</Select>

					<Button onClick={task.id ? handleUpdateTask : handleAddTask}>
						{task.id ? "Atualizar" : "Adicionar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
