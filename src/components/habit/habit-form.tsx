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
import { SaveIcon, Trash2 } from "lucide-react";
import type { Habit, HabitReset } from "../../types";

import { useHabitContext } from "@/contexts/habit-context";
import { useTags } from "@/hooks/use-tags";
import type { HabitDifficulty } from "@/types/habit";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from ".././ui/button";
import { Input } from ".././ui/input";
import { Label } from "../ui/label";
import { MultiSelect } from "../ui/multi-select";
import { HabitCard } from "./habit-card";

interface HabitFormProps {
	habit: Habit;
	dragHandleProps?: any;
}

export function HabitForm({ habit, dragHandleProps }: HabitFormProps) {
	const { updateHabit } = useHabitContext();
	const { tagOptions } = useTags();

	const [title, setTitle] = useState(habit.title || "");
	const [observations, setObservations] = useState(habit.observations || "");
	const [difficulty, setDifficult] = useState<HabitDifficulty>(
		habit.difficulty || "Fácil",
	);
	const [tags, setTags] = useState<string[]>(habit.tags || ([] as string[]));
	const [reset, setReset] = useState<HabitReset>(
		habit.reset || "Diariamente",
	);

	// const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [open, setOpen] = useState(false);

	async function handleUpdateHabit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!title.trim()) return;

		try {
			await updateHabit({
				...habit,
				title,
				observations: habit.observations || "",
				difficulty: difficulty,
				tags: tags,
				reset: reset,
			} as Habit);

			toast.success("Hábito atualizado com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao atualizar hábito${error}`);
			console.error("Erro ao atualizar hábito", error);
		}
	}

	return (
		<>
			<HabitCard
				habit={habit}
				dragHandleProps={dragHandleProps}
				onEditClick={() => setOpen(true)}
			/>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="flex flex-col gap-4 opacity-90 shadow-xl backdrop-blur-sm backdrop-opacity-0">
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

					<form
						onSubmit={handleUpdateHabit}
						className="flex flex-col gap-4 bg-gray-100/20 p-2 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]"
					>
						<div className="flex flex-col gap-1">
							<Label className="font-bold" htmlFor="title">
								Título
							</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Nova hábito"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label className="font-bold" htmlFor="observations">
								Observação
							</Label>
							<Input
								id="observations"
								value={observations}
								onChange={(e) =>
									setObservations(e.target.value)
								}
								placeholder="Adicionar observações"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label className="font-bold" htmlFor="difficulty">
								Dificuldade
							</Label>
							<Select
								onValueChange={(value) =>
									setDifficult(value as HabitDifficulty)
								}
								value={difficulty}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder="Dificuldade"
										className="text-zinc-300"
									/>
								</SelectTrigger>
								<SelectContent
									id="difficulty"
									className="w-full"
									defaultValue={difficulty}
								>
									<SelectItem value="Trivial">
										Trivial ⭐
									</SelectItem>
									<SelectItem value="Fácil">
										Fácil ⭐⭐
									</SelectItem>
									<SelectItem value="Média">
										Média ⭐⭐⭐
									</SelectItem>
									<SelectItem value="Difícil">
										Difícil ⭐⭐⭐⭐
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-1">
							<Label className="font-bold" htmlFor="tags">
								Etiquetas
							</Label>
							<MultiSelect
								id="tags"
								options={tagOptions}
								onValueChange={(value) => setTags(value)}
								defaultValue={tags}
								placeholder="Adicionar etiquetas"
								variant="inverted"
								maxCount={3}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label className="font-bold" htmlFor="reset">
								Resetar Contador
							</Label>
							<Select
								onValueChange={(value) =>
									setReset(value as HabitReset)
								}
								value={reset}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder="Dificuldade"
										className="text-zinc-300"
									/>
								</SelectTrigger>
								<SelectContent
									id="reset"
									className="w-full"
									defaultValue={reset}
								>
									<SelectItem value="Diariamente">
										Diariamente
									</SelectItem>
									<SelectItem value="Semanalmente">
										Semanalmente
									</SelectItem>
									<SelectItem value="Mensalmente">
										Mensalmente
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex gap-1 mt-2">
							<DialogClose asChild>
								<Button variant="link">Cancel</Button>
							</DialogClose>
							<Button type="submit" className="flex-1">
								<SaveIcon />
								Salvar
							</Button>
						</div>
					</form>
					<div className="flex justify-right items-center">
						<DialogConfirmDelete id={habit.id} />
					</div>
				</DialogContent>
			</Dialog>
		</>
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
				<div className="flex justify-center items-center mt-2 w-full">
					<Button
						variant="link"
						className="flex justify-center items-center hover:bg-background/20 rounded-lg text-destructive cursor-pointer"
					>
						<Trash2 /> Delete esta tarefa
					</Button>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-destructive">
						Você tem certeza?
					</DialogTitle>
					<DialogDescription className="text-destructive">
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
