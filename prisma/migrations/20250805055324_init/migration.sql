-- CreateTable
CREATE TABLE "public"."habits" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "observations" TEXT NOT NULL DEFAULT '',
    "difficulty" TEXT NOT NULL,
    "tags" TEXT[],
    "reset" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "lastCompletedDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."habit_logs" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "habitTitle" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "tags" TEXT[],
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dailys" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "observations" TEXT NOT NULL DEFAULT '',
    "tasks" TEXT[],
    "difficulty" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "repeatType" TEXT NOT NULL,
    "repeatFrequency" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "lastCompletedDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dailys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_logs" (
    "id" TEXT NOT NULL,
    "dailyId" TEXT NOT NULL,
    "dailyTitle" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "tags" TEXT[],
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."todos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "observations" TEXT NOT NULL DEFAULT '',
    "tasks" TEXT[],
    "difficulty" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "lastCompletedDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."todo_logs" (
    "id" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,
    "todoTitle" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "tags" TEXT[],
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "todo_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."habit_logs" ADD CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "public"."habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_logs" ADD CONSTRAINT "daily_logs_dailyId_fkey" FOREIGN KEY ("dailyId") REFERENCES "public"."dailys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."todo_logs" ADD CONSTRAINT "todo_logs_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "public"."todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
