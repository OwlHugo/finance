"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Utensils } from "lucide-react";
import { formatCurrency } from "./utils/formatCurrency";
import { apiService, Transaction, Category, Bank } from "./services/api";

import SummaryCard from "./components/SummaryCard";
import CategoryList from "./components/CategoryList";
import TransactionsTable from "./components/TransactionsTable";
import FloatingButton from "./components/FloatingButton";
import AnalysisCard from "./components/AnalysisCard";
import PiggyBankIcon from "./components/PiggyBankIcon";
import TransactionModal from "./components/TransactionModal";

interface CategorySummary {
  name: string;
  count: number;
  total: number;
  icon: React.ReactElement;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar dados do backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [transactionsData, categoriesData, banksData] = await Promise.all([
          apiService.getTransactions(),
          apiService.getCategories(),
          apiService.getBanks(),
        ]);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
        setBanks(banksData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTransaction = async (newTransaction: {
    description: string;
    category: string;
    value: number;
    date: string;
    bank: string;
  }) => {
    try {
      // Encontrar o banco e categoria pelos nomes
      const bank = banks.find(b => b.name === newTransaction.bank);
      const category = categories.find(c => c.name === newTransaction.category);

      if (!bank || !category) {
        throw new Error('Banco ou categoria não encontrado');
      }

      const transactionData = {
        description: newTransaction.description,
        type: 'income' as 'expense' | 'income', // Por padrão como receita
        amount: newTransaction.value,
        bankId: bank.id,
        categoryId: category.id,
        date: newTransaction.date,
      };

      const createdTransaction = await apiService.createTransaction(transactionData);
      setTransactions(prev => [...prev, createdTransaction]);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  const entradas = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const saidas = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const saldo = entradas - saidas;

  const categorias: CategorySummary[] = Object.values(
    transactions.reduce<Record<string, CategorySummary>>((acc, t) => {
      if (!acc[t.category.name]) {
        acc[t.category.name] = {
          name: t.category.name,
          count: 1,
          total: t.amount,
          icon: t.category.icon ? (
            <span className="text-lg">{t.category.icon}</span>
          ) : (
            <ShoppingCart size={14} />
          ),
        };
      } else {
        acc[t.category.name].count++;
        acc[t.category.name].total += t.amount;
      }
      return acc;
    }, {})
  );

  if (loading) {
    return (
      <div className="p-6 space-y-8 mt bg-zinc-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddTransaction}
        categories={categories}
        banks={banks}
      />
      <div className="p-6 space-y-8 mt bg-zinc-900 text-white min-h-screen">
        <div className="mx-12 mt-10">
          {/* Header com porquinho e botão de criar */}
          <div className="flex justify-between -mx-12 items-center mb-6">
            <PiggyBankIcon />
            <FloatingButton onClick={() => setIsModalOpen(true)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard title="Entradas" value={entradas} color="green" />
            <SummaryCard title="Saídas" value={saidas} color="red" />
            <SummaryCard
              title="Balanço"
              value={saldo}
              color="green"
              description="Somada todas as entradas e saídas do período."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
            <div className="lg:col-span-3">
              <AnalysisCard transactions={transactions} />
            </div>
            <div className="lg:col-span-1">
              <CategoryList categories={categorias} />
            </div>
          </div>
        <div className="mt-4">
          <TransactionsTable transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  );
}