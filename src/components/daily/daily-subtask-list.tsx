import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { DailySubtask } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SubtaskListProps {
	dailyId: string;
}

export function DailySubtaskList({ dailyId }: SubtaskListProps) {
	const [subtasks, setSubtasks] = useState<DailySubtask[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState("");

	useEffect(() => {
		fetchSubtasks();
	}, [dailyId]);

	const fetchSubtasks = async () => {
		const response = await fetch(`/api/daily-subtasks?dailyId=${dailyId}`);
		const data = await response.json();
		setSubtasks(data.subtasks || []);
	};

	const addSubtask = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!newTaskTitle.trim()) return;

		const response = await fetch("/api/daily-subtasks", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: newTaskTitle,
				dailyId,
				order: subtasks.length
			})
		});

		const data = await response.json();
		setSubtasks([...subtasks, data.subtask]);
		setNewTaskTitle("");
	};

	const toggleSubtask = async (subtask: DailySubtask) => {
		const updated = { ...subtask, completed: !subtask.completed };

		await fetch("/api/daily-subtasks", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ subtask: updated })
		});

		setSubtasks(subtasks.map(s => s.id === subtask.id ? updated : s));
	};

	const deleteSubtask = async (id: string, title: string) => {
		await fetch("/api/daily-subtasks", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		});

		setSubtasks(subtasks.filter(s => s.id !== id));
		toast.success(`Tarefa "${title}" removida com sucesso!`);
	};



	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Input
					value={newTaskTitle}
					onChange={(e) => setNewTaskTitle(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && addSubtask(e)}
					placeholder="Nova tarefa..."
					className="flex-1"
				/>
				<Button onClick={(e) => addSubtask(e)} size="sm" type="button">
					<Plus size={16} />
				</Button>
			</div>

			<div className="flex flex-col gap-0.5 max-h-32 overflow-y-auto">
				{subtasks.map((subtask) => (
					<div key={subtask.id} className="flex items-center gap-2 bg-background/20 rounded">
						<Checkbox
							checked={subtask.completed}
							onCheckedChange={() => toggleSubtask(subtask)}
						/>
						<span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
							{subtask.title}
						</span>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								deleteSubtask(subtask.id, subtask.title);
							}}
							size="sm"
							variant="ghost"
							type="button"
							className="p-0 w-6 h-6 text-destructive"
						>
							<Trash2 size={12} />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}