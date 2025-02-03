import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSearchParams } from "react-router";
import { ChevronDown } from "lucide-react";

const sortingOptions = [
  { label: "Date (Newest First)", value: "date-desc" },
  { label: "Date (Oldest First)", value: "date-asc" },
  { label: "Amount (Highest First)", value: "amount-desc" },
  { label: "Amount (Lowest First)", value: "amount-asc" },
  { label: "Category (A-Z)", value: "category-asc" },
  { label: "Category (Z-A)", value: "category-desc" },
];

const TransactionSorting = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    const [sortBy, sortOrder] = sortValue.split("-");
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    setSearchParams(params);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center justify-center gap-1 border-dashed rounded-full text-muted-foreground text-xs">
          Sort By <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sortingOptions.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => handleSortChange(option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionSorting;
