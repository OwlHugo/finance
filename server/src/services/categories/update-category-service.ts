import { CategoryInterfaceRepository } from "../../repositories/category-interface-repository.js";
import { Category } from "../../entities/transaction.js";

export class UpdateCategoryService {
  private categoryRepository: CategoryInterfaceRepository;
  
  constructor(categoryRepository: CategoryInterfaceRepository) {
    this.categoryRepository = categoryRepository;
  }
  
  async execute(id: string, name?: string, icon?: string | null): Promise<Category> {
    if (!id) {
      throw new Error('ID is required');
    }

    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (name && name !== existingCategory.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(name);
      if (categoryWithSameName) {
        throw new Error('Category with this name already exists');
      }
    }

    const updatedCategory = new Category(
      name ?? existingCategory.name,
      icon !== undefined ? icon : existingCategory.icon,
      existingCategory.id,
      existingCategory.createdAt
    );

    return await this.categoryRepository.update(updatedCategory);
  }
}