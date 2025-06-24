import { BankInterfaceRepository } from "../../repositories/bank-interface-repository.js";

export class CreateBankService {
  private bankRepository: BankInterfaceRepository;
  
  constructor(bankRepository: BankInterfaceRepository) {
    this.bankRepository = bankRepository;
  }
  
  async execute(ispb: string, name: string, code: string, fullName: string): Promise<any> {
    if (!ispb || !name || !code || !fullName) {
      throw new Error('All fields are required');
    }

    const existingBankByName = await this.bankRepository.findByName(name);
    if (existingBankByName) {
      throw new Error('Bank with this name already exists');
    }

    const existingBankByCode = await this.bankRepository.findByCode(code);
    if (existingBankByCode) {
      throw new Error('Bank with this code already exists');
    }

    const newBank = await this.bankRepository.create({ ispb, name, code, fullName });
    return newBank;
  }
}