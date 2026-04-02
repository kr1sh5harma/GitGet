import Link from 'next/link'
import SearchBar from './SearchBar'

interface NavbarProps {
  username?: string
  repo?: string
}

export default function Navbar({ username, repo }: NavbarProps) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-6">

        {/* Logo + Breadcrumb */}
        <div className="flex items-center gap-2 text-sm min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="w-2 h-2 rounded-full bg-white group-hover:opacity-70 transition-opacity" />
            <span className="font-medium text-white tracking-tight">RepoLens</span>
          </Link>

          {username && (
            <>
              <span className="text-zinc-700 shrink-0">/</span>
              <Link
                href={`/${username}`}
                className="text-zinc-400 hover:text-white transition-colors font-mono truncate max-w-[120px]"
              >
                {username}
              </Link>
            </>
          )}

          {repo && (
            <>
              <span className="text-zinc-700 shrink-0">/</span>
              <span className="text-zinc-200 font-mono truncate max-w-[160px]">{repo}</span>
            </>
          )}
        </div>

        {/* Compact search (only visible on inner pages) */}
        {username && <SearchBar compact />}

        {/* Right badge */}
        {!username && (
          <span className="text-[11px] font-mono text-zinc-600 border border-[#222] rounded px-2 py-1 shrink-0">
            GitHub Analyzer
          </span>
        )}
      </div>
    </nav>
  )
}
