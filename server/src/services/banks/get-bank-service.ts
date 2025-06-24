import { BankInterfaceRepository } from "../../repositories/bank-interface-repository.js";
import { Bank } from "../../entities/transaction.js";

export class GetBankService {
  private bankRepository: BankInterfaceRepository;
  
  constructor(bankRepository: BankInterfaceRepository) {
    this.bankRepository = bankRepository;
  }
  
  async execute(id: string): Promise<Bank | null> {
    if (!id) {
      throw new Error('ID is required');
    }

    const bank = await this.bankRepository.findById(id);
    return bank;
  }
}