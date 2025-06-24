import { TransactionInterfaceRepository } from "../../repositories/transaction-interface-repository.js";
import { Transaction } from "../../entities/transaction.js";
import { BankInterfaceRepository } from "../../repositories/bank-interface-repository.js";
import { CategoryInterfaceRepository } from "../../repositories/category-interface-repository.js";

export class UpdateTransactionService {
  private transactionRepository: TransactionInterfaceRepository;
  private bankRepository: BankInterfaceRepository;
  private categoryRepository: CategoryInterfaceRepository;
  
  constructor(
    transactionRepository: TransactionInterfaceRepository,
    bankRepository: BankInterfaceRepository,
    categoryRepository: CategoryInterfaceRepository
  ) {
    this.transactionRepository = transactionRepository;
    this.bankRepository = bankRepository;
    this.categoryRepository = categoryRepository;
  }
  
  async execute(
    id: string,
    description?: string,
    type?: 'expense' | 'income',
    amount?: number,
    bankId?: string,
    categoryId?: string,
    date?: Date
  ): Promise<Transaction> {
    if (!id) {
      throw new Error('ID is required');
    }

    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    let bank = existingTransaction.bank;
    let category = existingTransaction.category;

    if (bankId && bankId !== existingTransaction.bank.id) {
      const foundBank = await this.bankRepository.findById(bankId);
      if (!foundBank) {
        throw new Error('Bank not found');
      }
      bank = foundBank;
    }

    if (categoryId && categoryId !== existingTransaction.category.id) {
      const foundCategory = await this.categoryRepository.findById(categoryId);
      if (!foundCategory) {
        throw new Error('Category not found');
      }
      category = foundCategory;
    }

    if (amount !== undefined && amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const updatedTransaction = new Transaction(
      description ?? existingTransaction.description,
      type ?? existingTransaction.type,
      amount ?? existingTransaction.amount,
      bank,
      category,
      date ?? existingTransaction.date,
      existingTransaction.id,
      existingTransaction.createdAt
    );

    return await this.transactionRepository.update(updatedTransaction);
  }
}