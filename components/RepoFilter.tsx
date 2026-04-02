'use client'
import { useState, useMemo } from 'react'
import type { GHRepo } from '@/lib/github'
import RepoCard from '@/components/RepoCard'

type Sort = 'updated' | 'stars' | 'forks' | 'name'

interface Props {
  repos: GHRepo[]
  username: string
}

export default function RepoFilter({ repos, username }: Props) {
  const [query, setQuery] = useState('')
  const [lang, setLang] = useState('all')
  const [sort, setSort] = useState<Sort>('updated')
  const [showForks, setShowForks] = useState(true)

  // Derive unique languages from all repos
  const languages = useMemo(() => {
    const set = new Set<string>()
    for (const r of repos) if (r.language) set.add(r.language)
    return Array.from(set).sort()
  }, [repos])

  const filtered = useMemo(() => {
    let list = [...repos]
    if (!showForks) list = list.filter(r => !r.fork)
    if (lang !== 'all') list = list.filter(r => r.language === lang)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'stars': list.sort((a, b) => b.stargazers_count - a.stargazers_count); break
      case 'forks': list.sort((a, b) => b.forks_count - a.forks_count); break
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'updated': list.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()); break
    }
    return list
  }, [repos, query, lang, sort, showForks])

  const sourceCount = repos.filter(r => !r.fork).length
  const forkedCount = repos.filter(r => r.fork).length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-sm font-medium">Repositories</h2>
          <p className="text-xs text-zinc-600 font-mono mt-0.5">
            {repos.length} total · {sourceCount} source · {forkedCount} forked
            {filtered.length !== repos.length && (
              <span className="ml-2 text-emerald-600">· {filtered.length} shown</span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Search */}
        <div className="flex items-center bg-[#111] border border-[#2a2a2a] rounded-lg overflow-hidden focus-within:border-[#444] transition-colors flex-1 min-w-[180px]">
          <svg className="w-3.5 h-3.5 ml-3 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search repos..."
            className="bg-transparent text-sm text-zinc-200 placeholder-zinc-600 font-mono px-2.5 py-2 outline-none w-full"
          />
          {query && (
            <button onClick={() => setQuery('')} className="pr-3 text-zinc-500 hover:text-zinc-300 transition-colors text-xs">✕</button>
          )}
        </div>

        {/* Language filter */}
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="bg-[#111] border border-[#2a2a2a] text-sm text-zinc-300 font-mono px-3 py-2 rounded-lg outline-none hover:border-[#444] transition-colors cursor-pointer"
        >
          <option value="all">All languages</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as Sort)}
          className="bg-[#111] border border-[#2a2a2a] text-sm text-zinc-300 font-mono px-3 py-2 rounded-lg outline-none hover:border-[#444] transition-colors cursor-pointer"
        >
          <option value="updated">Recently updated</option>
          <option value="stars">Most stars</option>
          <option value="forks">Most forks</option>
          <option value="name">Alphabetical</option>
        </select>

        {/* Forks toggle */}
        <button
          onClick={() => setShowForks(v => !v)}
          className={`text-xs font-mono px-3 py-2 rounded-lg border transition-all ${
            showForks
              ? 'bg-[#111] border-[#2a2a2a] text-zinc-500 hover:border-[#444]'
              : 'bg-[#1a1a1a] border-[#333] text-zinc-300'
          }`}
        >
          {showForks ? 'Hide forks' : 'Show forks'}
        </button>
      </div>

      {/* Repo Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-zinc-500 font-mono text-sm mb-1">No repositories match your filters</p>
          <button
            onClick={() => { setQuery(''); setLang('all'); setShowForks(true) }}
            className="text-xs text-zinc-600 hover:text-zinc-300 underline underline-offset-2 transition-colors mt-2 font-mono"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(repo => <RepoCard key={repo.id} repo={repo} />)}
        </div>
      )}
    </div>
  )
}
