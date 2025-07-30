    const API_BASE_URL = 'http://localhost:3000';

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Bank {
  id: string;
  ispb: string;
  name: string;
  code: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  type: 'expense' | 'income';
  amount: number;
  bank: Bank;
  category: Category;
  date: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async createCategory(data: { name: string; icon?: string }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Banks
  async getBanks(): Promise<Bank[]> {
    return this.request<Bank[]>('/banks');
  }

  async createBank(data: { ispb: string; name: string; code: string; fullName: string }): Promise<Bank> {
    return this.request<Bank>('/banks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }

  async createTransaction(data: {
    description: string;
    type: 'expense' | 'income';
    amount: number;
    bankId: string;
    categoryId: string;
    date: string;
  }): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(); 