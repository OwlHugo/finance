import { CategoryInterfaceRepository } from "../../repositories/category-interface-repository.js";
import { Category } from "../../entities/transaction.js";

export class GetCategoryService {
  private categoryRepository: CategoryInterfaceRepository;
  
  constructor(categoryRepository: CategoryInterfaceRepository) {
    this.categoryRepository = categoryRepository;
  }
  
  async execute(id: string): Promise<Category | null> {
    if (!id) {
      throw new Error('ID is required');
    }

    const category = await this.categoryRepository.findById(id);
    return category;
  }
}