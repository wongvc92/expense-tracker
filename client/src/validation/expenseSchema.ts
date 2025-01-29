import { z } from "zod";

export const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number.parseFloat(val)), {
      message: "Amount must be a valid number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Amount must have at most 2 decimal places",
    })
    .refine((val) => Number.parseFloat(val) <= 1_000_000_000, {
      message: "Amount must not exceed 1 billion",
    }),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
});

export type TExpenseSchema = z.infer<typeof expenseSchema>;
