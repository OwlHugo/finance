import { Category } from "../entities/transaction.js";
import { CategoryInterfaceRepository, CreateCategoryDTO } from "./category-interface-repository.js";
import { prisma } from "../lib/prisma.js";

export class CategoryRepositoryPrisma implements CategoryInterfaceRepository {
  async findById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) return null;

    return new Category(
      category.name,
      category.icon,
      category.id,
      category.createdAt,
      category.updatedAt
    );
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { name }
    });

    if (!category) return null;

    return new Category(
      category.name,
      category.icon,
      category.id,
      category.createdAt,
      category.updatedAt
    );
  }

  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return categories.map(category => new Category(
      category.name,
      category.icon,
      category.id,
      category.createdAt,
      category.updatedAt
    ));
  }

  async create(category: CreateCategoryDTO): Promise<Category> {
    const newCategory = await prisma.category.create({
      data: {
        name: category.name,
        icon: category.icon
      }
    });

    return new Category(
      newCategory.name,
      newCategory.icon,
      newCategory.id,
      newCategory.createdAt,
      newCategory.updatedAt
    );
  }

  async update(category: Category): Promise<Category> {
    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        icon: category.icon
      }
    });

    return new Category(
      updatedCategory.name,
      updatedCategory.icon,
      updatedCategory.id,
      updatedCategory.createdAt,
      updatedCategory.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id }
    });
  }
} 