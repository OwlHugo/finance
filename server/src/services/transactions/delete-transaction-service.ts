import { TransactionInterfaceRepository } from "../../repositories/transaction-interface-repository.js";

export class DeleteTransactionService {
  private transactionRepository: TransactionInterfaceRepository;
  
  constructor(transactionRepository: TransactionInterfaceRepository) {
    this.transactionRepository = transactionRepository;
  }
  
  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID is required');
    }

    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    await this.transactionRepository.delete(id);
  }
}