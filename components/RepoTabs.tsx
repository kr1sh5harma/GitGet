'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { GHCommit, GHPR, GHContributor, GHLanguages, GHRepo } from '@/lib/github'
import {
  computeLangBreakdown, computeCommitRhythm, computeCollabScore,
  computeRepoHealth, analyzeCommitStyle, buildCommitHeatmap,
  timeAgo, formatDate, fmtNum
} from '@/lib/utils'

interface Props {
  repo: GHRepo
  commits: GHCommit[]
  prs: GHPR[]
  contributors: GHContributor[]
  languages: GHLanguages
}

const TABS = ['Overview', 'Commits', 'Pull Requests', 'Contributors'] as const
type Tab = typeof TABS[number]

export default function RepoTabs({ repo, commits, prs, contributors, languages }: Props) {
  const [tab, setTab] = useState<Tab>('Overview')

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex border-b border-[#1e1e1e] mb-8 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              tab === t
                ? 'text-white border-white'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {t}
            {t === 'Commits' && <span className="ml-2 text-xs font-mono text-zinc-700">{commits.length}+</span>}
            {t === 'Pull Requests' && <span className="ml-2 text-xs font-mono text-zinc-700">{prs.length}</span>}
            {t === 'Contributors' && <span className="ml-2 text-xs font-mono text-zinc-700">{contributors.length}</span>}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewPanel repo={repo} commits={commits} prs={prs} contributors={contributors} languages={languages} />}
      {tab === 'Commits' && <CommitsPanel commits={commits} />}
      {tab === 'Pull Requests' && <PRPanel prs={prs} />}
      {tab === 'Contributors' && <ContributorsPanel contributors={contributors} />}
    </div>
  )
}

// ─── OVERVIEW ──────────────────────────────────────────────────────────────────
function OverviewPanel({ repo, commits, prs, contributors, languages }: Props) {
  const langBreakdown = computeLangBreakdown(languages)
  const rhythm = computeCommitRhythm(commits)
  const commitStyle = analyzeCommitStyle(commits)
  const health = computeRepoHealth(repo, commits)
  const collabScore = computeCollabScore(repo, prs, contributors.length)
  const heatmap = buildCommitHeatmap(commits)
  const openPRs = prs.filter(p => !p.merged_at && p.state === 'open').length
  const mergedPRs = prs.filter(p => p.merged_at).length
  const maxHeat = Math.max(...heatmap, 1)

  return (
    <div className="space-y-8 animate-fade-up">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Stars', value: fmtNum(repo.stargazers_count), color: '#fbbf24' },
          { label: 'Forks', value: fmtNum(repo.forks_count), color: '#60a5fa' },
          { label: 'Watchers', value: fmtNum(repo.watchers_count), color: '#a78bfa' },
          { label: 'Open Issues', value: String(repo.open_issues_count), color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
            <div className="text-[11px] text-zinc-600 font-mono uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-3xl font-light tracking-tight" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Insight Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InsightCard
          icon="⚡"
          title="Commit Rhythm"
          label={rhythm.label}
          desc={rhythm.desc}
          color={rhythm.color}
        />
        <InsightCard
          icon="✍️"
          title="Commit Style"
          label={commitStyle.label}
          desc={commitStyle.desc}
          color="#a78bfa"
        />
        <InsightCard
          icon="🤝"
          title="Collaboration"
          label={`${collabScore}/100`}
          desc={collabScore > 70 ? 'Highly collaborative project' : collabScore > 40 ? 'Moderate collaboration' : 'Primarily solo project'}
          color={collabScore > 70 ? '#4ade80' : collabScore > 40 ? '#fbbf24' : '#888'}
        />
      </div>

      {/* Code Health + PR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Score */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">Repository Health</h3>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-light" style={{ color: health > 75 ? '#4ade80' : health > 50 ? '#fbbf24' : '#f87171' }}>
              {health}
            </span>
            <span className="text-zinc-600 text-sm mb-2">/ 100</span>
          </div>
          <div className="w-full bg-[#1a1a1a] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${health}%`,
                background: health > 75 ? '#4ade80' : health > 50 ? '#fbbf24' : '#f87171'
              }}
            />
          </div>
          <div className="mt-4 space-y-1.5 text-xs font-mono">
            {[
              { label: 'Has description', ok: !!repo.description },
              { label: 'Has license', ok: !!repo.license },
              { label: 'Has topics', ok: (repo.topics?.length ?? 0) > 0 },
              { label: 'Active recently', ok: (Date.now() - new Date(repo.pushed_at).getTime()) < 90 * 86400000 },
              { label: 'Has homepage', ok: !!repo.homepage },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-zinc-500">
                <span>{item.label}</span>
                <span style={{ color: item.ok ? '#4ade80' : '#444' }}>{item.ok ? '✓' : '○'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PR Stats */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">Pull Request Overview</h3>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Open', value: openPRs, color: '#4ade80' },
              { label: 'Merged', value: mergedPRs, color: '#a78bfa' },
              { label: 'Closed', value: prs.filter(p => !p.merged_at && p.state === 'closed').length, color: '#f87171' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-light mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
          {prs.length > 0 && (
            <div className="w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden flex">
              {openPRs > 0 && <div style={{ width: `${(openPRs/prs.length)*100}%`, background: '#4ade80' }} className="h-full" />}
              {mergedPRs > 0 && <div style={{ width: `${(mergedPRs/prs.length)*100}%`, background: '#a78bfa' }} className="h-full" />}
            </div>
          )}
        </div>
      </div>

      {/* Commit Activity Heatmap */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">Commit Activity — Last 12 Weeks</h3>
        <div className="flex items-end gap-1.5 h-16">
          {heatmap.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end gap-1">
              <div
                className="w-full rounded-sm transition-all"
                style={{
                  height: `${(count / maxHeat) * 52}px`,
                  minHeight: count > 0 ? '4px' : '2px',
                  background: count === 0 ? '#1a1a1a' : `rgba(74, 222, 128, ${0.3 + (count / maxHeat) * 0.7})`,
                }}
                title={`${count} commit${count !== 1 ? 's' : ''}`}
              />
              {i % 4 === 0 && (
                <div className="text-[9px] font-mono text-zinc-700 text-center">
                  {i === 0 ? '12w' : i === 4 ? '8w' : i === 8 ? '4w' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Language Breakdown */}
      {langBreakdown.length > 0 && (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-5">Language Breakdown</h3>
          {/* Full bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-5 gap-px">
            {langBreakdown.map(l => (
              <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} title={`${l.name}: ${l.pct}%`} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {langBreakdown.map(l => (
              <div key={l.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                <div className="min-w-0">
                  <div className="text-xs text-zinc-300 font-mono truncate">{l.name}</div>
                  <div className="text-xs text-zinc-600 font-mono">{l.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">Topics</h3>
          <div className="flex flex-wrap gap-2">
            {repo.topics.map(t => (
              <span key={t} className="text-xs font-mono text-zinc-400 bg-[#1a1a1a] border border-[#252525] rounded-full px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── COMMITS ───────────────────────────────────────────────────────────────────
function CommitsPanel({ commits }: { commits: GHCommit[] }) {
  if (!commits.length) return <Empty msg="No commits found." />
  return (
    <div className="space-y-px animate-fade-up">
      {commits.map(c => (
        <a
          key={c.sha}
          href={c.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#111] border border-transparent hover:border-[#1e1e1e] transition-all group"
        >
          {c.author?.avatar_url && (
            <Image
              src={c.author.avatar_url}
              alt={c.author.login}
              width={32} height={32}
              unoptimized
              className="rounded-full shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 group-hover:text-white transition-colors line-clamp-2 leading-snug mb-1.5">
              {c.commit.message.split('\n')[0]}
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-600">
              <span>{c.commit.author.name}</span>
              <span>·</span>
              <span>{timeAgo(c.commit.author.date)}</span>
              <span>·</span>
              <span>{formatDate(c.commit.author.date)}</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-700 bg-[#1a1a1a] border border-[#222] rounded px-2 py-0.5 shrink-0 mt-0.5 group-hover:text-zinc-400 transition-colors">
            {c.sha.slice(0, 7)}
          </span>
        </a>
      ))}
    </div>
  )
}

// ─── PULL REQUESTS ─────────────────────────────────────────────────────────────
function PRPanel({ prs }: { prs: GHPR[] }) {
  if (!prs.length) return <Empty msg="No pull requests found." />
  return (
    <div className="space-y-2 animate-fade-up">
      {prs.map(pr => {
        const state = pr.merged_at ? 'merged' : pr.state
        const stateStyle = {
          open: { color: '#4ade80', bg: '#0d2b0d', border: '#1a4a1a' },
          merged: { color: '#a78bfa', bg: '#1a0d2b', border: '#2a1a4a' },
          closed: { color: '#f87171', bg: '#2b0d0d', border: '#4a1a1a' },
        }[state] ?? { color: '#888', bg: '#1a1a1a', border: '#2a2a2a' }

        return (
          <a
            key={pr.number}
            href={pr.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 bg-[#111] border border-[#1e1e1e] rounded-xl hover:border-[#2a2a2a] hover:bg-[#141414] transition-all group"
          >
            <span
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full mt-0.5 shrink-0 border"
              style={{ color: stateStyle.color, background: stateStyle.bg, borderColor: stateStyle.border }}
            >
              {state}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-200 group-hover:text-white mb-1.5 transition-colors">{pr.title}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-600">
                <span>#{pr.number}</span>
                <span>by {pr.user.login}</span>
                <span>{timeAgo(pr.created_at)}</span>
                {pr.additions !== undefined && (
                  <span className="flex gap-2">
                    <span className="text-emerald-700">+{fmtNum(pr.additions)}</span>
                    <span className="text-red-900">-{fmtNum(pr.deletions)}</span>
                  </span>
                )}
              </div>
              {pr.labels.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {pr.labels.map(l => (
                    <span
                      key={l.name}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: `#${l.color}22`, color: `#${l.color}`, border: `1px solid #${l.color}44` }}
                    >
                      {l.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Image
              src={pr.user.avatar_url}
              alt={pr.user.login}
              width={28} height={28}
              unoptimized
              className="rounded-full shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </a>
        )
      })}
    </div>
  )
}

// ─── CONTRIBUTORS ─────────────────────────────────────────────────────────────
function ContributorsPanel({ contributors }: { contributors: GHContributor[] }) {
  if (!contributors.length) return <Empty msg="No contributor data available." />
  const max = contributors[0]?.contributions ?? 1
  return (
    <div className="space-y-3 animate-fade-up">
      {contributors.map((c, i) => (
        <a
          key={c.login}
          href={c.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-[#111] border border-[#1e1e1e] rounded-xl hover:border-[#2a2a2a] hover:bg-[#141414] transition-all group"
        >
          <span className="text-xs font-mono text-zinc-700 w-5 text-right shrink-0">#{i + 1}</span>
          <Image src={c.avatar_url} alt={c.login} width={36} height={36} unoptimized className="rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-zinc-200 font-mono group-hover:text-white transition-colors mb-1">{c.login}</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#1a1a1a] rounded-full h-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(c.contributions / max) * 100}%`, background: '#4ade80' }}
                />
              </div>
              <span className="text-xs font-mono text-zinc-600 shrink-0">{fmtNum(c.contributions)} commits</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

// ─── INSIGHT CARD ─────────────────────────────────────────────────────────────
function InsightCard({ icon, title, label, desc, color }: { icon: string; title: string; label: string; desc: string; color: string }) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-sm font-medium mb-1" style={{ color }}>{label}</div>
      <div className="text-xs text-zinc-600">{desc}</div>
    </div>
  )
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="text-center py-16 text-zinc-700 font-mono text-sm">{msg}</div>
  )
}
