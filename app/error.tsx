'use client'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const isRateLimit = error.message?.includes('Rate limit')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="text-5xl mb-6 select-none">{isRateLimit ? '⏱' : '⚠'}</div>

        <h1 className="text-xl font-medium text-zinc-300 mb-3">
          {isRateLimit ? 'GitHub API Rate Limit Reached' : 'Something went wrong'}
        </h1>

        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          {isRateLimit
            ? "You've hit GitHub's unauthenticated rate limit of 60 requests per hour. Add a token to unlock 5,000 req/hour."
            : error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        {isRateLimit && (
          <div className="bg-[#0d0d0d] border border-[#222] rounded-xl p-5 mb-6 text-left">
            <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider mb-3">Fix: add to .env.local</p>
            <code className="text-sm font-mono text-emerald-500">
              GITHUB_TOKEN=ghp_your_token_here
            </code>
            <p className="text-[11px] font-mono text-zinc-700 mt-3">
              Get a free token at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors"
              >
                github.com/settings/tokens
              </a>
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="text-sm font-mono text-zinc-400 border border-[#2a2a2a] px-5 py-2.5 rounded-lg hover:text-white hover:border-[#444] transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm font-mono text-zinc-400 border border-[#2a2a2a] px-5 py-2.5 rounded-lg hover:text-white hover:border-[#444] transition-all"
          >
            ← Back to search
          </Link>
        </div>
      </div>
    </main>
  )
}
