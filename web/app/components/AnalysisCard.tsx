import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardContent } from "./ui/card";
import TransactionChart from "./TransactionChart";
import { Transaction } from "../services/api";

interface AnalysisCardProps {
  transactions: Transaction[];
}

export default function AnalysisCard({ transactions }: AnalysisCardProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-2">Análise</h3>
      <Card className="bg-zinc-950 h-full rounded-xl">
        <CardContent className="p-4">
          <ScrollArea className="h-[500px]">
            <TransactionChart transactions={transactions} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
