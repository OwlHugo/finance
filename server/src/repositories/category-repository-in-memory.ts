import { Category } from "../entities/transaction.js";
import { CategoryInterfaceRepository, CreateCategoryDTO } from "./category-interface-repository.js";

export class CategoryRepositoryInMemory implements CategoryInterfaceRepository {
  categories: Category[] = [];

  async findById(id: string): Promise<Category | null> {
    const category = this.categories.find(category => category.id === id);
    return category || null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = this.categories.find(category => category.name === name);
    return category || null;
  }

  async findAll(): Promise<Category[]> {
    return this.categories;
  }

  async create(category: CreateCategoryDTO): Promise<Category> {
    const newCategory = new Category(category.name, category.icon);
    this.categories.push(newCategory);
    return newCategory;
  }

  async update(category: Category): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    category.updatedAt = new Date();
    this.categories[index] = category;
    return category;
  }

  async delete(id: string): Promise<void> {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    this.categories.splice(index, 1);
  }
}
