import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { TodoSubtask } from "@/types";
import { toast } from "sonner";

interface TodoSubtaskListProps {
	todoId: string;
}

export function TodoSubtaskList({ todoId }: TodoSubtaskListProps) {
	const [subtasks, setSubtasks] = useState<TodoSubtask[]>([]);
	const [newTaskTitle, setNewTaskTitle] = useState("");

	useEffect(() => {
		fetchSubtasks();
	}, [todoId]);

	const fetchSubtasks = async () => {
		try {
			const response = await fetch(`/api/todo-subtasks?todoId=${todoId}`);
			if (!response.ok) {
				console.error('Failed to fetch subtasks:', response.status);
				return;
			}
			const text = await response.text();
			if (!text) {
				setSubtasks([]);
				return;
			}
			const data = JSON.parse(text);
			setSubtasks(data.subtasks || []);
		} catch (error) {
			console.error('Error fetching subtasks:', error);
			setSubtasks([]);
		}
	};

	const addSubtask = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!newTaskTitle.trim()) return;

		try {
			const response = await fetch("/api/todo-subtasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: newTaskTitle,
					todoId,
					order: subtasks.length
				})
			});

			if (!response.ok) {
				toast.error('Erro ao criar tarefa');
				return;
			}

			const data = await response.json();
			setSubtasks([...subtasks, data.subtask]);
			setNewTaskTitle("");
		} catch (error) {
			console.error('Error adding subtask:', error);
			toast.error('Erro ao criar tarefa');
		}
	};

	const toggleSubtask = async (subtask: TodoSubtask) => {
		const updated = { ...subtask, completed: !subtask.completed };

		await fetch("/api/todo-subtasks", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ subtask: updated })
		});

		setSubtasks(subtasks.map(s => s.id === subtask.id ? updated : s));
	};

	const deleteSubtask = async (id: string, title: string) => {
		await fetch("/api/todo-subtasks", {
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