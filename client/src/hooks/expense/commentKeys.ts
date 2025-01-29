export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "lists"] as const,
  list: (expenseId: string) => [...expenseKeys.lists(), expenseId] as const,
  details: () => [...expenseKeys.all, "details"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};
