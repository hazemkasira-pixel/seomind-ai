import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">SEO</span>
              <span className="text-xl font-bold text-teal">Mind</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered SEO analysis and content automation for modern businesses.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>
          </div>

          {/* Social - باستخدام SVG مباشر لتجنب أخطاء الاستيراد */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ✅ Powered by Groq Section */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with cutting-edge AI technology</span>
            </div>
            
            <a 
              href="https://groq.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/40 hover:scale-105 transition-all group"
            >
              <span className="text-xs text-muted-foreground">Powered by</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 120 30" 
                className="h-5 w-auto"
                fill="none"
              >
                <path 
                  d="M15.5 0C6.94 0 0 6.94 0 15.5S6.94 31 15.5 31 31 24.06 31 15.5 24.06 0 15.5 0zm0 28C8.6 28 3 22.4 3 15.5S8.6 3 15.5 3 28 8.6 28 15.5 22.4 28 15.5 28z" 
                  fill="#F55036"
                />
                <path 
                  d="M15.5 8c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5S19.64 8 15.5 8zm0 12c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" 
                  fill="#F55036"
                />
                <text 
                  x="35" 
                  y="20" 
                  fontFamily="Arial, sans-serif" 
                  fontSize="14" 
                  fontWeight="bold" 
                  fill="#F55036"
                >
                  Groq
                </text>
              </svg>
              <span className="text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                Groq
              </span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SEOMind AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}