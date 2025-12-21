-- CreateTable
CREATE TABLE "OrderImage" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "imageType" TEXT NOT NULL DEFAULT 'general',
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderImage_orderId_idx" ON "OrderImage"("orderId");

-- CreateIndex
CREATE INDEX "OrderImage_imageType_idx" ON "OrderImage"("imageType");

-- AddForeignKey
ALTER TABLE "OrderImage" ADD CONSTRAINT "OrderImage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
