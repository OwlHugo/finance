import { CategoryInterfaceRepository } from "../../repositories/category-interface-repository.js";
import { Category } from "../../entities/transaction.js";

export class GetAllCategoriesService {
  private categoryRepository: CategoryInterfaceRepository;
  
  constructor(categoryRepository: CategoryInterfaceRepository) {
    this.categoryRepository = categoryRepository;
  }
  
  async execute(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();
    return categories;
  }
}