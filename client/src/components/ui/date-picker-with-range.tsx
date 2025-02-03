import * as React from "react";
import { format, subWeeks } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSearchParams } from "react-router";

interface DatePickerWithRangeProps {
  className?: string;
  title: string;
}
export function DatePickerWithRange({ className, title }: DatePickerWithRangeProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFrom = searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : subWeeks(new Date(), 2);
  const initialTo = searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : new Date();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialFrom,
    to: initialTo,
  });

  const updateSearchParams = (selectedDate: DateRange | undefined) => {
    if (selectedDate?.from && selectedDate?.to) {
      // Only update if both dates are set
      const params = new URLSearchParams(searchParams.toString());
      params.set("dateFrom", selectedDate.from.toISOString());
      params.set("dateTo", selectedDate.to.toISOString());
      setSearchParams(params);
    }
  };

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);

    // Ensure both `from` and `to` exist before updating query params
    if (selectedDate?.from && selectedDate?.to) {
      updateSearchParams(selectedDate);
    }
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id="date"
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal rounded-full border border-dashed text-xs text-muted-foreground",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yy")} - {format(date.to, "dd/MM/yy")}
                </>
              ) : (
                format(date.from, "dd/MM/yy")
              )
            ) : (
              <span>{title}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={1}
            className="text-xs text-muted-foreground"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
