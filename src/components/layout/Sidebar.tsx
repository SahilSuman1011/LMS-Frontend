import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Users,
  Phone,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarLink = ({
  to,
  icon,
  label,
  isActive,
  isCollapsed = false,
}: SidebarLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3",
                isCollapsed ? "justify-center px-2" : "",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <span className="shrink-0">{icon}</span>
              {!isCollapsed && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  userRole?: "admin" | "user";
}

const Sidebar = ({ userRole = "user" }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinks = [
    {
      to: "/",
      icon: <Home size={20} />,
      label: "Dashboard",
      showFor: ["admin", "user"],
    },
    {
      to: "/leads",
      icon: <Users size={20} />,
      label: "Leads",
      showFor: ["admin", "user"],
    },
    {
      to: "/calls",
      icon: <Phone size={20} />,
      label: "Calls",
      showFor: ["admin", "user"],
    },
    {
      to: "/follow-ups",
      icon: <Calendar size={20} />,
      label: "Follow-ups",
      showFor: ["admin", "user"],
    },
    {
      to: "/admin",
      icon: <BarChart3 size={20} />,
      label: "Admin Panel",
      showFor: ["admin"],
    },
    {
      to: "/settings",
      icon: <Settings size={20} />,
      label: "Settings",
      showFor: ["admin", "user"],
    },
  ];

  const filteredLinks = navLinks.filter((link) =>
    link.showFor.includes(userRole),
  );

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-card p-3 shadow-md transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[250px]",
      )}
    >
      <div className="flex items-center justify-between py-4">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-primary">Lead Manager</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="mt-6 space-y-1">
        {filteredLinks.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isActive={currentPath === link.to}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div className="mt-auto pb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive",
                  isCollapsed ? "justify-center px-2" : "",
                )}
              >
                <LogOut size={20} />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Logout</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
