import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Alimentação' },
      update: {},
      create: {
        name: 'Alimentação',
        icon: '🍽️'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Transporte' },
      update: {},
      create: {
        name: 'Transporte',
        icon: '🚗'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Moradia' },
      update: {},
      create: {
        name: 'Moradia',
        icon: '🏠'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Saúde' },
      update: {},
      create: {
        name: 'Saúde',
        icon: '🏥'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Educação' },
      update: {},
      create: {
        name: 'Educação',
        icon: '📚'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Lazer' },
      update: {},
      create: {
        name: 'Lazer',
        icon: '🎮'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Salário' },
      update: {},
      create: {
        name: 'Salário',
        icon: '💰'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Investimentos' },
      update: {},
      create: {
        name: 'Investimentos',
        icon: '📈'
      }
    })
  ])

  console.log(`✅ ${categories.length} categorias criadas`)

  // Criar bancos
  const banks = await Promise.all([
    prisma.bank.upsert({
      where: { code: '001' },
      update: {},
      create: {
        ispb: '00000000',
        name: 'Banco do Brasil',
        code: '001',
        fullName: 'BANCO DO BRASIL S.A.'
      }
    }),
    prisma.bank.upsert({
      where: { code: '104' },
      update: {},
      create: {
        ispb: '00360305',
        name: 'Caixa Econômica Federal',
        code: '104',
        fullName: 'CAIXA ECONOMICA FEDERAL'
      }
    }),
    prisma.bank.upsert({
      where: { code: '033' },
      update: {},
      create: {
        ispb: '90400888',
        name: 'Santander',
        code: '033',
        fullName: 'BANCO SANTANDER (BRASIL) S.A.'
      }
    }),
    prisma.bank.upsert({
      where: { code: '341' },
      update: {},
      create: {
        ispb: '60746948',
        name: 'Itaú',
        code: '341',
        fullName: 'ITAÚ UNIBANCO S.A.'
      }
    })
  ])

  console.log(`✅ ${banks.length} bancos criados`)

  // Criar algumas transações de exemplo
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        description: 'Salário Janeiro 2024',
        type: 'income',
        amount: 5000.00,
        date: new Date('2024-01-15'),
        bankId: banks[0].id,
        categoryId: categories[6].id // Salário
      }
    }),
    prisma.transaction.create({
      data: {
        description: 'Supermercado',
        type: 'expense',
        amount: 350.50,
        date: new Date('2024-01-20'),
        bankId: banks[0].id,
        categoryId: categories[0].id // Alimentação
      }
    }),
    prisma.transaction.create({
      data: {
        description: 'Combustível',
        type: 'expense',
        amount: 200.00,
        date: new Date('2024-01-22'),
        bankId: banks[1].id,
        categoryId: categories[1].id // Transporte
      }
    }),
    prisma.transaction.create({
      data: {
        description: 'Aluguel',
        type: 'expense',
        amount: 1200.00,
        date: new Date('2024-01-25'),
        bankId: banks[2].id,
        categoryId: categories[2].id // Moradia
      }
    })
  ])

  console.log(`✅ ${transactions.length} transações de exemplo criadas`)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 