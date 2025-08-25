import React from "react";
import { Button } from "./ui/button";
import { Bell, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/redux";

const ActionMenu = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      <Button variant="ghost" size="sm" className="p-2 w-8 h-8">
        <Bell className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="sm" className="p-2 w-8 h-8">
        <MessageCircle className="w-5 h-5" />
      </Button>

      {user ? (
        <Button variant="ghost" size="sm" className="p-2 w-8 h-8">
          <User className="w-5 h-5" />
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default ActionMenu;
