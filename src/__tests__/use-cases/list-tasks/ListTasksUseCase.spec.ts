import { InJsonFileTodoRepository } from "@/infra/repositories/frontend/json-file-todo-repository";
import { ListTodosUseCase } from "@/use-cases/todo/list-todo/list-todo-use-case";

describe("Use Case: ListTodosUseCase", () => {
	it("deve retornar uma lista de tarefas", async () => {
		const repo = new InJsonFileTodoRepository();
		const useCase = new ListTodosUseCase(repo);

		const result = await useCase.execute();

		expect(result.todos[0].title).toBe("Tarefa 1");
		expect(result.todos.length).toBeGreaterThan(0);
	});
});
