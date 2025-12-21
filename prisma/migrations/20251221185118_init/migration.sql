-- CreateEnum
CREATE TYPE "TipoIdentificacion" AS ENUM ('FISICA', 'JURIDICA', 'DIMEX', 'NITE', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('BORRADOR', 'ENVIADA', 'APROBADA', 'FACTURADA', 'COMPLETADA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "tallerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Taller" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedulaJuridica" TEXT NOT NULL,
    "nombreResponsable" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombreComercial" TEXT,
    "actividadEconomica" TEXT,
    "provincia" TEXT,
    "canton" TEXT,
    "distrito" TEXT,
    "barrio" TEXT,
    "otrasSenas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Taller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "tallerId" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "color" TEXT,
    "kilometraje" INTEGER,
    "vin" VARCHAR(17),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "tallerId" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "tipoIdentificacion" "TipoIdentificacion" NOT NULL,
    "numeroIdentificacion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOrder" (
    "id" TEXT NOT NULL,
    "tallerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'BORRADOR',
    "motivoIngreso" TEXT,
    "fechaRecepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotalCentimos" INTEGER,
    "ivaCentimos" INTEGER,
    "totalCentimos" INTEGER,
    "invoiceJson" JSONB,
    "claveNumerica" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceLineItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "numeroLinea" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cabysCode" VARCHAR(13) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitarioCentimos" INTEGER NOT NULL,
    "subtotalCentimos" INTEGER NOT NULL,
    "ivaCentimos" INTEGER NOT NULL,
    "totalLineaCentimos" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderToken" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "invalidated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesCatalog" (
    "id" TEXT NOT NULL,
    "tallerId" TEXT,
    "descripcion" TEXT NOT NULL,
    "cabysCode" VARCHAR(13) NOT NULL,
    "precioSugeridoCentimos" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus" NOT NULL,
    "changedBy" TEXT,
    "notes" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tallerId_key" ON "User"("tallerId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Taller_cedulaJuridica_key" ON "Taller"("cedulaJuridica");

-- CreateIndex
CREATE UNIQUE INDEX "Taller_email_key" ON "Taller"("email");

-- CreateIndex
CREATE INDEX "Taller_cedulaJuridica_idx" ON "Taller"("cedulaJuridica");

-- CreateIndex
CREATE INDEX "Taller_email_idx" ON "Taller"("email");

-- CreateIndex
CREATE INDEX "Vehicle_placa_idx" ON "Vehicle"("placa");

-- CreateIndex
CREATE INDEX "Vehicle_tallerId_idx" ON "Vehicle"("tallerId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_tallerId_placa_key" ON "Vehicle"("tallerId", "placa");

-- CreateIndex
CREATE INDEX "Client_tallerId_idx" ON "Client"("tallerId");

-- CreateIndex
CREATE INDEX "Client_telefono_idx" ON "Client"("telefono");

-- CreateIndex
CREATE INDEX "Client_numeroIdentificacion_idx" ON "Client"("numeroIdentificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Client_tallerId_numeroIdentificacion_key" ON "Client"("tallerId", "numeroIdentificacion");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceOrder_orderNumber_key" ON "ServiceOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "ServiceOrder_tallerId_idx" ON "ServiceOrder"("tallerId");

-- CreateIndex
CREATE INDEX "ServiceOrder_vehicleId_idx" ON "ServiceOrder"("vehicleId");

-- CreateIndex
CREATE INDEX "ServiceOrder_clientId_idx" ON "ServiceOrder"("clientId");

-- CreateIndex
CREATE INDEX "ServiceOrder_orderNumber_idx" ON "ServiceOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "ServiceOrder_status_idx" ON "ServiceOrder"("status");

-- CreateIndex
CREATE INDEX "ServiceLineItem_orderId_idx" ON "ServiceLineItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceLineItem_orderId_numeroLinea_key" ON "ServiceLineItem"("orderId", "numeroLinea");

-- CreateIndex
CREATE UNIQUE INDEX "OrderToken_token_key" ON "OrderToken"("token");

-- CreateIndex
CREATE INDEX "OrderToken_orderId_idx" ON "OrderToken"("orderId");

-- CreateIndex
CREATE INDEX "OrderToken_token_idx" ON "OrderToken"("token");

-- CreateIndex
CREATE INDEX "OrderToken_expiresAt_idx" ON "OrderToken"("expiresAt");

-- CreateIndex
CREATE INDEX "ServicesCatalog_tallerId_idx" ON "ServicesCatalog"("tallerId");

-- CreateIndex
CREATE INDEX "ServicesCatalog_cabysCode_idx" ON "ServicesCatalog"("cabysCode");

-- CreateIndex
CREATE INDEX "ServicesCatalog_isGlobal_idx" ON "ServicesCatalog"("isGlobal");

-- CreateIndex
CREATE INDEX "OrderStatusHistory_orderId_idx" ON "OrderStatusHistory"("orderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "Taller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "Taller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "Taller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "Taller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOrder" ADD CONSTRAINT "ServiceOrder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineItem" ADD CONSTRAINT "ServiceLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderToken" ADD CONSTRAINT "OrderToken_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesCatalog" ADD CONSTRAINT "ServicesCatalog_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "Taller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
