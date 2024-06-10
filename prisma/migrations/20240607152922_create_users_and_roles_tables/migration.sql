-- DropIndex
DROP INDEX "Permission_form_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Control" (
    "form" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "sequence" INTEGER
);
INSERT INTO "new_Control" ("active", "description", "form", "role", "sequence", "type") SELECT "active", "description", "form", "role", "sequence", "type" FROM "Control";
DROP TABLE "Control";
ALTER TABLE "new_Control" RENAME TO "Control";
CREATE UNIQUE INDEX "Control_form_key" ON "Control"("form");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
