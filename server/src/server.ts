
import Fastify from 'fastify'
import { Category } from './entities/transaction.js'
import { CategoryRepositoryInMemory } from './repositories/category-repository-in-memory.js'
import { CreateCategoryService } from './services/categories/create-category-service.js'
import { categoriesRoutes } from './routes/categories-route.js'
import { banksRoutes } from './routes/banks-route.js'
import { transactionsRoutes } from './routes/transactions-route.js'

const fastify = Fastify({
  logger: true
})

const versionApi = "v1"

fastify.register(categoriesRoutes);
fastify.register(banksRoutes);
fastify.register(transactionsRoutes);

// fastify.get('/categories', async function handler(request, reply) {

//   return reply.send(categories)
// })

// fastify.patch(`/categories/:id`, async function handler(request, reply) {
//   const { id } = request.params as { id: string }
//   const {name , icon} = request.body as { name?: string, icon?: string }

//   const categoryFinded = categories.find(category => category.id === id)
//   if (!categoryFinded) {
//     return reply.status(404).send({ error: 'Category not found' })
//   }

//   const categoryIndex = categories.findIndex(category => category.id === id)
//   categories[categoryIndex] = {
//     ...categoryFinded,
//     name: name ?? categoryFinded.name,
//     icon: icon ?? categoryFinded.icon,
//   }

//   return reply.send(categories[categoryIndex])
// })


// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
