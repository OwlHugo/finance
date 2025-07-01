import { FastifyInstance } from "fastify";
import { BankRepositoryPrisma } from "../repositories/bank-repository-prisma.js";
import { CreateBankService } from "../services/banks/create-bank-service.js";
import { GetBankService } from "../services/banks/get-bank-service.js";
import { GetAllBanksService } from "../services/banks/get-all-banks-service.js";
import { UpdateBankService } from "../services/banks/update-bank-service.js";
import { DeleteBankService } from "../services/banks/delete-bank-service.js";

const bankRepository = new BankRepositoryPrisma();
const createBankService = new CreateBankService(bankRepository);
const getBankService = new GetBankService(bankRepository);
const getAllBanksService = new GetAllBanksService(bankRepository);
const updateBankService = new UpdateBankService(bankRepository);
const deleteBankService = new DeleteBankService(bankRepository);

export async function banksRoutes(fastify: FastifyInstance) {
  // GET /banks
  fastify.get("/banks", async function handler(request, reply) {
    try {
      const banks = await getAllBanksService.execute();
      return reply.send(banks);
    } catch (error) {
      return reply.status(500).send({ error: (error as Error).message });
    }
  });

  // GET /banks/:id
  fastify.get("/banks/:id", async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      const bank = await getBankService.execute(id);

      if (!bank) {
        return reply.status(404).send({ error: "Bank not found" });
      }

      return reply.send(bank);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // POST /banks
  fastify.post("/banks", async function handler(request, reply) {
    try {
      const { ispb, name, code, fullName } = request.body as {
        ispb: string;
        name: string;
        code: string;
        fullName: string;
      };
      const bank = await createBankService.execute(ispb, name, code, fullName);
      return reply.status(201).send(bank);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // PUT /banks/:id
  fastify.put("/banks/:id", async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      const { ispb, name, code, fullName } = request.body as {
        ispb?: string;
        name?: string;
        code?: string;
        fullName?: string;
      };
      const bank = await updateBankService.execute(
        id,
        ispb,
        name,
        code,
        fullName
      );
      return reply.send(bank);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // DELETE /banks/:id
  fastify.delete("/banks/:id", async function handler(request, reply) {
    try {
      const { id } = request.params as { id: string };
      await deleteBankService.execute(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
}
