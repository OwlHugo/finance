import { Transaction } from "../entities/transaction.js";
import { TransactionInterfaceRepository, CreateTransactionDTO } from "./transaction-interface-repository.js";
import { BankInterfaceRepository } from "./bank-interface-repository.js";
import { CategoryInterfaceRepository } from "./category-interface-repository.js";

export class TransactionRepositoryInMemory implements TransactionInterfaceRepository {
  transactions: Transaction[] = [];

  constructor(
    private bankRepository: BankInterfaceRepository,
    private categoryRepository: CategoryInterfaceRepository
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.transactions.find(transaction => transaction.id === id);
    return transaction || null;
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions;
  }

  async findByType(type: 'expense' | 'income'): Promise<Transaction[]> {
    return this.transactions.filter(transaction => transaction.type === type);
  }

  async create(transaction: CreateTransactionDTO): Promise<Transaction> {
    const bank = await this.bankRepository.findById(transaction.bankId);
    if (!bank) {
      throw new Error('Bank not found');
    }

    const category = await this.categoryRepository.findById(transaction.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const newTransaction = new Transaction(
      transaction.description,
      transaction.type,
      transaction.amount,
      bank,
      category,
      transaction.date
    );

    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const index = this.transactions.findIndex(t => t.id === transaction.id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    transaction.updatedAt = new Date();
    this.transactions[index] = transaction;
    return transaction;
  }

  async delete(id: string): Promise<void> {
    const index = this.transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    this.transactions.splice(index, 1);
  }
}