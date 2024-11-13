"use client";

import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  LogOut,
  Bell,
  MapPin,
  ClipboardList,
  Menu,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/contexts/AuthContext";

export default function ConsultingStaffDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleNav = () => setIsNavExpanded(!isNavExpanded);

  const fetchStaffDetails = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:8080/accounts/${user.id}/detail`
      );
      if (!response.ok) throw new Error("Failed to fetch staff details");
      const data = await response.json();
      console.log("Staff details:", data);
      setStaff(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch staff details:", error);
      setError("Failed to load staff details. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStaffDetails();
    }
  }, [user]);

  const navItems = [
    {
      name: "Home",
      icon: <Home className="h-5 w-5" />,
      path: `/cs-dashboard/${staff?.id || ""}`,
    },
    {
      name: "Tour List",
      icon: <MapPin className="h-5 w-5" />,
      path: `/cs-dashboard/tour-list/${staff?.id || ""}`,
    },
    {
      name: "Order List",
      icon: <ClipboardList className="h-5 w-5" />,
      path: `/cs-dashboard/order-list/${staff?.id || ""}`,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <nav
        className={`flex flex-col justify-between bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isNavExpanded ? "w-64" : "w-20"
        }`}
      >
        <div>
          <div className="p-4 flex justify-between items-center">
            {isNavExpanded && (
              <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                KOSJapan
              </span>
            )}
            <Button
              onClick={toggleNav}
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400"
            >
              {isNavExpanded ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
          <ul className="space-y-2 mt-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  >
                    {item.icon}
                    {isNavExpanded && <span className="ml-3">{item.name}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center">
              <span className="text-sm text-red-500 dark:text-red-400">
                {error}
              </span>
            </div>
          ) : staff ? (
            isNavExpanded ? (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={staff.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={staff.name}
                  />
                  <AvatarFallback>
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {staff.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {staff.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="ml-auto"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-auto py-2"
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          staff.avatar || "/placeholder.svg?height=32&width=32"
                        }
                        alt={staff.name}
                      />
                      <AvatarFallback>
                        {staff.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{staff.name}</DropdownMenuLabel>
                  <DropdownMenuItem>{staff.role}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : null}
        </div>
      </nav>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Consulting Staff Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 dark:text-gray-400"
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
