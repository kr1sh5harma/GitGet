import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <div className="font-mono text-8xl text-[#1a1a1a] mb-6 select-none">404</div>
        <h1 className="text-xl font-medium text-zinc-300 mb-2">User or repo not found</h1>
        <p className="text-sm text-zinc-600 mb-8 max-w-xs">
          The GitHub profile or repository you're looking for doesn't exist or may be private.
        </p>
        <Link
          href="/"
          className="text-sm font-mono text-zinc-400 border border-[#2a2a2a] px-5 py-2.5 rounded-lg hover:text-white hover:border-[#444] transition-all"
        >
          ← Back to search
        </Link>
      </main>
    </>
  )
}
