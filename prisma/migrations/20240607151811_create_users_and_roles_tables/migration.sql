-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Control" (
    "form" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "sequence" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Permission" (
    "profileId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "form" TEXT NOT NULL,
    "view" BOOLEAN NOT NULL,
    "insert" BOOLEAN NOT NULL,
    "update" BOOLEAN NOT NULL,
    "delete" BOOLEAN NOT NULL,
    "admin" BOOLEAN NOT NULL,
    CONSTRAINT "Permission_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Permission_form_fkey" FOREIGN KEY ("form") REFERENCES "Control" ("form") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_description_key" ON "Profile"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Control_form_key" ON "Control"("form");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_profileId_key" ON "Permission"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_form_key" ON "Permission"("form");
