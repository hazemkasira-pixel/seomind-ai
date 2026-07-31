import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple/10">
          <Search className="h-10 w-10 text-purple" />
        </div>
        
        <h1 className="text-6xl font-bold text-foreground mb-3">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-purple px-8 py-3 text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}