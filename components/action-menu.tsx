import React from "react";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { clearAuth } from "@/lib/store/slices/authSlice";

const ActionMenu = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(clearAuth());
  }

  return (
    <div className="flex items-center space-x-2 relative">
      {user ? (
        <Button
          variant="ghost"
          size="sm"
          className="p-2 w-8 h-8 hover:bg-transparent hover:text-primary"
          onClick={handleSignOut}
        >
          <User className="w-5 h-5" /> {user.username} <LogOut className="w-4 h-4 ml-1" />
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
