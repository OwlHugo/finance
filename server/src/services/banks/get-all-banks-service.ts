import { BankInterfaceRepository } from "../../repositories/bank-interface-repository.js";
import { Bank } from "../../entities/transaction.js";

export class GetAllBanksService {
  private bankRepository: BankInterfaceRepository;
  
  constructor(bankRepository: BankInterfaceRepository) {
    this.bankRepository = bankRepository;
  }
  
  async execute(): Promise<Bank[]> {
    const banks = await this.bankRepository.findAll();
    return banks;
  }
}