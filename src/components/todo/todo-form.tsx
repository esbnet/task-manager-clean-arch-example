import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	FcHighPriority,
	FcLowPriority,
	FcMediumPriority,
} from "react-icons/fc";
import type { Todo, TodoDificult } from "../../types";

import { useTodoContext } from "@/contexts/todo-context";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TodoFormProps {
	todo: Partial<Todo> &
		Pick<Todo, "observations" | "tags" | "difficulty" | "title">;
	icon: React.ReactNode;
}

export function TodoForm({ todo, icon }: TodoFormProps) {
	const { updateTodo, addTodo } = useTodoContext();

	const [title, setTitle] = useState(todo.title || "");

	const [dificulty, setDifficulty] = useState<TodoDificult>(
		todo.difficulty || "Fácil",
	);
	const [tags, setTags] = useState<string[]>(todo.tags || []);

	const [open, setOpen] = useState(false);

	async function handleUpdateTodo() {
		if (!title.trim()) return;

		try {
			await updateTodo({
				...todo,
				title,
				observations: todo.observations || "",
				difficulty: dificulty,
				tags,
			} as Todo);

			toast.success("Tarefa atualizada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao atualizar tarefa${error}`);
			console.error("Erro ao atualizar tarefa", error);
		}
	}

	async function handleAddTodo() {
		if (!title.trim()) {
			toast.warning("Título da tarefa é obrigatório");
			return;
		}

		try {
			await addTodo({
				title,
				observations: todo.observations || "",
				difficulty: dificulty,
				tags,
				startDate: new Date(),
				tasks: [] as string[],
				createdAt: new Date(),
			} as Todo);

			setTitle("");
			setDifficulty(dificulty);
			setTags(tags);
			toast.success("Hábito criada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao criar hábito ${error}`);
			console.error("Erro ao criar hábito", error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="outline-none">
				{icon}
				<span className="sr-only">Edit todo</span>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-2 bg-transparent backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle>Editar Tarefa</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{todo.id
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
							setDifficulty(value as TodoDificult)
						}
						value={dificulty}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue
								placeholder="Dificuldade"
								className="text-zinc-300"
							/>
						</SelectTrigger>
						<SelectContent
							className="w-[180px]"
							defaultValue={dificulty}
						>
							<SelectItem value="Trivial">Trival</SelectItem>
							<SelectItem value="Fácil">Fácil</SelectItem>
							<SelectItem value="Média">Média</SelectItem>
							<SelectItem value="Difícil">Difícil</SelectItem>
						</SelectContent>
					</Select>

					<Select
						onValueChange={(value) => setTags(value.split(","))}
						value={tags.join(",") || ""}
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

					<Button
						onClick={todo.id ? handleUpdateTodo : handleAddTodo}
					>
						{todo.id ? "Atualizar" : "Adicionar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
