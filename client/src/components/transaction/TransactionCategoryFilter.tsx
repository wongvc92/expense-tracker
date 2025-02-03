import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";

const categories = [
  { name: "transportation", url: "1" },
  { name: "food", url: "4" },
  { name: "utilities", url: "3" },
  { name: "entertainment", url: "2" },
] as const;

const TransactionCategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleOpen, setToggleOpen] = useState(false);

  // Get selected categories
  const selectedCategories = searchParams.getAll("category");

  const handleSetUrl = (isChecked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (isChecked) {
      // Append if checked
      params.append("category", value);
    } else {
      // Remove only the selected value
      const updatedCategories = selectedCategories.filter((item) => item !== value);
      params.delete("category");
      updatedCategories.forEach((cat) => params.append("category", cat)); // Re-add remaining selected items
    }

    setSearchParams(params);
  };

  return (
    <DropdownMenu open={toggleOpen} onOpenChange={setToggleOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-1 border-dashed rounded-full text-muted-foreground text-xs"
          size="sm"
        >
          Category <span className="text-muted-foreground text-[10px] text-sky-300 font-bold">{selectedCategories.join(", ")}</span>
          <ChevronDown className={toggleOpen ? "rotate-180 transition duration-300" : "transition duration-300"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {categories.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            className="capitalize text-muted-foreground text-xs"
            checked={selectedCategories.includes(item.url)}
            onCheckedChange={(isChecked) => handleSetUrl(isChecked, item.url)}
          >
            {item.name.split("_").join(" ")}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionCategoryFilter;
