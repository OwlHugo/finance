import { Bank } from "../entities/transaction.js";
import { BankInterfaceRepository, CreateBankDTO } from "./bank-interface-repository.js";

export class BankRepositoryInMemory implements BankInterfaceRepository {
  banks: Bank[] = [];

  async findById(id: string): Promise<Bank | null> {
    const bank = this.banks.find(bank => bank.id === id);
    return bank || null;
  }

  async findByName(name: string): Promise<Bank | null> {
    const bank = this.banks.find(bank => bank.name === name);
    return bank || null;
  }

  async findByCode(code: string): Promise<Bank | null> {
    const bank = this.banks.find(bank => bank.code === code);
    return bank || null;
  }

  async findAll(): Promise<Bank[]> {
    return this.banks;
  }

  async create(bank: CreateBankDTO): Promise<Bank> {
    const newBank = new Bank(bank.ispb, bank.name, bank.code, bank.fullName);
    this.banks.push(newBank);
    return newBank;
  }

  async update(bank: Bank): Promise<Bank> {
    const index = this.banks.findIndex(b => b.id === bank.id);
    if (index === -1) {
      throw new Error('Bank not found');
    }
    bank.updatedAt = new Date();
    this.banks[index] = bank;
    return bank;
  }

  async delete(id: string): Promise<void> {
    const index = this.banks.findIndex(bank => bank.id === id);
    if (index === -1) {
      throw new Error('Bank not found');
    }
    this.banks.splice(index, 1);
  }
}