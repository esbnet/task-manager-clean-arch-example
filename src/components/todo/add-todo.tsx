'use client';

import { useTodoContext } from "@/contexts/todo-context";
import type { Todo } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

export default function AddTodo() {
	const [todo, setTodo] = useState<Omit<Todo, "id" | "createdAt">>({
		title: "",
		observations: "",
		tasks: [],
		difficulty: "Fácil",
		startDate: new Date(),
		tags: [],
	});

	const [title, setTitle] = useState("");
	const { addTodo } = useTodoContext();

	function handleAddTodo(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!title.trim()) {
			toast.warning("Título do hábito é obrigatório");
			return;
		}

		// Criar o objeto com os dados atualizados
		const newTodo = {
			title,
			observations: todo.observations || "",
			tasks: todo.tasks || [],
			difficulty: todo.difficulty || "Fácil",
			startDate: todo.startDate || new Date(),
			tags: todo.tags || [],
		};

		// Usar o objeto criado diretamente
		addTodo(newTodo);

		toast.success("Afazer adicionado com sucesso!");

		// Atualizar o estado e limpar o formulário
		setTodo({
			title: "",
			observations: "",
			tasks: [],
			difficulty: "Fácil",
			startDate: new Date(),
			tags: [],
		});
		setTitle("");
	}

	return (
		<form onSubmit={handleAddTodo}>
			<Input
				id="title"
				placeholder="Adicionar Afazeres"
				onChange={(e) => setTitle(e.target.value)}
				value={title}
			/>
		</form>
	);
}
