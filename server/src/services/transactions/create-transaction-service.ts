import { TransactionInterfaceRepository } from "../../repositories/transaction-interface-repository.js";

export class CreateTransactionService {
  private transactionRepository: TransactionInterfaceRepository;
  
  constructor(transactionRepository: TransactionInterfaceRepository) {
    this.transactionRepository = transactionRepository;
  }
  
  async execute(
    description: string, 
    type: 'expense' | 'income', 
    amount: number, 
    bankId: string, 
    categoryId: string, 
    date: Date
  ): Promise<any> {
    if (!description || !type || !amount || !bankId || !categoryId || !date) {
      throw new Error('All fields are required');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const newTransaction = await this.transactionRepository.create({
      description,
      type,
      amount,
      bankId,
      categoryId,
      date
    });

    return newTransaction;
  }
}