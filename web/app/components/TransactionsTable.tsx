import React from "react";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../utils/formatCurrency";
import { Transaction } from "../services/api";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold">Transações</h3>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center table-fixed border-separate border-spacing-0">
              <thead>
                <tr className="text-gray-500">
                  <th className="w-1/5 px-2 sm:px-8 py-2 text-left min-w-[120px]">Descrição</th>
                  <th className="w-1/10 px-2 sm:px-4 py-2 min-w-[80px]">Tipo</th>
                  <th className="w-1/10 px-2 sm:px-4 py-2 min-w-[90px]">Valor</th>
                  <th className="w-1/10 px-2 sm:px-4 py-2 min-w-[80px]">Banco</th>
                  <th className="w-1/10 px-2 sm:px-4 py-2 min-w-[80px]">Data</th>
                  <th className="w-1/10 px-2 sm:px-4 py-2 min-w-[80px]">Categoria</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <React.Fragment key={t.id || idx}>
                    <tr
                      className="bg-zinc-950 text-zinc-200"
                    >
                      <td className="bg-zinc-950 rounded-l-xl min-w-[120px]">
                        <div className="flex items-center gap-1 sm:gap-2 py-2 px-1 sm:px-2">
                          <ShoppingCart 
                            size={14} 
                            className="text-zinc-300 flex-shrink-0" 
                          />
                          <span className="truncate text-xs sm:text-sm">
                            {t.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 bg-zinc-950 text-xs sm:text-sm">
                        {t.type === 'income' ? 'Receita' : 'Despesa'}
                      </td>
                      <td
                        className={`font-mono px-2 sm:px-4 py-2 bg-zinc-950 text-xs sm:text-sm ${
                          t.type === "income"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-2 sm:px-4 py-2 bg-zinc-950 text-xs sm:text-sm">{t.bank.name}</td>
                      <td className="px-2 sm:px-4 py-2 bg-zinc-950 text-xs sm:text-sm">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-2 sm:px-4 py-2 bg-zinc-950 rounded-r-xl text-xs sm:text-sm">
                        {t.category.icon} {t.category.name}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="bg-zinc-900 h-2"></td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
