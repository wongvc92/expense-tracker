export interface ICategory {
    id: number;
    name: string;
  }
  
  export interface IExpense {
    id: string;
    userId: string;
    amount: number;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    category: ICategory;
  }
  
  export interface IIncome {
    id: string;
    userId: string;
    amount: number;
    source: string;
    date: string;
  }
  
  export interface ITransaction {
    id: string;
    amount: number;
    transactionType: "income" | "expense";
    incomeId: string | null;
    expenseId: string | null;
    income?: IIncome | null;
    expense?: IExpense | null;
    date: string;
  }
  