import { FastifyInstance } from 'fastify'
import { CategoryRepositoryPrisma } from '../repositories/category-repository-prisma.js'
import { CreateCategoryService } from '../services/categories/create-category-service.js'
import { GetCategoryService } from '../services/categories/get-category-service.js'
import { GetAllCategoriesService } from '../services/categories/get-all-categories-service.js'
import { UpdateCategoryService } from '../services/categories/update-category-service.js'
import { DeleteCategoryService } from '../services/categories/delete-category-service.js'

const categoryRepository = new CategoryRepositoryPrisma()
const createCategoryService = new CreateCategoryService(categoryRepository)
const getCategoryService = new GetCategoryService(categoryRepository)
const getAllCategoriesService = new GetAllCategoriesService(categoryRepository)
const updateCategoryService = new UpdateCategoryService(categoryRepository)
const deleteCategoryService = new DeleteCategoryService(categoryRepository)

export async function categoriesRoutes(fastify: FastifyInstance) {
  // GET /categories
  fastify.get('/categories', async function handler(request, reply) {
    try {
      const categories = await getAllCategoriesService.execute()
      return reply.send(categories)
    } catch (error) {
      return reply.status(500).send({ error: (error as Error).message })
    }
  })

  // GET /categories/:id
  fastify.get('/categories/:id', async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const category = await getCategoryService.execute(id)
      
      if (!category) {
        return reply.status(404).send({ error: 'Category not found' })
      }
      
      return reply.send(category)
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message })
    }
  })

  // POST /categories
  fastify.post('/categories', async function handler(request, reply) {
    try {
      const { name, icon } = request.body as { name: string, icon?: string | null }
      const category = await createCategoryService.execute(name, icon)
      return reply.status(201).send(category)
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message })
    }
  })

  // PUT /categories/:id
  fastify.put('/categories/:id', async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      const { name, icon } = request.body as { name?: string, icon?: string | null }
      const category = await updateCategoryService.execute(id, name, icon)
      return reply.send(category)
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message })
    }
  })

  // DELETE /categories/:id
  fastify.delete('/categories/:id', async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string }
      await deleteCategoryService.execute(id)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message })
    }
  })
}
