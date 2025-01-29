import { z } from "zod";

// Define Zod Schema for validation
export const addIncomeSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  source: z.string().min(3, "Source must be at least 3 characters"),
});

export type TAddIncomeSchema = z.infer<typeof addIncomeSchema>;
