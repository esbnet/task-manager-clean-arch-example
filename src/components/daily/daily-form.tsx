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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Daily, DailyDifficult, DailyRepeat } from "@/types";
import { format, setDefaultOptions } from "date-fns";
import { Calendar as CalendarIcon, Plus, SaveIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useDailyContext } from "@/contexts/daily-context";
import type { DailyRepeatType } from "@/types/daily";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { DailyCard } from "./daily-card";

setDefaultOptions({ locale: ptBR });

interface DailyFormProps {
	daily: Daily;
}

export function DailyForm({ daily }: DailyFormProps) {
	const { updateDaily, addDaily } = useDailyContext();
	const [title, setTitle] = useState(daily.title || "");
	const [observations, setObservations] = useState(daily.observations || "");
	const [tasks, setTasks] = useState<string[]>(daily.tasks || []);
	const [dificulty, setDifficulty] = useState<DailyDifficult>(
		daily.difficulty || "Fácil",
	);
	const [startDate, setStartDate] = useState<Date>(
		daily.startDate || new Date(),
	);
	const [repeatType, setRepeatType] = useState<DailyRepeatType>(
		daily.repeat.type || "Semanalmente",
	);
	const [repeatFrequency, setRepeatFrequency] = useState<number>(
		daily.repeat.frequency || 1,
	);
	const [tags, setTags] = useState<string[]>(daily.tags || []);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const [open, setOpen] = useState(false);

	async function handleUpdateDaily() {
		if (!title.trim()) return;

		try {
			await updateDaily({
				...daily,
				title,
				observations: daily.observations || "",
				difficulty: dificulty,
				tags: daily.tags || [],
			} as Daily);

			toast.success("Hábito atualizado com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao atualizar hábito${error}`);
			console.error("Erro ao atualizar hábito", error);
		}
	}

	async function handleAddDaily() {
		if (!title.trim()) {
			toast.warning("Título da diária diária é obrigatório");
			return;
		}

		try {
			await addDaily({
				title,
				observations: daily.observations || "",
				tasks: [] as string[],
				difficulty: dificulty,
				repeat: {
					type: repeatType as DailyRepeatType,
					frequency: repeatFrequency,
				} as DailyRepeat,
				tags,
			} as Daily);

			setTitle("");
			setDifficulty(dificulty);
			setTags(tags);
			toast.success("Hábito diário criada com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error(`Erro ao criar hábito diário ${error}`);
			console.error("Erro ao criar hábito diário", error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="outline-none">
				<DailyCard daily={daily} />
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-4 opacity-80 shadow-xl backdrop-blur-sm backdrop-opacity-0">

				<DialogHeader className="flex flex-col gap-1">
					<DialogTitle>
						{daily.id ? "Editar " : "Adicionar "} Diária
					</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{daily.id
							? "Edite os detalhes da diária"
							: "Adicione uma nova diária"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 bg-gray-100/20 p-2 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
					<div className="flex flex-col gap-1">
						<Label>Título</Label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Nova diária"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">

						<Label>Observação</Label>
						<Input
							value={observations}
							onChange={(e) => setObservations(e.target.value)}
							placeholder="Adicionar observações"
						/>

					</div>
					<div className="flex flex-col gap-1">
						<Label>Lista de tarefas</Label>
						<Input
							value={tasks.join(",") || ""}
							onChange={(e) =>
								setTasks(
									e.target.value
										.split(",")
										.map((task) => task.trim())
										.filter(Boolean),
								)
							}
							placeholder="Novo item da lista de tarefas"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Dificuldade</Label>
						<Select
							onValueChange={(value) =>
								setDifficulty(value as DailyDifficult)
							}
							value={dificulty || "Fácil"}
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

					</div>
					<div className="flex flex-col gap-1">
						<Label>Data de início</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									data-empty={!startDate}
									className="justify-start w-[280px] font-normal data-[empty=true]:text-muted-foreground text-left"
								>
									<CalendarIcon />
									{startDate ? (
										format(startDate, "PPP", { locale: ptBR })
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
					<div className="flex flex-col gap-1">
						<Label>Repetição</Label>
						<Select
							onValueChange={(value) =>
								setRepeatType(value as DailyRepeatType)
							}
							value={repeatType || "Semanalmente"}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue
									placeholder="Repetição"
									className="text-zinc-300"
								/>
							</SelectTrigger>
							<SelectContent
								className="w-[180px]"
								defaultValue={repeatType}
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
								<SelectItem value="Anualmente">
									Anualmente
								</SelectItem>
							</SelectContent>
						</Select>

					</div>
					<div className="flex flex-col gap-1">
						<Label>A cada</Label>
						<div className="flex items-center gap-2">
							<Input
								type="number"
								value={repeatFrequency || 1}
								onChange={(e) =>
									setRepeatFrequency(
										e.target.value
											? Number.parseInt(e.target.value)
											: 1,
									)
								}
								placeholder="Quantidade de vezes"
								required
							/>
							<span>
								{repeatType === "Diariamente"
									? "Dia"
									: repeatType === "Semanalmente"
										? "Semana"
										: repeatType === "Mensalmente"
											? "Mês"
											: repeatType === "Anualmente"
												? "Ano"
												: ""}
							</span>
						</div>

					</div>
					<div className="flex flex-col gap-1">
						<Label>Etiquetas</Label>
						<MultiSelect
							options={tagsNew}
							onValueChange={setSelectedTags}
							defaultValue={selectedTags}
							placeholder="Adicionar etiquetas"
							variant="inverted"
							animation={2}
							maxCount={3}
						/>
					</div>

					<Button
						onClick={daily.id ? handleUpdateDaily : handleAddDaily}
					>
						{daily.id ? <SaveIcon /> : <Plus />}
						{daily.id ? "Salvar" : "Adicionar"}
					</Button>
					<div className="flex justify-right items-center">
						<DialogConfirmDelete id={daily.id} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function DialogConfirmDelete({ id }: { id: string }) {
	const { deleteDaily } = useDailyContext();
	const onDelete = async () => {
		await deleteDaily(id);
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

export const tagsNew = [
	{ value: "Trabalho", label: "Trabalho" },
	{ value: "Exercício", label: "Exercício" },
	{ value: "Saúde e bem-estar", label: "Saúde e bem-estar" },
	{ value: "Escola", label: "Escola" },
	{ value: "Times", label: "Times" },
];
