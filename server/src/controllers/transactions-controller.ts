import { FastifyReply, FastifyRequest } from 'fastify';
import { TransactionRepositoryPrisma } from '../repositories/transaction-repository-prisma.js';
import { CategoryRepositoryPrisma } from '../repositories/category-repository-prisma.js';
import { BankRepositoryPrisma } from '../repositories/bank-repository-prisma.js';
import { CreateTransactionService } from '../services/transactions/create-transaction-service.js';
import { GetTransactionService } from '../services/transactions/get-transaction-service.js';
import { UpdateTransactionService } from '../services/transactions/update-transaction-service.js';
import { GetAllTransactionsService } from '../services/transactions/get-all-transactions-service.js';
import { DeleteTransactionService } from '../services/transactions/delete-transaction-service.js';

export class TransactionsController {
  private categoryRepository: CategoryRepositoryPrisma;
  private bankRepository: BankRepositoryPrisma;
  private transactionRepository: TransactionRepositoryPrisma;
  private createTransactionService: CreateTransactionService;
  private getTransactionService: GetTransactionService;
  private getAllTransactionsService: GetAllTransactionsService;
  private updateTransactionService: UpdateTransactionService;
  private deleteTransactionService: DeleteTransactionService;

  constructor() {
    this.categoryRepository = new CategoryRepositoryPrisma();
    this.bankRepository = new BankRepositoryPrisma();
    this.transactionRepository = new TransactionRepositoryPrisma(this.bankRepository, this.categoryRepository);
    this.createTransactionService = new CreateTransactionService(this.transactionRepository);
    this.getTransactionService = new GetTransactionService(this.transactionRepository);
    this.getAllTransactionsService = new GetAllTransactionsService(this.transactionRepository);
    this.updateTransactionService = new UpdateTransactionService(this.transactionRepository, this.bankRepository, this.categoryRepository);
    this.deleteTransactionService = new DeleteTransactionService(this.transactionRepository);
  }

  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const transactions = await this.getAllTransactionsService.execute();
      return reply.send(transactions);
    } catch (error) {
      return reply.status(500).send({ 
        error: 'Erro interno do servidor',
        message: (error as Error).message 
      });
    }
  }

  async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      if (!id) {
        return reply.status(400).send({ error: 'ID da transação é obrigatório' });
      }

      const transaction = await this.getTransactionService.execute(id);
      
      if (!transaction) {
        return reply.status(404).send({ error: 'Transação não encontrada' });
      }
      
      return reply.send(transaction);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao buscar transação',
        message: (error as Error).message 
      });
    }
  }

  async store(request: FastifyRequest<{ 
    Body: { 
      description: string;
      type: 'expense' | 'income';
      amount: number;
      bankId: string;
      categoryId: string;
      date: string;
    } 
  }>, reply: FastifyReply) {
    try {
      const { description, type, amount, bankId, categoryId, date } = request.body;

      // Validações
      if (!description || description.trim() === '') {
        return reply.status(400).send({ error: 'Descrição é obrigatória' });
      }

      if (!type || !['expense', 'income'].includes(type)) {
        return reply.status(400).send({ error: 'Tipo deve ser "expense" ou "income"' });
      }

      if (!amount || amount <= 0) {
        return reply.status(400).send({ error: 'Valor deve ser maior que zero' });
      }

      if (!bankId) {
        return reply.status(400).send({ error: 'ID do banco é obrigatório' });
      }

      if (!categoryId) {
        return reply.status(400).send({ error: 'ID da categoria é obrigatório' });
      }

      if (!date) {
        return reply.status(400).send({ error: 'Data é obrigatória' });
      }

      const transaction = await this.createTransactionService.execute(
        description, 
        type, 
        amount, 
        bankId, 
        categoryId, 
        new Date(date)
      );
      
      return reply.status(201).send(transaction);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao criar transação',
        message: (error as Error).message 
      });
    }
  }

  async update(request: FastifyRequest<{ 
    Params: { id: string }; 
    Body: { 
      description?: string;
      type?: 'expense' | 'income';
      amount?: number;
      bankId?: string;
      categoryId?: string;
      date?: string;
    } 
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { description, type, amount, bankId, categoryId, date } = request.body;

      if (!id) {
        return reply.status(400).send({ error: 'ID da transação é obrigatório' });
      }

      // Validações
      if (description !== undefined && description.trim() === '') {
        return reply.status(400).send({ error: 'Descrição não pode estar vazia' });
      }

      if (type !== undefined && !['expense', 'income'].includes(type)) {
        return reply.status(400).send({ error: 'Tipo deve ser "expense" ou "income"' });
      }

      if (amount !== undefined && amount <= 0) {
        return reply.status(400).send({ error: 'Valor deve ser maior que zero' });
      }
      
      const transaction = await this.updateTransactionService.execute(
        id,
        description, 
        type, 
        amount, 
        bankId, 
        categoryId, 
        date ? new Date(date) : undefined
      );
      
      return reply.send(transaction);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao atualizar transação',
        message: (error as Error).message 
      });
    }
  }

  async destroy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      if (!id) {
        return reply.status(400).send({ error: 'ID da transação é obrigatório' });
      }

      await this.deleteTransactionService.execute(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao deletar transação',
        message: (error as Error).message 
      });
    }
  }
} 