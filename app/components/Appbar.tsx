"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Radio as RadioIcon } from "lucide-react"
import Link from "next/link"

export function Appbar() {
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <RadioIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">StreamSync</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#benefits"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Benefits
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signIn()}
              >
                Log in
              </Button>
            )}
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
