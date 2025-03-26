import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const organisation = await prisma.organisation.findFirst({
    where: {
      realm: 'circuless',
    },
  })
  if (organisation) {
    await prisma.node.createMany({
      data: Array.from({ length: 10 }, (_, i) => ({
        name: `Test Node ${i}`,
        host: `www.test${i}.com`,
        access: 'direct',
        ownerId: organisation.id,
        realm: 'circuless',
        version: '1.0.0',
      })),
      skipDuplicates: true,
    })
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
