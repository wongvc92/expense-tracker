import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addIncomeSchema, TAddIncomeSchema } from "@/validation/incomeSchema";
import { useAddIncome } from "@/hooks/income/useAddIncome";

export default function AddIncomeForm() {
  const { mutate, isPending } = useAddIncome();
  const form = useForm<TAddIncomeSchema>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: { amount: 0, source: "" },
  });

  const onSubmit = (values: TAddIncomeSchema) => {
    mutate(values, { onSuccess: () => form.reset() });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Add Income</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount Field */}
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source Field */}
          <FormField
            name="source"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Income"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
