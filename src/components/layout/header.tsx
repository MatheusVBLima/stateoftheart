"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const navigationItems = [
    { href: "/categories", label: "Categories" },
    { href: "/trending", label: "Trending" },
    { href: "/implementations", label: "Implementations" },
    { href: "/stack-filter", label: "Stack Filter" },
    ...(isSignedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">State Of The Art</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center h-14">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-4 h-full flex items-center text-sm font-medium
                    border-b-2 border-transparent transition-all duration-200
                    hover:text-primary hover:border-primary
                    ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Side Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          {isSignedIn ? (
            <>
              <Button size="sm" className="px-4" asChild>
                <Link href="/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit
                </Link>
              </Button>
              <ModeToggle />
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <ModeToggle />
              <Button size="sm" asChild>
                <Link href="/sign-up">Join Community</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden flex-1 justify-end items-center space-x-2">
          <ModeToggle />
          {isSignedIn && (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1 text-lg font-medium transition-colors hover:text-foreground/80"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4 px-1">
                  {isSignedIn ? (
                    <Button size="sm" className="w-full px-4" asChild>
                      <Link href="/submit">
                        <Plus className="mr-2 h-4 w-4" />
                        Submit
                      </Link>
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                      <Button size="sm" className="w-full" asChild>
                        <Link href="/sign-up">Join Community</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
