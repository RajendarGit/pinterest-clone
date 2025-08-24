"use client"

import Link from "next/link"
import { Bell, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks/redux"
import Image from "next/image"

export function Header() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="PinClone" width={100} height={40} />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <Link href="/" className="text-foreground hover:text-primary font-medium">Home</Link>
            <Link href="/following" className="text-muted-foreground hover:text-primary font-medium">Following</Link>
            <Link href="/people" className="text-muted-foreground hover:text-primary font-medium">People</Link>
            <Link href="/create" className="text-muted-foreground hover:text-primary font-medium">Create</Link>
            <Link href="/boards" className="text-muted-foreground hover:text-primary font-medium">Boards</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="rounded-full p-2">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full p-2">
              <MessageCircle className="w-5 h-5" />
            </Button>

            {user ? (
              <Button variant="ghost" size="sm" className="rounded-full p-2">
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
