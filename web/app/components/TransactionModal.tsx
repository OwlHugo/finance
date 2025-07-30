"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Category, Bank } from "../services/api";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transaction: {
    description: string;
    category: string;
    value: number;
    date: string;
    bank: string;
  }) => void;
  categories: Category[];
  banks: Bank[];
}

export default function TransactionModal({ isOpen, onClose, onConfirm, categories, banks }: TransactionModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    value: "",
    date: "",
    bank: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.category && formData.value && formData.date && formData.bank) {
      onConfirm({
        description: formData.description,
        category: formData.category,
        value: parseFloat(formData.value),
        date: formData.date,
        bank: formData.bank,
      });
      setFormData({
        description: "",
        category: "",
        value: "",
        date: "",
        bank: "",
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      description: "",
      category: "",
      value: "",
      date: "",
      bank: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg shadow-lg" style={{ width: '600px', height: '595px' }}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-xl font-bold text-gray-50 ml-2">Nova Transação</h2>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-gray-400 ml-2 mb-4 text-sm">Inclua suas entradas e saídas sem complicações!</p>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-1">
                  Descrição da Transação
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zinc-200 transition-colors"
                  placeholder="Digite a descrição da transação"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-50 text-sm font-medium mb-1">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-200 transition-colors"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-50 text-sm font-medium mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zinc-200 transition-colors"
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-50 text-sm font-medium mb-1">
                  Banco
                </label>
                <select
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-200 transition-colors"
                  required
                >
                  <option value="">Selecione um banco</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-50 text-sm font-medium mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-200 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar Transação
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
