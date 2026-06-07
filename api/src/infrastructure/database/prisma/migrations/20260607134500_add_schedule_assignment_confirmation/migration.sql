ALTER TABLE "ScheduleAssignment" ADD COLUMN "viewedAt" TIMESTAMP(3);
ALTER TABLE "ScheduleAssignment" ADD COLUMN "confirmationStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "ScheduleAssignment" ADD COLUMN "confirmedAt" TIMESTAMP(3);
