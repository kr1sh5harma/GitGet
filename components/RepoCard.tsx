import Link from 'next/link'
import type { GHRepo } from '@/lib/github'
import { langColor, timeAgo, fmtNum, repoActivityStatus } from '@/lib/utils'

export default function RepoCard({ repo }: { repo: GHRepo }) {
  const status = repoActivityStatus(repo)

  return (
    <Link
      href={`/${repo.owner.login}/${repo.name}`}
      className="group block bg-[#111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#2e2e2e] hover:bg-[#141414] transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-sm font-medium text-white truncate group-hover:text-zinc-100 transition-colors">
            {repo.name}
          </span>
          {repo.fork && (
            <span className="text-[10px] font-mono text-zinc-600 border border-[#2a2a2a] rounded px-1.5 py-0.5 shrink-0">
              fork
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono shrink-0 mt-0.5" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-[13px] text-zinc-500 leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
        {repo.description || <span className="italic text-zinc-700">No description</span>}
      </p>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] font-mono text-zinc-500 bg-[#1a1a1a] border border-[#252525] rounded-full px-2 py-0.5">
              {t}
            </span>
          ))}
          {repo.topics.length > 3 && (
            <span className="text-[10px] font-mono text-zinc-700">+{repo.topics.length - 3}</span>
          )}
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-zinc-600 font-mono">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: langColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <StarIcon />
            {fmtNum(repo.stargazers_count)}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <ForkIcon />
            {fmtNum(repo.forks_count)}
          </span>
        )}
        <span className="ml-auto text-zinc-700">{timeAgo(repo.pushed_at)}</span>
      </div>

      {/* Arrow indicator */}
      <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-end">
        <span className="text-[11px] font-mono text-zinc-700 group-hover:text-zinc-400 transition-colors">
          View analysis →
        </span>
      </div>
    </Link>
  )
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  )
}

function ForkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0Z" />
    </svg>
  )
}
