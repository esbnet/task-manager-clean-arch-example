-- CreateTable
CREATE TABLE "public"."daily_subtasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dailyId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_subtasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."daily_subtasks" ADD CONSTRAINT "daily_subtasks_dailyId_fkey" FOREIGN KEY ("dailyId") REFERENCES "public"."dailys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
