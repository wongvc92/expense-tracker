import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router";
import Modal from "../ui/modal";
import AddIncomeForm from "../income/AddIncomeForm";
import { useAddIncomeForm } from "@/hooks/income/useAddIncomeFormModal";
import { useAuth } from "@/context/auth";
import TransactionList from "../transaction/TransactionList";

const ExpenseDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, closeModal, openModal } = useAddIncomeForm();
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => closeModal()}>
        <AddIncomeForm />
      </Modal>
      <div className="p-4 md:p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Expense Tracker</h1>
          <Button size="sm" type="button" onClick={() => navigate({ pathname: "/expenses/add" })}>
            Add Expense
          </Button>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{user?.balance || 0}</p>
            </CardContent>
          </Card>
          <Card onClick={() => openModal()}>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{user?.totalIncome || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">$460.00</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Transactions and Analysis */}
        <Tabs defaultValue="transactions">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="space-y-4">
              <TransactionList />
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis">
            <div>
              <h3 className="text-lg font-bold mb-4">Monthly Spending</h3>
              <Progress value={75} className="mb-4" />
              <p className="text-sm text-muted-foreground">You have used 75% of your monthly budget.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ExpenseDashboard;
