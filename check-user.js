const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'felipeobando2001@gmail.com' },
      include: { taller: true }
    })
    
    if (user) {
      console.log('✅ Usuario encontrado:')
      console.log(JSON.stringify({
        email: user.email,
        tallerId: user.tallerId,
        tallerNombre: user.taller?.nombre,
        hasPassword: !!user.passwordHash
      }, null, 2))
    } else {
      console.log('❌ Usuario NO encontrado en la base de datos')
      console.log('Usuarios existentes:')
      const allUsers = await prisma.user.findMany({
        select: { email: true }
      })
      console.log(allUsers)
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
