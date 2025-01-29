import { Button } from "../ui/button";
import { MdOutlineLogout } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/auth/useLogout";

const LogoutButton = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const { mutate, isPending } = useLogout();
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <Button type="button" onClick={onSubmit} disabled={isPending} className="w-fit rounded-full" variant="secondary">
      <MdOutlineLogout /> <span className={cn("hidden lg:block", isMobileNav && "block")}>Logout</span>
    </Button>
  );
};

export default LogoutButton;
