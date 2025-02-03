import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { subWeeks } from "date-fns";
import { Home, PieChart, PlusCircle, Settings } from "lucide-react";

export function AppSidebar() {
  const { open, isMobile } = useSidebar();
  // Menu items.
  const items = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: PlusCircle, label: "Add Expense", href: "/expenses/add" },
    { icon: PieChart, label: "Reports", href: "/reports" },
    { icon: PieChart, label: "Transaction", href: `/transactions?page=1&limit=5&dateFrom=${subWeeks(new Date(), 2)}&dateTo=${new Date()}` },
    { icon: Settings, label: "Settings", href: "/auth/settings" },
  ];
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="text-xl font-bold text-primary flex items-center">
          <h3 className={cn(open ? "block" : "hidden")}>ExpenseTracker</h3> <SidebarTrigger className={cn(open && "ml-auto", isMobile && "hidden")} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
