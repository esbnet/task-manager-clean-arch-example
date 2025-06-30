import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { Plus, SaveIcon, Trash2 } from "lucide-react";
import type { Habit, HabitReset } from "../../types";

import { useHabitContext } from "@/contexts/habit-context";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from ".././ui/button";
import { Input } from ".././ui/input";
import { tagsNew } from "../daily/daily-form";
import { Label } from "../ui/label";
import { MultiSelect } from "../ui/multi-select";
import { HabitCard } from "./habit-card";

interface HabitFormProps {
	habit: Habit;
}

export function HabitForm({ habit }: HabitFormProps) {
	const { updateHabit, addHabit } = useHabitContext();

	const [title, setTitle] = useState(habit.title || "");
	const [observations, setObservations] = useState(habit.observations || "");
	const [difficulty, setDifficult] = useState<HabitDifficult>(
		habit.difficulty || "Fácil",
	);
	const [tags, setTags] = useState<string[]>(habit.tags || []);
	const [reset, setReset] = useState<HabitReset>(
		habit.reset || "Diariamente",
	);

	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [open, setOpen] = useState(false);

	async function handleUpdateHabit() {
		if (!title.trim()) return;

		try {
			await updateHabit({
				...habit,
				title,
				observations: habit.observations || "",
				difficulty: difficulty,
				tags,
				reset,
			} as Habit);

			toast.success("Hábito atualizado com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao atualizar hábito${error}`);
			console.error("Erro ao atualizar hábito", error);
		}
	}

	async function handleAddHabit() {
		if (!title.trim()) {
			toast.warning("Título do hábito é obrigatório");
			return;
		}

		try {
			await addHabit({
				title,
				observations: habit.observations || "",
				difficulty: difficulty,
				tags,
				reset,
				createdAt: new Date(),
			});
			setTitle("");
			setDifficult(difficult);
			setReset(reset);
			setTags(tags);
			toast.success("Hábito criado com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao criar hábito ${error}`);
			console.error("Erro ao criar hábito", error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="outline-none">
				<HabitCard habit={habit} />
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-4 opacity-80 shadow-xl backdrop-blur-sm backdrop-opacity-0">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle className="font-bold text-foreground text-2xl">
						{habit.id ? "Editar" : "Adicionar"} Hábito
					</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{habit.id
							? "Edite os detalhes do hábito"
							: "Adicione um novo hábito"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 bg-gray-100/20 p-2 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Título</Label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Nova hábito"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Observação</Label>
						<Input
							value={observations}
							onChange={(e) => setObservations(e.target.value)}
							placeholder="Adicionar observações"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<Label className="font-bold">Dificuldade</Label>
						<Select
							onValueChange={(value) =>
								setDifficult(value as HabitDifficult)
							}
							value={difficult}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue
									placeholder="Dificuldade"
									className="text-zinc-300"
								/>
							</SelectTrigger>
							<SelectContent
								className="w-[180px]"
								defaultValue={difficult}
							>
								<SelectItem value="Trivial">Trival</SelectItem>
								<SelectItem value="Fácil">Fácil</SelectItem>
								<SelectItem value="Média">Média</SelectItem>
								<SelectItem value="Difícil">Difícil</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1">
						<Label className="font-bold">Etiquetas</Label>
						<MultiSelect
							options={tagsNew}
							onValueChange={setSelectedTags}
							defaultValue={selectedTags}
							placeholder="Adicionar etiquetas"
							variant="inverted"
							maxCount={3}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<Label className="font-bold">Resetar Contador</Label>
						<Select
							onValueChange={(value) =>
								setReset(value as HabitReset)
							}
							value={difficult}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue
									placeholder="Dificuldade"
									className="text-zinc-300"
								/>
							</SelectTrigger>
							<SelectContent
								className="w-[180px]"
								defaultValue={reset}
							>
								<SelectItem value="Trivial">
									Diariamente
								</SelectItem>
								<SelectItem value="Fácil">
									Semanalmente
								</SelectItem>
								<SelectItem value="Média">
									Mensalmente
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button
						onClick={habit.id ? handleUpdateHabit : handleAddHabit}
					>
						{habit.id ? <SaveIcon /> : <Plus />}
						{habit.id ? "Salvar" : "Adicionar"}
					</Button>
					<div className="flex justify-right items-center">
						<DialogConfirmDelete id={habit.id} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function DialogConfirmDelete({ id }: { id: string }) {
	const { deleteHabit } = useHabitContext();
	const onDelete = async () => {
		await deleteHabit(id);
		toast.success("Tarefa excluída com sucesso!");
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex justify-center items-center mt-4 w-full">
					<Button
						variant="link"
						// size="sm"
						className="flex justify-center items-center hover:bg-background/20 rounded-lg text-destructive cursor-pointer"
					>
						<Trash2 size={16} /> Delete esta tarefa
					</Button>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Você tem certeza?</DialogTitle>
					<DialogDescription>
						Ao confirmar, essa tarefa será excluída permanentemente.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="submit"
						variant={"destructive"}
						onClick={onDelete}
					>
						Excluir
					</Button>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
