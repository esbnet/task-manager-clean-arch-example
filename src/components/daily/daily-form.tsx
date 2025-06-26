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
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Daily, DailyDificult, DailyRepeat } from "@/types";
import { format, setDefaultOptions } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { MultiSelect } from "@/components/ui/multi-select";
import { useDailyContext } from "@/contexts/daily-context";
import type { DailyRepeatType } from "@/types/daily";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

setDefaultOptions({ locale: ptBR });

interface DailyFormProps {
	daily: Daily;
	icon: React.ReactNode;
}

export function DailyForm({ daily, icon }: DailyFormProps) {
	const { updateDaily, addDaily } = useDailyContext();
	const [title, setTitle] = useState(daily.title || "");
	const [observations, setObservations] = useState(daily.observations || "");
	const [tasks, setTasks] = useState<string[]>(daily.tasks || []);
	const [dificulty, setDifficulty] = useState<DailyDificult>(
		daily.difficulty || "Fácil",
	);
	const [startDate, setStartDate] = useState<Date>(daily.startDate || new Date());
	const [repeatType, setRepeatType] = useState<DailyRepeatType>(daily.repeat.type ||
		"Semanalmente");
	const [repeatFrequency, setRepeatFrequency] = useState<number>(daily.repeat.frequency || 1);
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
				tags,
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
				{icon}
				<span className="sr-only">Editar diária</span>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-2 bg-transparent backdrop-blur-sm">
				<DialogHeader>
					<DialogTitle>
						{daily.id
							? "Editar Diária"
							: "Adicionar Diária"}
					</DialogTitle>
					<DialogDescription className="text-zinc-400 text-sm">
						{daily.id
							? "Edite os detalhes da diária"
							: "Adicione uma nova diária"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2 bg-zinc-100/30 opacity-0 shadow-xl backdrop-blur-md p-4 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
					<Label>Título</Label>
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Nova diária"
						required
					/>
					<Label>Observação</Label>
					<Input
						value={observations}
						onChange={(e) => setObservations(e.target.value)}
						placeholder="Adicionar observações"
					/>

					<Label>Lista de tarefas</Label>
					<Input
						value={tasks.join(",") || ""}
						onChange={(e) => setTasks(e.target.value.split(",").map(task => task.trim()).filter(Boolean))}
						placeholder="Novo item da lista de tarefas"
						required
					/>
					<Label>Dificuldade</Label>
					<Select
						onValueChange={(value) =>
							setDifficulty(value as DailyDificult)
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

					<Label>Data de início</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								data-empty={!startDate}
								className="justify-start w-[280px] font-normal data-[empty=true]:text-muted-foreground text-left"
							>
								<CalendarIcon />
								{startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Pick a date</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0 w-auto">
							<Calendar mode="single" required={true} selected={startDate} onSelect={setStartDate} />
						</PopoverContent>
					</Popover>

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
							<SelectItem value="Diariamente">Diariamente</SelectItem>
							<SelectItem value="Semanalmente">Semanalmente</SelectItem>
							<SelectItem value="Mensalmente">Mensalmente</SelectItem>
							<SelectItem value="Anualmente">Anualmente</SelectItem>
						</SelectContent>
					</Select>

					<Label>A cada</Label>
					<div className="flex items-center gap-2">
						<Input
							type="number"
							value={repeatFrequency || 1}
							onChange={(e) => setRepeatFrequency(e.target.value ? Number.parseInt(e.target.value) : 1)}
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

					<Button
						onClick={daily.id ? handleUpdateDaily : handleAddDaily}
					>
						{daily.id ? "Atualizar" : "Adicionar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export const tagsNew =
	[
		{ value: "Trabalho", label: "Trabalho" },
		{ value: "Exercício", label: "Exercício" },
		{ value: "Saúde e bem-estar", label: "Saúde e bem-estar" },
		{ value: "Escola", label: "Escola" },
		{ value: "Times", label: "Times" }
	];