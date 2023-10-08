-- CreateTable
CREATE TABLE "Surovini" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Surovini_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secondLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "suroviniId" TEXT,

    CONSTRAINT "secondLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thirdLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secondLevelId" TEXT NOT NULL,

    CONSTRAINT "thirdLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kontragent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Kontragent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employees" TEXT NOT NULL,
    "another" TEXT NOT NULL,
    "address_workshop" TEXT NOT NULL,
    "kontragentId" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "measure" TEXT NOT NULL,
    "density" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "another" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "package" TEXT NOT NULL,
    "cost" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "thirdLevelId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "secondLevel" ADD CONSTRAINT "secondLevel_suroviniId_fkey" FOREIGN KEY ("suroviniId") REFERENCES "Surovini"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thirdLevel" ADD CONSTRAINT "thirdLevel_secondLevelId_fkey" FOREIGN KEY ("secondLevelId") REFERENCES "secondLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_kontragentId_fkey" FOREIGN KEY ("kontragentId") REFERENCES "Kontragent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_thirdLevelId_fkey" FOREIGN KEY ("thirdLevelId") REFERENCES "thirdLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
