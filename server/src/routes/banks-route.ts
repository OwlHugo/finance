import { FastifyInstance } from "fastify";
import { BanksController } from "../controllers/banks-controller.js";

const banksController = new BanksController();

export async function banksRoutes(fastify: FastifyInstance) {
  // GET /banks
  fastify.get("/banks", banksController.index.bind(banksController));

  // GET /banks/:id
  fastify.get("/banks/:id", banksController.show.bind(banksController));

  // POST /banks
  fastify.post("/banks", banksController.store.bind(banksController));

  // PUT /banks/:id
  fastify.put("/banks/:id", banksController.update.bind(banksController));

  // DELETE /banks/:id
  fastify.delete("/banks/:id", banksController.destroy.bind(banksController));
}
