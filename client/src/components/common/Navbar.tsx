import LogoutButton from "../auth/logout-button";
import ProfileImage from "../profile/profile-image";
import { useAuth } from "@/context/auth";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const Navbar = () => {
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  return (
    <nav className="bg-background p-4 w-full">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}

        {isMobile && <SidebarTrigger />}
        {/* Navigation Links */}

        {/* User Actions */}

        {/* Profile Dropdown */}
        <Popover>
          <PopoverTrigger asChild className="ml-auto">
            <button className="focus:outline-none">
              <ProfileImage username={user?.userName || "Guest"} image={user?.profileImage || ""} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-white shadow-lg rounded-md p-2">
            <LogoutButton />
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
