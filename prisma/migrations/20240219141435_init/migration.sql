-- CreateTable
CREATE TABLE "Embedding" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "data" DOUBLE PRECISION[],

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);
