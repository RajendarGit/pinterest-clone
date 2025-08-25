"use client";
import Logo from "./logo";
import NavigationMenu from "./navigation-menu";
import ActionMenu from "./action-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />
          {/* Navigation */}
          <NavigationMenu />
          {/* Actions */}
          <ActionMenu />
        </div>
      </div>
    </header>
  );
}
