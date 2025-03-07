-- CreateEnum
CREATE TYPE "NodeAccess" AS ENUM ('DIRECT', 'WIREGUARD');

-- CreateEnum
CREATE TYPE "NodeRestrictions" AS ENUM ('DISCOVERY', 'REGISTRY');

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "access" "NodeAccess" NOT NULL DEFAULT 'DIRECT',
    "csr" TEXT,
    "restrictions" "NodeRestrictions"[] DEFAULT ARRAY['DISCOVERY']::"NodeRestrictions"[],
    "realm" "Realm" NOT NULL,
    "wireguardId" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeWireguard" (
    "id" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "pvtkey" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NodeWireguard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Node_csr_key" ON "Node"("csr");

-- CreateIndex
CREATE UNIQUE INDEX "Node_host_realm_key" ON "Node"("host", "realm");

-- CreateIndex
CREATE UNIQUE INDEX "NodeWireguard_nodeId_key" ON "NodeWireguard"("nodeId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeWireguard" ADD CONSTRAINT "NodeWireguard_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
