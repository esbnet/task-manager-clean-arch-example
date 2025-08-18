import type { Goal } from "../entities/goal";
import type { GenericRepository } from "./generic-repository";

export interface GoalRepository extends GenericRepository<Goal> {
	findByUserId(userId: string): Promise<Goal[]>;
	findByStatus(userId: string, status: Goal["status"]): Promise<Goal[]>;
	findByPriority(userId: string, priority: Goal["priority"]): Promise<Goal[]>;
	findByCategory(userId: string, category: Goal["category"]): Promise<Goal[]>;
	findByTags(userId: string, tags: string[]): Promise<Goal[]>;
	findOverdue(userId: string): Promise<Goal[]>;
	findDueSoon(userId: string, days: number): Promise<Goal[]>;
}
