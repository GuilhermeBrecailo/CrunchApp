-- Add content, invite and prayer features used by the application.

ALTER TABLE "Crunch" ADD COLUMN IF NOT EXISTS "inviteCode" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Crunch_inviteCode_key" ON "Crunch"("inviteCode");

CREATE TABLE IF NOT EXISTS "DailyVerse" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "commentary" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "crunchId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "DailyVerse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "crunchId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Devotional" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "crunchId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Devotional_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DevotionalChapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "bibleRef" TEXT,
    "order" INTEGER NOT NULL,
    "devotionalId" TEXT NOT NULL,
    CONSTRAINT "DevotionalChapter_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DevotionalProgress" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "devotionalId" TEXT NOT NULL,
    "lastChapterId" TEXT NOT NULL,
    "crunchId" TEXT NOT NULL,
    CONSTRAINT "DevotionalProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PrayerRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "crunchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PrayerRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DevotionalProgress_userId_devotionalId_key" ON "DevotionalProgress"("userId", "devotionalId");
CREATE INDEX IF NOT EXISTS "DailyVerse_crunchId_publishedAt_idx" ON "DailyVerse"("crunchId", "publishedAt");
CREATE INDEX IF NOT EXISTS "Devotional_crunchId_publishedAt_idx" ON "Devotional"("crunchId", "publishedAt");
CREATE INDEX IF NOT EXISTS "PrayerRequest_crunchId_createdAt_idx" ON "PrayerRequest"("crunchId", "createdAt");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DailyVerse_crunchId_fkey') THEN
        ALTER TABLE "DailyVerse" ADD CONSTRAINT "DailyVerse_crunchId_fkey" FOREIGN KEY ("crunchId") REFERENCES "Crunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DailyVerse_authorId_fkey') THEN
        ALTER TABLE "DailyVerse" ADD CONSTRAINT "DailyVerse_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Announcement_crunchId_fkey') THEN
        ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_crunchId_fkey" FOREIGN KEY ("crunchId") REFERENCES "Crunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Announcement_authorId_fkey') THEN
        ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Devotional_crunchId_fkey') THEN
        ALTER TABLE "Devotional" ADD CONSTRAINT "Devotional_crunchId_fkey" FOREIGN KEY ("crunchId") REFERENCES "Crunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Devotional_authorId_fkey') THEN
        ALTER TABLE "Devotional" ADD CONSTRAINT "Devotional_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DevotionalChapter_devotionalId_fkey') THEN
        ALTER TABLE "DevotionalChapter" ADD CONSTRAINT "DevotionalChapter_devotionalId_fkey" FOREIGN KEY ("devotionalId") REFERENCES "Devotional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DevotionalProgress_userId_fkey') THEN
        ALTER TABLE "DevotionalProgress" ADD CONSTRAINT "DevotionalProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DevotionalProgress_devotionalId_fkey') THEN
        ALTER TABLE "DevotionalProgress" ADD CONSTRAINT "DevotionalProgress_devotionalId_fkey" FOREIGN KEY ("devotionalId") REFERENCES "Devotional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DevotionalProgress_lastChapterId_fkey') THEN
        ALTER TABLE "DevotionalProgress" ADD CONSTRAINT "DevotionalProgress_lastChapterId_fkey" FOREIGN KEY ("lastChapterId") REFERENCES "DevotionalChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DevotionalProgress_crunchId_fkey') THEN
        ALTER TABLE "DevotionalProgress" ADD CONSTRAINT "DevotionalProgress_crunchId_fkey" FOREIGN KEY ("crunchId") REFERENCES "Crunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PrayerRequest_crunchId_fkey') THEN
        ALTER TABLE "PrayerRequest" ADD CONSTRAINT "PrayerRequest_crunchId_fkey" FOREIGN KEY ("crunchId") REFERENCES "Crunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PrayerRequest_userId_fkey') THEN
        ALTER TABLE "PrayerRequest" ADD CONSTRAINT "PrayerRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
