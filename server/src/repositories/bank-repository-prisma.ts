import { Bank } from "../entities/transaction.js";
import { BankInterfaceRepository, CreateBankDTO } from "./bank-interface-repository.js";
import { prisma } from "../lib/prisma.js";

export class BankRepositoryPrisma implements BankInterfaceRepository {
  async findById(id: string): Promise<Bank | null> {
    const bank = await prisma.bank.findUnique({
      where: { id }
    });

    if (!bank) return null;

    return new Bank(
      bank.ispb,
      bank.name,
      bank.code,
      bank.fullName,
      bank.id,
      bank.createdAt,
      bank.updatedAt
    );
  }

  async findByName(name: string): Promise<Bank | null> {
    const bank = await prisma.bank.findUnique({
      where: { name }
    });

    if (!bank) return null;

    return new Bank(
      bank.ispb,
      bank.name,
      bank.code,
      bank.fullName,
      bank.id,
      bank.createdAt,
      bank.updatedAt
    );
  }

  async findByCode(code: string): Promise<Bank | null> {
    const bank = await prisma.bank.findUnique({
      where: { code }
    });

    if (!bank) return null;

    return new Bank(
      bank.ispb,
      bank.name,
      bank.code,
      bank.fullName,
      bank.id,
      bank.createdAt,
      bank.updatedAt
    );
  }

  async findAll(): Promise<Bank[]> {
    const banks = await prisma.bank.findMany({
      orderBy: { name: 'asc' }
    });

    return banks.map(bank => new Bank(
      bank.ispb,
      bank.name,
      bank.code,
      bank.fullName,
      bank.id,
      bank.createdAt,
      bank.updatedAt
    ));
  }

  async create(bank: CreateBankDTO): Promise<Bank> {
    const newBank = await prisma.bank.create({
      data: {
        ispb: bank.ispb,
        name: bank.name,
        code: bank.code,
        fullName: bank.fullName
      }
    });

    return new Bank(
      newBank.ispb,
      newBank.name,
      newBank.code,
      newBank.fullName,
      newBank.id,
      newBank.createdAt,
      newBank.updatedAt
    );
  }

  async update(bank: Bank): Promise<Bank> {
    const updatedBank = await prisma.bank.update({
      where: { id: bank.id },
      data: {
        ispb: bank.ispb,
        name: bank.name,
        code: bank.code,
        fullName: bank.fullName
      }
    });

    return new Bank(
      updatedBank.ispb,
      updatedBank.name,
      updatedBank.code,
      updatedBank.fullName,
      updatedBank.id,
      updatedBank.createdAt,
      updatedBank.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.bank.delete({
      where: { id }
    });
  }
} 