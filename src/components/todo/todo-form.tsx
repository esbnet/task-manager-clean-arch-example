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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { format, setDefaultOptions } from "date-fns";
import { CalendarIcon, Plus, SaveIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTodoContext } from "@/contexts/todo-context";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import type { Todo } from "../../types";
import { TodoCard } from "./todo-card";

setDefaultOptions({ locale: ptBR });

interface TodoFormProps {
	todo: Todo;
}

export function TodoForm({ todo }: TodoFormProps) {
	const { updateTodo, addTodo } = useTodoContext();

	const [title, setTitle] = useState(todo.title || "");
	const [observations, setObservations] = useState(todo.observations || "");
	const [tasks, setTodo] = useState<string[]>(todo.tasks || []);
	const [difficulty, setDifficult] = useState<TodoDifficult>(
		todo.difficulty || "Fácil",
	);
	const [startDate, setStartDate] = useState(todo.startDate || new Date());
	const [tags, setTags] = useState<string[]>(todo.tags || []);

	// const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [open, setOpen] = useState(false);

	async function handleUpdateTodo() {
		if (!title.trim()) return;

		try {
			await updateTodo({
				...todo,
				title,
				observations: todo.observations || "",
				tasks: todo.tasks || [],
				difficulty: difficulty,
				startDate: todo.startDate || new Date(),
				tags: todo.tags || [],
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
				tasks: [] as string[],
				difficulty: difficulty,
				startDate: new Date(),
				tags: [] as string[],
			} as Todo);

			setTitle("");
			setDifficult(difficult);
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
				<TodoCard todo={todo} />
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-4 opacity-80 shadow-xl backdrop-blur-sm backdrop-opacity-0">
				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>
						{todo.id ? "Editar " : "Adicionar "} Afazer
					</DialogTitle>

					<DialogDescription className="text-zinc-400 text-sm">
						{todo.id
							? "Altere os detalhes da tarefa"
							: "Adicione uma nova tarefa"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 bg-gray-100/20 p-2 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Título</Label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Nova diária"
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
						<Label className="font-bold">Lista de tarefas</Label>
						<Input
							value={tasks.join(",") || ""}
							onChange={(e) =>
								setTodo(
									e.target.value
										.split(",")
										.map((todo) => todo.trim())
										.filter(Boolean),
								)
							}
							placeholder="Novo item da lista de tarefas"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label className="font-bold">Dificuldade</Label>
						<Select
							onValueChange={(value) =>
								setDifficult(value as TodoDifficult)
							}
							value={difficulty || "Fácil"}
						>
							<SelectTrigger className="w-full">
								<SelectValue
									placeholder="Dificuldade"
									className="text-zinc-300"
								/>
							</SelectTrigger>
							<SelectContent
								className="w-full"
								defaultValue={difficulty || "Fácil"}
							>
								<SelectItem
									value="Trivial"
									className="justify-between"
								>
									Trival ⭐
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
						<Label className="font-bold">Data de início</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									data-empty={!startDate}
									className="justify-start w-full font-normal data-[empty=true]:text-muted-foreground text-left"
								>
									<CalendarIcon />
									{startDate ? (
										format(startDate, "PPP", {
											locale: ptBR,
										})
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-0 w-auto">
								<Calendar
									mode="single"
									required={true}
									selected={startDate}
									onSelect={setStartDate}
								/>
							</PopoverContent>
						</Popover>
					</div>

					<Button
						onClick={todo.id ? handleUpdateTodo : handleAddTodo}
					>
						{todo.id ? <SaveIcon /> : <Plus />}
						{todo.id ? "Salvar" : "Adicionar"}
					</Button>
					<div className="flex justify-right items-center">
						<DialogConfirmDelete id={todo.id} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function DialogConfirmDelete({ id }: { id: string }) {
	const { deleteTodo } = useTodoContext();
	const onDelete = async () => {
		await deleteTodo(id);
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
						Confirmando a exclusão, você não poderá desfazer essa
						ação.
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
