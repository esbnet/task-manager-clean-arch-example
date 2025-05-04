import { FcHighPriority, FcLowPriority, FcMediumPriority } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

type Props = {
	task: {
		id: string;
		title: string;
		completed: boolean;
		createdAt: Date;
		category: "hábitos" | "diárias" | "afazeres";
		priority: "baixa" | "média" | "alta";
	};
	onToggle: () => void;
	onDelete: () => void;
};

export function TaskCard({ task, onToggle, onDelete }: Props) {
	return (
		<div className="flex justify-between items-center gap-2 bg-slate-950/10 p-2 border rounded-lg">
			<div className="flex justify-between items-center gap-2 w-full">
				<div className="flex items-center gap-2">
					<Checkbox checked={task.completed} onCheckedChange={onToggle} />
					<span className={task.completed ? "line-through text-gray-500" : ""}>
						{task.title}
					</span>
				</div>
				<span>
					{task.priority === "baixa" && <FcLowPriority size={24}  title="fazer depois"  />}
					{task.priority === "média" && <FcMediumPriority size={24}  title="fazer"/>}
					{task.priority === "alta" && <FcHighPriority size={24}  title="fazer imediatamente"  className="animate-caret-blink" />}
				</span>
			</div>
			<Button variant="ghost" size="sm" onClick={onDelete}>
				<Trash2 size={16} />
			</Button>
		</div>
	);
}