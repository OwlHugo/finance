import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../utils/formatCurrency";

interface SummaryCardProps {
  title: string;
  value: number;
  color: "green" | "red";
  description?: string;
}

export default function SummaryCard({ title, value, color, description }: SummaryCardProps) {
  return (
    <Card className="bg-zinc-950 rounded-xl">
      <CardContent className="p-4">
        <h2 className="text-sm text-gray-50">{title}</h2>
        <p className={`text-2xl ${color === "green" ? "text-emerald-400" : "text-red-400"} font-mono font-semibold`}>
          {formatCurrency(value)}
        </p>
        <p className="text-xs text-zinc-500">
          {description || `Somada todas as ${title.toLowerCase()} do período.`}
        </p>
      </CardContent>
    </Card>
  );
}