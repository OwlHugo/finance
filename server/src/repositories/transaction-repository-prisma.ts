import { Transaction, Bank, Category } from "../entities/transaction.js";
import { TransactionInterfaceRepository, CreateTransactionDTO } from "./transaction-interface-repository.js";
import { BankInterfaceRepository } from "./bank-interface-repository.js";
import { CategoryInterfaceRepository } from "./category-interface-repository.js";
import { prisma } from "../lib/prisma.js";

export class TransactionRepositoryPrisma implements TransactionInterfaceRepository {
  constructor(
    private bankRepository: BankInterfaceRepository,
    private categoryRepository: CategoryInterfaceRepository
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        bank: true,
        category: true
      }
    });

    if (!transaction) return null;

    const bank = new Bank(
      transaction.bank.ispb,
      transaction.bank.name,
      transaction.bank.code,
      transaction.bank.fullName,
      transaction.bank.id,
      transaction.bank.createdAt,
      transaction.bank.updatedAt
    );

    const category = new Category(
      transaction.category.name,
      transaction.category.icon,
      transaction.category.id,
      transaction.category.createdAt,
      transaction.category.updatedAt
    );

    return new Transaction(
      transaction.description,
      transaction.type as 'expense' | 'income',
      transaction.amount,
      bank,
      category,
      transaction.date,
      transaction.id,
      transaction.createdAt,
      transaction.updatedAt
    );
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      include: {
        bank: true,
        category: true
      },
      orderBy: { date: 'desc' }
    });

    return transactions.map(transaction => {
      const bank = new Bank(
        transaction.bank.ispb,
        transaction.bank.name,
        transaction.bank.code,
        transaction.bank.fullName,
        transaction.bank.id,
        transaction.bank.createdAt,
        transaction.bank.updatedAt
      );

      const category = new Category(
        transaction.category.name,
        transaction.category.icon,
        transaction.category.id,
        transaction.category.createdAt,
        transaction.category.updatedAt
      );

      return new Transaction(
        transaction.description,
        transaction.type as 'expense' | 'income',
        transaction.amount,
        bank,
        category,
        transaction.date,
        transaction.id,
        transaction.createdAt,
        transaction.updatedAt
      );
    });
  }

  async findByType(type: 'expense' | 'income'): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: { type },
      include: {
        bank: true,
        category: true
      },
      orderBy: { date: 'desc' }
    });

    return transactions.map(transaction => {
      const bank = new Bank(
        transaction.bank.ispb,
        transaction.bank.name,
        transaction.bank.code,
        transaction.bank.fullName,
        transaction.bank.id,
        transaction.bank.createdAt,
        transaction.bank.updatedAt
      );

      const category = new Category(
        transaction.category.name,
        transaction.category.icon,
        transaction.category.id,
        transaction.category.createdAt,
        transaction.category.updatedAt
      );

      return new Transaction(
        transaction.description,
        transaction.type as 'expense' | 'income',
        transaction.amount,
        bank,
        category,
        transaction.date,
        transaction.id,
        transaction.createdAt,
        transaction.updatedAt
      );
    });
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

    const newTransaction = await prisma.transaction.create({
      data: {
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        bankId: transaction.bankId,
        categoryId: transaction.categoryId
      },
      include: {
        bank: true,
        category: true
      }
    });

    return new Transaction(
      newTransaction.description,
      newTransaction.type as 'expense' | 'income',
      newTransaction.amount,
      bank,
      category,
      newTransaction.date,
      newTransaction.id,
      newTransaction.createdAt,
      newTransaction.updatedAt
    );
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        bankId: transaction.bank.id,
        categoryId: transaction.category.id
      },
      include: {
        bank: true,
        category: true
      }
    });

    const bank = new Bank(
      updatedTransaction.bank.ispb,
      updatedTransaction.bank.name,
      updatedTransaction.bank.code,
      updatedTransaction.bank.fullName,
      updatedTransaction.bank.id,
      updatedTransaction.bank.createdAt,
      updatedTransaction.bank.updatedAt
    );

    const category = new Category(
      updatedTransaction.category.name,
      updatedTransaction.category.icon,
      updatedTransaction.category.id,
      updatedTransaction.category.createdAt,
      updatedTransaction.category.updatedAt
    );

    return new Transaction(
      updatedTransaction.description,
      updatedTransaction.type as 'expense' | 'income',
      updatedTransaction.amount,
      bank,
      category,
      updatedTransaction.date,
      updatedTransaction.id,
      updatedTransaction.createdAt,
      updatedTransaction.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.transaction.delete({
      where: { id }
    });
  }
} 