import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryRepositoryPrisma } from '../repositories/category-repository-prisma.js';
import { CreateCategoryService } from '../services/categories/create-category-service.js';
import { GetCategoryService } from '../services/categories/get-category-service.js';
import { GetAllCategoriesService } from '../services/categories/get-all-categories-service.js';
import { UpdateCategoryService } from '../services/categories/update-category-service.js';
import { DeleteCategoryService } from '../services/categories/delete-category-service.js';

export class CategoriesController {
  private categoryRepository: CategoryRepositoryPrisma;
  private createCategoryService: CreateCategoryService;
  private getCategoryService: GetCategoryService;
  private getAllCategoriesService: GetAllCategoriesService;
  private updateCategoryService: UpdateCategoryService;
  private deleteCategoryService: DeleteCategoryService;

  constructor() {
    this.categoryRepository = new CategoryRepositoryPrisma();
    this.createCategoryService = new CreateCategoryService(this.categoryRepository);
    this.getCategoryService = new GetCategoryService(this.categoryRepository);
    this.getAllCategoriesService = new GetAllCategoriesService(this.categoryRepository);
    this.updateCategoryService = new UpdateCategoryService(this.categoryRepository);
    this.deleteCategoryService = new DeleteCategoryService(this.categoryRepository);
  }

  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await this.getAllCategoriesService.execute();
      return reply.send(categories);
    } catch (error) {
      return reply.status(500).send({ 
        error: 'Erro interno do servidor',
        message: (error as Error).message 
      });
    }
  }

  async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      if (!id) {
        return reply.status(400).send({ error: 'ID da categoria é obrigatório' });
      }

      const category = await this.getCategoryService.execute(id);
      
      if (!category) {
        return reply.status(404).send({ error: 'Categoria não encontrada' });
      }
      
      return reply.send(category);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao buscar categoria',
        message: (error as Error).message 
      });
    }
  }

  async store(request: FastifyRequest<{ Body: { name: string; icon?: string | null } }>, reply: FastifyReply) {
    try {
      const { name, icon } = request.body;

      if (!name || name.trim() === '') {
        return reply.status(400).send({ error: 'Nome da categoria é obrigatório' });
      }

      const category = await this.createCategoryService.execute(name, icon);
      return reply.status(201).send(category);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao criar categoria',
        message: (error as Error).message 
      });
    }
  }

  async update(request: FastifyRequest<{ 
    Params: { id: string }; 
    Body: { name?: string; icon?: string | null } 
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { name, icon } = request.body;

      if (!id) {
        return reply.status(400).send({ error: 'ID da categoria é obrigatório' });
      }

      if (name !== undefined && name.trim() === '') {
        return reply.status(400).send({ error: 'Nome da categoria não pode estar vazio' });
      }

      const category = await this.updateCategoryService.execute(id, name, icon);
      return reply.send(category);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao atualizar categoria',
        message: (error as Error).message 
      });
    }
  }

  async destroy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      if (!id) {
        return reply.status(400).send({ error: 'ID da categoria é obrigatório' });
      }

      await this.deleteCategoryService.execute(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao deletar categoria',
        message: (error as Error).message 
      });
    }
  }
} 