import { FastifyInstance } from 'fastify';
import { TransactionRepositoryPrisma } from '../repositories/transaction-repository-prisma.js';
import { CategoryRepositoryPrisma } from '../repositories/category-repository-prisma.js';
import { BankRepositoryPrisma } from '../repositories/bank-repository-prisma.js';
import { CreateTransactionService } from '../services/transactions/create-transaction-service.js';
import { GetTransactionService } from '../services/transactions/get-transaction-service.js';
import { UpdateTransactionService } from '../services/transactions/update-transaction-service.js';
import { GetAllTransactionsService } from '../services/transactions/get-all-transactions-service.js';
import { DeleteTransactionService } from '../services/transactions/delete-transaction-service.js';

const categoryRepository = new CategoryRepositoryPrisma();
const bankRepository = new BankRepositoryPrisma();
const transactionRepository = new TransactionRepositoryPrisma(bankRepository, categoryRepository);
const createTransactionService = new CreateTransactionService(transactionRepository);
const getTransactionService = new GetTransactionService(transactionRepository);
const getAllTransactionsService = new GetAllTransactionsService(transactionRepository);
const updateTransactionService = new UpdateTransactionService(transactionRepository, bankRepository, categoryRepository);
const deleteTransactionService = new DeleteTransactionService(transactionRepository);

export async function transactionsRoutes(fastify: FastifyInstance) {
  // GET /transactions
  fastify.get('/transactions', async function handler(request, reply) {
    try {
      const transactions = await getAllTransactionsService.execute();
      return reply.send(transactions);
    } catch (error) {
      return reply.status(500).send({ error: (error as Error).message });
    }
  });

  // GET /transactions/:id
  fastify.get('/transactions/:id', async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      const transaction = await getTransactionService.execute(id);
      
      if (!transaction) {
        return reply.status(404).send({ error: 'Transaction not found' });
      }
      
      return reply.send(transaction);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // POST /transactions
  fastify.post('/transactions', async function handler(request, reply) {
    try {
      const { description, type, amount, bankId, categoryId, date } = request.body as { 
        description: string,
        type: 'expense' | 'income',
        amount: number,
        bankId: string,
        categoryId: string,
        date: string
      };
      
      const transaction = await createTransactionService.execute(
        description, 
        type, 
        amount, 
        bankId, 
        categoryId, 
        new Date(date)
      );
      
      return reply.status(201).send(transaction);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // PUT /transactions/:id
  fastify.put('/transactions/:id', async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      const { description, type, amount, bankId, categoryId, date } = request.body as { 
        description?: string,
        type?: 'expense' | 'income',
        amount?: number,
        bankId?: string,
        categoryId?: string,
        date?: string
      };
      
      const transaction = await updateTransactionService.execute(
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
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // DELETE /transactions/:id
  fastify.delete('/transactions/:id', async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      await deleteTransactionService.execute(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
}