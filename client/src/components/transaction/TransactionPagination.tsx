import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useGetAllTransactions } from "@/hooks/transaction/useGetAllTransactions";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router";

const TransactionPagination = () => {
  const { data } = useGetAllTransactions();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!data) return null; // Prevent errors if data is undefined

  const totalPages = data.totalPages;
  const currentPage = Number(searchParams.get("page")) || 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams); // Clone existing params
      params.set("page", page.toString()); // Update page
      params.set("limit", "5"); // Update limit
      setSearchParams(params);
    }
  };

  // Get pages dynamically (3 pages at a time)
  const getPageNumbers = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(currentPage - 1)}
            className={cn("cursor-pointer", currentPage === 1 && "pointer-events-none opacity-0")}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink onClick={() => goToPage(page)} isActive={currentPage === page} className="cursor-pointer">
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(currentPage + 1)}
            className={cn("cursor-pointer", currentPage === totalPages && "pointer-events-none opacity-0")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TransactionPagination;
