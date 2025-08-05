import { Checkbox } from "@/components/ui/checkbox";
import { useHabitContext } from "@/contexts/habit-context";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Habit } from "../../types";

type Props = {
	habit: Habit;
	dragHandleProps?: any;
	onEditClick?: () => void;
};

export function HabitCard({ habit, dragHandleProps, onEditClick }: Props) {
	return <HabitItem habit={habit} dragHandleProps={dragHandleProps} onEditClick={onEditClick} />;
}

function HabitItem({ habit, dragHandleProps, onEditClick }: Props) {
	const { completeHabit } = useHabitContext();

	const onComplete = async (checked: boolean) => {
		if (checked) {
			await completeHabit(habit);
			toast.success(`Hábito "${habit.title}" concluído!`);
		}
	};

	return (
		<div className="flex justify-between items-center gap-2 bg-background/30 shadow-sm hover:shadow-md p-1 rounded-sm transition-all duration-200 ease-in-out">
			<div
				className="hover:bg-background/10 px-1 py-2 rounded-sm cursor-grab"
				{...dragHandleProps}
				title="Arraste para mover a tarefa"
			>
				<GripVertical size={16} className="text-foreground" />
			</div>
			<div className="flex justify-between items-center gap-1 w-full">
				<div className="flex items-center gap-2">
					<Checkbox
						onCheckedChange={onComplete}
						className="hover:bg-foreground/10 border-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0 w-5 h-5 focus-visible:bg-accent-foreground hover:cursor-pointer"
						onClick={(e) => e.stopPropagation()}
					/>
					<span 
						className="text-foreground/60 text-justify cursor-pointer hover:text-foreground/80"
						onClick={onEditClick}
					>
						{habit.title}
					</span>
				</div>
			</div>
		</div>
	);
}
