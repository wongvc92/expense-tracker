import { AddIncomeFormProvider } from "@/hooks/income/useAddIncomeFormModal";
import ExpenseDashboard from "../common/ExpenseDashboard";

const HomePage = () => {
  return (
    <AddIncomeFormProvider>
      <div className="flex flex-col">
        <div>
          <ExpenseDashboard />
        </div>
      </div>
    </AddIncomeFormProvider>
  );
};

export default HomePage;
