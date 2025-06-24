import { BankInterfaceRepository } from "../../repositories/bank-interface-repository.js";

export class DeleteBankService {
  private bankRepository: BankInterfaceRepository;
  
  constructor(bankRepository: BankInterfaceRepository) {
    this.bankRepository = bankRepository;
  }
  
  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID is required');
    }

    const existingBank = await this.bankRepository.findById(id);
    if (!existingBank) {
      throw new Error('Bank not found');
    }

    await this.bankRepository.delete(id);
  }
}