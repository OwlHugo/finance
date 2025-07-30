import { FastifyInstance } from 'fastify';
import { TransactionsController } from '../controllers/transactions-controller.js';

const transactionsController = new TransactionsController();

export async function transactionsRoutes(fastify: FastifyInstance) {
  // GET /transactions
  fastify.get('/transactions', transactionsController.index.bind(transactionsController));

  // GET /transactions/:id
  fastify.get('/transactions/:id', transactionsController.show.bind(transactionsController));

  // POST /transactions
  fastify.post('/transactions', transactionsController.store.bind(transactionsController));

  // PUT /transactions/:id
  fastify.put('/transactions/:id', transactionsController.update.bind(transactionsController));

  // DELETE /transactions/:id
  fastify.delete('/transactions/:id', transactionsController.destroy.bind(transactionsController));
}