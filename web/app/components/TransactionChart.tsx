"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "../services/api";
import { Card, CardContent } from "./ui/card";

interface TransactionChartProps {
  transactions: Transaction[];
}

export default function TransactionChart({
  transactions,
}: TransactionChartProps) {
  // Agrupar transações por categoria
  const categoryData = transactions.reduce<Record<string, number>>(
    (acc, transaction) => {
      const categoryName = transaction.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
      return acc;
    },
    {}
  );

  // Converter para formato do chart
  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    category: name,
    expenses: value,
  }));

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        <p>Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart por Categoria */}
      {chartData.length > 0 && (
        <div>
          <Card className="border-none">
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => value.slice(0, 10)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                    formatter={(value: number) => [
                      `R$ ${value.toFixed(2)}`,
                      "Valor",
                    ]}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
