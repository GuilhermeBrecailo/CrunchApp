CREATE TABLE "ScheduleSong" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleId" TEXT NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "ScheduleSong_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ScheduleSong_scheduleId_mediaItemId_key" ON "ScheduleSong"("scheduleId", "mediaItemId");

ALTER TABLE "ScheduleSong" ADD CONSTRAINT "ScheduleSong_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ScheduleSong" ADD CONSTRAINT "ScheduleSong_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
