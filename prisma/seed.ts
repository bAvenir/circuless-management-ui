import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.findFirst({
    where: {
      realm: 'circuless',
    },
  })
  if (user) {
    await prisma.node.createMany({
      data: [...Array(10).keys()].map((i) => ({
        name: `Test Node ${i}`,
        host: `www.test${i}.com`,
        access: 'direct',
        ownerId: user.id,
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
