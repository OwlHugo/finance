import React from "react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { formatCurrency } from "../utils/formatCurrency";

interface CategorySummary {
  name: string;
  count: number;
  total: number;
  icon: React.ReactElement;
}

interface CategoryListProps {
  categories: CategorySummary[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-2">Categorias</h3>
      <Card className="bg-zinc-950 h-full rounded-xl">
        <CardContent className="p-4">
          <ScrollArea className="h-40">
            {categories.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 px-2 hover:bg-zinc-800 rounded transition-colors"
              >
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  {c.icon} {c.name}
                </div>
                <div className="text-sm text-zinc-400 font-mono">
                  {c.count} &nbsp; {formatCurrency(c.total)}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}