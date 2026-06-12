-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_menuItemId_key" ON "Review"("userId", "menuItemId");
