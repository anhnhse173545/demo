'use client'

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, UserPlus } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img
              onClick={() => navigate("/")}
              src="https://png.pngtree.com/png-vector/20220719/ourmid/pngtree-vector-illustration-of-a-koi-fish-yin-yang-concept-design-vector-png-image_37993206.png"
              alt="KOSJapan logo"
              className="h-12 w-auto cursor-pointer"
            />
            <nav className="hidden md:flex ml-10 space-x-8">
              <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
              {user && (
                <Button variant="ghost" onClick={() => navigate(`/payment/${user.id}`)}>My Booking</Button>
              )}
              <Button variant="ghost" onClick={() => navigate(`/contact/${user.id}`)}>Request</Button>
              <Button variant="ghost" onClick={() => navigate("/farm-view")}>Koi Farm</Button>
              <Button variant="ghost" onClick={() => navigate("/trip-view")}>Koi Trip</Button>
              <Button variant="ghost" onClick={() => navigate("/aboutus")}>About Us</Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="mr-4 text-sm">
                <span className="font-medium">Welcome, {user.name}!</span>
              </div>
            )}
            {user ? (
              <>
                {/* <Button
                  variant="ghost"
                  onClick={() => navigate("/mykoi")}
                >
                  My Koi
                </Button> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.mediaUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/userDetail")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/payment")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Trip</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/mykoi")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Koi</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/history")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Order History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  <User className="mr-2 h-4 w-4" />
                  Log in
                </Button>
                <Button variant="outline" onClick={() => navigate("/register")}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}