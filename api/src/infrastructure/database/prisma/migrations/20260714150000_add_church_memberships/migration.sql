-- CreateTable
CREATE TABLE "ChurchMembership" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "canManageMembers" BOOLEAN NOT NULL DEFAULT false,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "crunchId" TEXT NOT NULL,
    "churchRoleId" TEXT,

    CONSTRAINT "ChurchMembership_pkey" PRIMARY KEY ("id")
);

-- Backfill memberships from the legacy single-church columns.
INSERT INTO "ChurchMembership" (
    "id",
    "role",
    "canManageMembers",
    "isPrimary",
    "isActive",
    "createdAt",
    "updatedAt",
    "userId",
    "crunchId",
    "churchRoleId"
)
SELECT
    md5("id" || ':' || "crunchId"),
    COALESCE("role", 'MEMBER'),
    COALESCE("canManageMembers", false),
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    "id",
    "crunchId",
    "churchRoleId"
FROM "User"
WHERE "crunchId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- CreateIndex
CREATE UNIQUE INDEX "ChurchMembership_userId_crunchId_key" ON "ChurchMembership"("userId", "crunchId");
CREATE INDEX "ChurchMembership_crunchId_idx" ON "ChurchMembership"("crunchId");
CREATE INDEX "ChurchMembership_userId_idx" ON "ChurchMembership"("userId");

-- AddForeignKey
ALTER TABLE "ChurchMembership" ADD CONSTRAINT "ChurchMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChurchMembership" ADD CONSTRAINT "ChurchMembership_crunchId_fkey" FOREIGN KEY ("crunchId") REFERENCES "Crunch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChurchMembership" ADD CONSTRAINT "ChurchMembership_churchRoleId_fkey" FOREIGN KEY ("churchRoleId") REFERENCES "ChurchRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
