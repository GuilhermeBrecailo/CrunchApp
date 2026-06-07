ALTER TABLE "Schedule" ADD COLUMN "rehearsalAt" TIMESTAMP(3);
ALTER TABLE "Schedule" ADD COLUMN "rehearsalNotes" TEXT;

ALTER TABLE "ScheduleAssignment" ADD COLUMN "attendanceStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "ScheduleAssignment" ADD COLUMN "attendedAt" TIMESTAMP(3);
