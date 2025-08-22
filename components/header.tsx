"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppSelector } from "@/lib/hooks/redux"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAppSelector((state) => state.auth)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-foreground">PinClone</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <Link href="/" className="text-foreground hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/following" className="text-muted-foreground hover:text-primary font-medium">
              Following
            </Link>
            <Link href="/people" className="text-muted-foreground hover:text-primary font-medium">
              People
            </Link>
            <Link href="/create" className="text-muted-foreground hover:text-primary font-medium">
              Create
            </Link>
            <Link href="/boards" className="text-muted-foreground hover:text-primary font-medium">
              Boards
            </Link>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for ideas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-0 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

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
