import { InJsonFileTaskRepository } from "@/infra/repositories/frontend/json-file-task-repository";
import { ListTasksUseCase } from "@/use-cases/task/list-tasks/list-task-use-case";

describe("Use Case: ListTasksUseCase", () => {
	it("deve retornar uma lista de tarefas", async () => {
		const repo = new InJsonFileTaskRepository();
		const useCase = new ListTasksUseCase(repo);

		const result = await useCase.execute();

		expect(result.tasks[0].title).toBe("Ler notícias");
		expect(result.tasks.length).toBeGreaterThan(0);
	});
});
