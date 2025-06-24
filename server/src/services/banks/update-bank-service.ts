import { BankInterfaceRepository } from "../../repositories/bank-interface-repository.js";
import { Bank } from "../../entities/transaction.js";

export class UpdateBankService {
  private bankRepository: BankInterfaceRepository;
  
  constructor(bankRepository: BankInterfaceRepository) {
    this.bankRepository = bankRepository;
  }
  
  async execute(id: string, ispb?: string, name?: string, code?: string, fullName?: string): Promise<Bank> {
    if (!id) {
      throw new Error('ID is required');
    }

    const existingBank = await this.bankRepository.findById(id);
    if (!existingBank) {
      throw new Error('Bank not found');
    }

    if (name && name !== existingBank.name) {
      const bankWithSameName = await this.bankRepository.findByName(name);
      if (bankWithSameName) {
        throw new Error('Bank with this name already exists');
      }
    }

    if (code && code !== existingBank.code) {
      const bankWithSameCode = await this.bankRepository.findByCode(code);
      if (bankWithSameCode) {
        throw new Error('Bank with this code already exists');
      }
    }

    const updatedBank = new Bank(
      ispb ?? existingBank.ispb,
      name ?? existingBank.name,
      code ?? existingBank.code,
      fullName ?? existingBank.fullName,
      existingBank.id,
      existingBank.createdAt
    );

    return await this.bankRepository.update(updatedBank);
  }
}