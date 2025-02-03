import TransactionCategoryFilter from "./TransactionCategoryFilter";
import TransactionDateFilter from "./TransactionDateFilter";
import TransactionList from "./TransactionList";
import TransactionPagination from "./TransactionPagination";
import TransactionSort from "./TransactionSort";

const TransactionPage = () => {
  return (
    <div className="px-4 space-y-2 h-screen">
      <div className="flex flex-wrap justify-start gap-2">
        <TransactionDateFilter />
        <TransactionCategoryFilter />
        <TransactionSort />
      </div>
      <TransactionList />
      <TransactionPagination />
    </div>
  );
};

export default TransactionPage;
