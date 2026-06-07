CREATE TABLE "ScheduleMediaItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduleId" TEXT NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "ScheduleMediaItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ScheduleMediaItem_scheduleId_mediaItemId_key" ON "ScheduleMediaItem"("scheduleId", "mediaItemId");

ALTER TABLE "ScheduleMediaItem" ADD CONSTRAINT "ScheduleMediaItem_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ScheduleMediaItem" ADD CONSTRAINT "ScheduleMediaItem_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
