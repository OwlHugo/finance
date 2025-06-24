import { TransactionInterfaceRepository } from "../../repositories/transaction-interface-repository.js";
import { Transaction } from "../../entities/transaction.js";

export class GetAllTransactionsService {
  private transactionRepository: TransactionInterfaceRepository;
  
  constructor(transactionRepository: TransactionInterfaceRepository) {
    this.transactionRepository = transactionRepository;
  }
  
  async execute(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.findAll();
    return transactions;
  }
}