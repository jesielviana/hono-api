-- CreateTable
CREATE TABLE "movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);
