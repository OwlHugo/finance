import { CategoryInterfaceRepository } from "../../repositories/category-interface-repository.js";

export class DeleteCategoryService {
  private categoryRepository: CategoryInterfaceRepository;
  
  constructor(categoryRepository: CategoryInterfaceRepository) {
    this.categoryRepository = categoryRepository;
  }
  
  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID is required');
    }

    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    await this.categoryRepository.delete(id);
  }
}