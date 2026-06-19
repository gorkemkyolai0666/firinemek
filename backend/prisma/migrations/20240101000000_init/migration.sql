-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'baker', 'sales', 'quality');

-- CreateEnum
CREATE TYPE "ProductionBatchType" AS ENUM ('daily_bread', 'pastry_batch', 'special_order', 'trial', 'training');

-- CreateEnum
CREATE TYPE "ProductionBatchStatus" AS ENUM ('planned', 'in_progress', 'cooling', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('quoted', 'confirmed', 'baking', 'packed', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('sourdough', 'white_bread', 'pastry', 'viennoiserie', 'special');

-- CreateEnum
CREATE TYPE "IngredientCategory" AS ENUM ('flour', 'dairy', 'yeast', 'sugar', 'grain', 'other');

-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('dry', 'refrigerated', 'frozen', 'ambient');

-- CreateTable
CREATE TABLE "Bakery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "taxNo" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bakery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'baker',
    "specialty" TEXT NOT NULL DEFAULT '',
    "bakeryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "bakeryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionBatch" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "type" "ProductionBatchType" NOT NULL DEFAULT 'daily_bread',
    "status" "ProductionBatchStatus" NOT NULL DEFAULT 'planned',
    "notes" TEXT NOT NULL DEFAULT '',
    "bakerName" TEXT NOT NULL DEFAULT '',
    "quantityUnits" INTEGER NOT NULL DEFAULT 50,
    "customerId" TEXT NOT NULL,
    "bakeryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL DEFAULT '',
    "quantityUnits" INTEGER NOT NULL DEFAULT 50,
    "productCategory" "ProductCategory" NOT NULL DEFAULT 'white_bread',
    "status" "OrderStatus" NOT NULL DEFAULT 'quoted',
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3),
    "notes" TEXT NOT NULL DEFAULT '',
    "customerId" TEXT NOT NULL,
    "recipeId" TEXT,
    "bakeryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flourType" TEXT NOT NULL DEFAULT '',
    "category" "ProductCategory" NOT NULL DEFAULT 'white_bread',
    "hydrationPct" INTEGER NOT NULL DEFAULT 65,
    "fermentHours" INTEGER NOT NULL DEFAULT 12,
    "bakeTemp" INTEGER NOT NULL DEFAULT 220,
    "bakeMinutes" INTEGER NOT NULL DEFAULT 35,
    "description" TEXT NOT NULL DEFAULT '',
    "bakeryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "IngredientCategory" NOT NULL DEFAULT 'other',
    "storage" "StorageType" NOT NULL DEFAULT 'dry',
    "stockKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unitCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "supplier" TEXT NOT NULL DEFAULT '',
    "batchYear" INTEGER NOT NULL DEFAULT 2024,
    "notes" TEXT NOT NULL DEFAULT '',
    "bakeryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionBatch" ADD CONSTRAINT "ProductionBatch_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionBatch" ADD CONSTRAINT "ProductionBatch_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

