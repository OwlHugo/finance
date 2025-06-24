import { TransactionInterfaceRepository } from "../../repositories/transaction-interface-repository.js";
import { Transaction } from "../../entities/transaction.js";

export class GetTransactionService {
  private transactionRepository: TransactionInterfaceRepository;
  
  constructor(transactionRepository: TransactionInterfaceRepository) {
    this.transactionRepository = transactionRepository;
  }
  
  async execute(id: string): Promise<Transaction | null> {
    if (!id) {
      throw new Error('ID is required');
    }

    const transaction = await this.transactionRepository.findById(id);
    return transaction;
  }
}