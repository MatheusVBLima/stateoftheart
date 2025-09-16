"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold text-xl sm:inline-block">
              State Of The Art
            </span>
          </Link>
          <nav
            className="flex items-center space-x-6 text-sm font-medium"
            aria-label="Main navigation"
            id="main-navigation"
          >
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Categories
            </Link>
            <Link
              href="/trending"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Trending
            </Link>
            <Link
              href="/implementations"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Implementations
            </Link>
            <Link
              href="/stack-filter"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Stack Filter
            </Link>
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 px-2"
                  aria-label="More navigation options"
                  aria-haspopup="true"
                >
                  More
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/guidelines">Guidelines</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/api">API</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <span className="font-bold">State Of The Art</span>
            </Link>
          </div>
          <nav
            className="flex items-center space-x-2"
            aria-label="User actions"
          >
            <ModeToggle />
            {isSignedIn ? (
              <>
                <Button size="sm" asChild>
                  <Link href="/submit">
                    <Plus />
                    Submit
                  </Link>
                </Button>
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
                <Button size="sm" asChild>
                  <Link href="/sign-up">Join Community</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
