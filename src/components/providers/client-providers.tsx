"use client"

import { DailyColumn } from "@/components/daily/daily-column";
import { HabitColumn } from "@/components/habit/habit-column";
import { TodoColumn } from "@/components/todo/todo-column";
import { DailyProvider } from "@/contexts/daily-context";
import { DailySubtaskProvider } from "@/contexts/daily-subtask-context";
import { HabitProvider } from "@/contexts/habit-context";
import { TagsProvider } from "@/contexts/tags-context";
import { TodoProvider } from "@/contexts/todo-context";
import { TodoSubtaskProvider } from "@/contexts/todo-subtask-context";

export function ClientProviders() {
  return (
    <TagsProvider>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3 h-full">
        <HabitProvider>
          <HabitColumn />
        </HabitProvider>
        <DailyProvider>
          <DailySubtaskProvider>
            <DailyColumn />
          </DailySubtaskProvider>
        </DailyProvider>
        <TodoProvider>
          <TodoSubtaskProvider>
            <TodoColumn />
          </TodoSubtaskProvider>
        </TodoProvider>
      </div>
    </TagsProvider>
  )
}