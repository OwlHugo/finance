
import Fastify from 'fastify'
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


// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
