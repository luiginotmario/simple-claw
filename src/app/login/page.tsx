import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[var(--primary)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500 opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 p-2 rounded-full hover:bg-[var(--glass-border)] transition-colors opacity-60 hover:opacity-100">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-[var(--muted)]">Enter your email to sign in to your Life OS.</p>
        </div>

        <div className="p-8 rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full bg-[var(--card)]/50 border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--muted)]/50"
            />
          </div>

          <button className="w-full py-3.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-semibold hover:opacity-90 transition-opacity">
            Continue with Email
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[var(--border)]"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[var(--background)] px-2 text-[var(--muted)]">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--glass-bg)] transition-colors text-sm font-medium">
               Google
             </button>
             <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--glass-bg)] transition-colors text-sm font-medium">
               GitHub
             </button>
          </div>
        </div>
        
        <p className="text-center text-sm text-[var(--muted)]">
          Don't have an account? <Link href="/onboarding" className="text-[var(--foreground)] font-medium hover:underline">Get started</Link>
        </p>
      </div>
    </div>
  )
}
