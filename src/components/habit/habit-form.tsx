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
import type { Habit, HabitDificult, HabitReset } from "../../types";

import { useHabitContext } from "@/contexts/habit-context";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from ".././ui/button";
import { Input } from ".././ui/input";

interface HabitFormProps {
	habit: Partial<Habit> &
		Pick<Habit, "observations" | "reset" | "tags" | "difficulty" | "title">;
	icon: React.ReactNode;
}

export function HabitForm({ habit, icon }: HabitFormProps) {
	const { updateHabit, addHabit } = useHabitContext();

	const [title, setTitle] = useState(habit.title || "");

	const [dificulty, setDifficulty] = useState<HabitDificult>(
		habit.difficulty || "Fácil",
	);
	const [reset, setReset] = useState<HabitReset>(habit.reset || "Diária");
	const [tags, setTags] = useState<string[]>(habit.tags || []);

	const [open, setOpen] = useState(false);

	async function handleUpdateHabit() {
		if (!title.trim()) return;

		try {
			await updateHabit({
				...habit,
				title,
				observations: habit.observations || "",
				difficulty: dificulty,
				tags,
				reset,
			} as Habit);

			toast.success("Tarefa atualizada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao atualizar tarefa${error}`);
			console.error("Erro ao atualizar tarefa", error);
		}
	}

	async function handleAddHabit() {
		if (!title.trim()) {
			toast.warning("Título da tarefa é obrigatório");
			return;
		}

		try {
			await addHabit({
				title,
				observations: habit.observations || "",
				difficulty: dificulty,
				tags,
				reset,
				createdAt: new Date(),
			});
			setTitle("");
			setDifficulty(dificulty);
			setReset(reset);
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
				<span className="sr-only">Edit habit</span>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-2 bg-transparent backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle>Editar Tarefa</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{habit.id
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
							setDifficulty(value as HabitDificult)
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
						onClick={habit.id ? handleUpdateHabit : handleAddHabit}
					>
						{habit.id ? "Atualizar" : "Adicionar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
