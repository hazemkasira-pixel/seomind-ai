import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal" />
            <span className="font-bold text-foreground">SEOMind AI</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link 
              href="/privacy" 
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SEOMind AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}