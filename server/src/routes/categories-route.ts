import { FastifyInstance } from 'fastify'
import { CategoriesController } from '../controllers/categories-controller.js'

const categoriesController = new CategoriesController()

export async function categoriesRoutes(fastify: FastifyInstance) {
  // GET /categories
  fastify.get('/categories', categoriesController.index.bind(categoriesController))

  // GET /categories/:id
  fastify.get('/categories/:id', categoriesController.show.bind(categoriesController))

  // POST /categories
  fastify.post('/categories', categoriesController.store.bind(categoriesController))

  // PUT /categories/:id
  fastify.put('/categories/:id', categoriesController.update.bind(categoriesController))

  // DELETE /categories/:id
  fastify.delete('/categories/:id', categoriesController.destroy.bind(categoriesController))
}
