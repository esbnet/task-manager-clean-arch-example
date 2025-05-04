import app from "next/app";
import request from "supertest";

// Este exemplo pressupõe que você tenha exportado o handler diretamente
// Se não, talvez precise usar um servidor fake ou recriar a rota isolada
describe("API Route: /api/tasks", () => {
	it("GET /api/tasks deve retornar status 200", async () => {
		const res = await request(app).get("/api/tasks");
		expect(res.statusCode).toBe(200);
	});

	it("POST /api/tasks deve criar uma nova tarefa", async () => {
		const res = await request(app)
			.post("/api/tasks")
			.send({ title: "Nova Tarefa" });

		expect(res.statusCode).toBe(201);
		expect(res.body.task.title).toBe("Nova Tarefa");
	});

	it("PATCH /api/tasks deve marcar como concluída", async () => {
		// Cria primeiro
		const createRes = await request(app)
			.post("/api/tasks")
			.send({ title: "Para concluir" });

		const taskId = createRes.body.task.id;

		const patchRes = await request(app)
			.patch("/api/tasks")
			.send({ id: taskId });

		expect(patchRes.statusCode).toBe(204);
	});

	it("DELETE /api/tasks deve excluir uma tarefa", async () => {
		const createRes = await request(app)
			.post("/api/tasks")
			.send({ title: "Para deletar" });

		const taskId = createRes.body.task.id;

		const deleteRes = await request(app)
			.delete("/api/tasks")
			.send({ id: taskId });

		expect(deleteRes.statusCode).toBe(204);
	});
});
