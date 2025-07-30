import { FastifyReply, FastifyRequest } from 'fastify';
import { BankRepositoryPrisma } from '../repositories/bank-repository-prisma.js';
import { CreateBankService } from '../services/banks/create-bank-service.js';
import { GetBankService } from '../services/banks/get-bank-service.js';
import { GetAllBanksService } from '../services/banks/get-all-banks-service.js';
import { UpdateBankService } from '../services/banks/update-bank-service.js';
import { DeleteBankService } from '../services/banks/delete-bank-service.js';

export class BanksController {
  private bankRepository: BankRepositoryPrisma;
  private createBankService: CreateBankService;
  private getBankService: GetBankService;
  private getAllBanksService: GetAllBanksService;
  private updateBankService: UpdateBankService;
  private deleteBankService: DeleteBankService;

  constructor() {
    this.bankRepository = new BankRepositoryPrisma();
    this.createBankService = new CreateBankService(this.bankRepository);
    this.getBankService = new GetBankService(this.bankRepository);
    this.getAllBanksService = new GetAllBanksService(this.bankRepository);
    this.updateBankService = new UpdateBankService(this.bankRepository);
    this.deleteBankService = new DeleteBankService(this.bankRepository);
  }

  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const banks = await this.getAllBanksService.execute();
      return reply.send(banks);
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
        return reply.status(400).send({ error: 'ID do banco é obrigatório' });
      }

      const bank = await this.getBankService.execute(id);
      
      if (!bank) {
        return reply.status(404).send({ error: 'Banco não encontrado' });
      }
      
      return reply.send(bank);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao buscar banco',
        message: (error as Error).message 
      });
    }
  }

  async store(request: FastifyRequest<{ 
    Body: { 
      ispb: string; 
      name: string; 
      code: string; 
      fullName: string; 
    } 
  }>, reply: FastifyReply) {
    try {
      const { ispb, name, code, fullName } = request.body;

      if (!ispb || ispb.trim() === '') {
        return reply.status(400).send({ error: 'ISPB é obrigatório' });
      }

      if (!name || name.trim() === '') {
        return reply.status(400).send({ error: 'Nome do banco é obrigatório' });
      }

      if (!code || code.trim() === '') {
        return reply.status(400).send({ error: 'Código do banco é obrigatório' });
      }

      if (!fullName || fullName.trim() === '') {
        return reply.status(400).send({ error: 'Nome completo do banco é obrigatório' });
      }

      const bank = await this.createBankService.execute(ispb, name, code, fullName);
      return reply.status(201).send(bank);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao criar banco',
        message: (error as Error).message 
      });
    }
  }

  async update(request: FastifyRequest<{ 
    Params: { id: string }; 
    Body: { 
      ispb?: string; 
      name?: string; 
      code?: string; 
      fullName?: string; 
    } 
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { ispb, name, code, fullName } = request.body;

      if (!id) {
        return reply.status(400).send({ error: 'ID do banco é obrigatório' });
      }

      if (ispb !== undefined && ispb.trim() === '') {
        return reply.status(400).send({ error: 'ISPB não pode estar vazio' });
      }

      if (name !== undefined && name.trim() === '') {
        return reply.status(400).send({ error: 'Nome do banco não pode estar vazio' });
      }

      if (code !== undefined && code.trim() === '') {
        return reply.status(400).send({ error: 'Código do banco não pode estar vazio' });
      }

      if (fullName !== undefined && fullName.trim() === '') {
        return reply.status(400).send({ error: 'Nome completo do banco não pode estar vazio' });
      }

      const bank = await this.updateBankService.execute(id, ispb, name, code, fullName);
      return reply.send(bank);
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao atualizar banco',
        message: (error as Error).message 
      });
    }
  }

  async destroy(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      if (!id) {
        return reply.status(400).send({ error: 'ID do banco é obrigatório' });
      }

      await this.deleteBankService.execute(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ 
        error: 'Erro ao deletar banco',
        message: (error as Error).message 
      });
    }
  }
} 