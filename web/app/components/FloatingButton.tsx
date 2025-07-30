import { CirclePlus } from "lucide-react";

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <div className="mr-14">
      <button 
        onClick={onClick}
        className="bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-md shadow-lg w-8 h-8 flex items-center justify-center"
        aria-label="Add new transaction"
      >
        <CirclePlus size={16} className="text-black" />
      </button>
    </div>
  );
}