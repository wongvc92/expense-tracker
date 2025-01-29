import React from "react";
import { Button, ButtonProps } from "../ui/button";

import { cn } from "@/lib/utils";
import Spinner from "../ui/spinner";

interface SubmitButtonProps extends ButtonProps {
  isLoading: boolean;
  isLoadingTitle?: string;
  defaultTitle?: string;
  Icon?: React.ReactElement;
  hideTitle?: boolean;
}
const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isLoadingTitle, defaultTitle, Icon, hideTitle = false, ...props }) => {
  return (
    <Button type="submit" disabled={props.disabled || isLoading} className={cn("text-sm", props.className)} variant={props.variant}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner />
          <span className={cn("block", hideTitle && "hidden")}>{isLoadingTitle}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {Icon &&
            React.cloneElement(Icon, {
              className: "w-10 h-10",
            })}
          <span className={cn("block", hideTitle && "hidden")}>{defaultTitle}</span>
        </div>
      )}
    </Button>
  );
};

export default SubmitButton;
