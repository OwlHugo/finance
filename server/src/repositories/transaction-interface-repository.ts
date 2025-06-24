import { Transaction } from "../entities/transaction.js";

export type CreateTransactionDTO = {
  description: string;
  type: 'expense' | 'income';
  amount: number;
  bankId: string;
  categoryId: string;
  date: Date;
}

export interface TransactionInterfaceRepository {
  findById(id: string): Promise<Transaction | null>;
  findAll(): Promise<Transaction[]>;
  findByType(type: 'expense' | 'income'): Promise<Transaction[]>;
  create(transaction: CreateTransactionDTO): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
}