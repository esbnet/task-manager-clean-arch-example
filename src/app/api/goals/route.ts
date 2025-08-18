import { auth } from "@/auth";
import type { Goal } from "@/domain/entities/goal";
import { PrismaGoalRepository } from "@/infra/repositories/database/prisma-goal-repository";
import { CreateGoalUseCase } from "@/use-cases/goal/create-goal/create-goal-use-case";
import { ListGoalsUseCase } from "@/use-cases/goal/list-goals/list-goals-use-case";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const goalRepository = new PrismaGoalRepository();
const createGoalUseCase = new CreateGoalUseCase(goalRepository);
const listGoalsUseCase = new ListGoalsUseCase(goalRepository);

export async function GET(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Não autorizado" },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status") as Goal["status"] | null;
		const priority = searchParams.get("priority") as
			| Goal["priority"]
			| null;
		const category = searchParams.get("category") as
			| Goal["category"]
			| null;
		const tags = searchParams.get("tags")?.split(",") || [];
		const includeOverdue = searchParams.get("includeOverdue") === "true";
		const includeDueSoon = searchParams.get("includeDueSoon") === "true";
		const dueSoonDays = Number.parseInt(
			searchParams.get("dueSoonDays") || "7",
			10,
		);

		const goals = await listGoalsUseCase.execute({
			userId: session.user.id,
			status: status ?? undefined,
			priority: priority ?? undefined,
			category: category ?? undefined,
			tags,
			includeOverdue,
			includeDueSoon,
			dueSoonDays,
		});

		return NextResponse.json(goals);
	} catch (error) {
		console.error("Erro ao listar metas:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Não autorizado" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { title, description, targetDate, priority, category, tags } =
			body;

		if (!title || !targetDate) {
			return NextResponse.json(
				{ error: "Título e data são obrigatórios" },
				{ status: 400 },
			);
		}

		const goal = await createGoalUseCase.execute({
			title,
			description: description || "",
			targetDate: new Date(targetDate),
			priority: priority || "MEDIUM",
			category: category || "PERSONAL",
			tags: tags || [],
			userId: session.user.id,
		});

		return NextResponse.json(goal, { status: 201 });
	} catch (error) {
		console.error("Erro ao criar meta:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
