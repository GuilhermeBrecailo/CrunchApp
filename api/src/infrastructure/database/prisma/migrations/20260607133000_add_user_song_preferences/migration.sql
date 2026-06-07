CREATE TABLE "UserSongPreference" (
    "id" TEXT NOT NULL,
    "personalKey" TEXT,
    "chords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaItemId" TEXT NOT NULL,

    CONSTRAINT "UserSongPreference_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSongPreference_userId_mediaItemId_key" ON "UserSongPreference"("userId", "mediaItemId");

ALTER TABLE "UserSongPreference" ADD CONSTRAINT "UserSongPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserSongPreference" ADD CONSTRAINT "UserSongPreference_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
