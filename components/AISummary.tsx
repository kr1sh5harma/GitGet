'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, ChevronUp, Zap, TrendingUp, Lightbulb, Quote, Award } from 'lucide-react'

interface AISummaryProps {
  profileData: {
    username: string
    name: string | null
    bio: string | null
    location: string | null
    company: string | null
    joinYear: number
    yearsOnGH: number
    publicRepos: number
    followers: number
    following: number
    totalStars: number
    totalForks: number
    sourceRepos: number
    forkedRepos: number
    archetype: string
    activityLevel: string
    languages: { lang: string; count: number }[]
    topRepos: { name: string; language: string | null; stars: number; forks: number; description: string | null }[]
    recentActivity: { last7days: number; last30days: number; last90days: number }
  }
}

interface AISummaryResult {
  codingPersonality: string
  summary: string
  strengths: string[]
  growthAreas: string[]
  funFact: string
  verdict: string
}

export default function AISummary({ profileData }: AISummaryProps) {
  const [result, setResult] = useState<AISummaryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  // Skeleton loader component
  const Skeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* Personality title skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-[#1a1a1a]" />
        <div>
          <div className="h-5 w-40 bg-zinc-200 dark:bg-[#1a1a1a] rounded mb-1.5" />
          <div className="h-3 w-24 bg-zinc-100 dark:bg-[#151515] rounded" />
        </div>
      </div>
      {/* Summary skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
        <div className="h-3 w-11/12 bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
        <div className="h-3 w-3/4 bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
      </div>
      {/* Strengths skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-20 bg-zinc-100 dark:bg-[#151515] rounded" />
        <div className="h-3 w-full bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
        <div className="h-3 w-10/12 bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
        <div className="h-3 w-9/12 bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
      </div>
      {/* Growth areas skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-24 bg-zinc-100 dark:bg-[#151515] rounded" />
        <div className="h-3 w-full bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
        <div className="h-3 w-10/12 bg-zinc-200 dark:bg-[#1a1a1a] rounded" />
      </div>
    </div>
  )

  return (
    <div className="mb-10">
      {/* ─── GENERATE BUTTON (before generation) ─── */}
      {!result && !loading && (
        <motion.button
          onClick={generate}
          disabled={loading}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full group relative overflow-hidden bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-5 hover:border-zinc-300 dark:hover:border-[#2a2a2a] transition-all duration-300 cursor-pointer text-left"
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.03] via-blue-500/[0.03] to-emerald-500/[0.03] dark:from-violet-500/[0.05] dark:via-blue-500/[0.05] dark:to-emerald-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 dark:from-violet-500/20 dark:to-blue-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-violet-500 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 dark:text-white mb-0.5">
                Generate AI Profile Summary
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-600">
                Get an AI-powered analysis of this developer&apos;s coding personality, strengths, and growth areas
              </div>
            </div>
            <div className="text-xs font-mono text-violet-500 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 rounded-lg px-3 py-1.5 shrink-0 group-hover:bg-violet-500/10 transition-colors">
              Analyze →
            </div>
          </div>
        </motion.button>
      )}

      {/* ─── LOADING STATE ─── */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 dark:from-violet-500/20 dark:to-blue-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-500 dark:text-violet-400 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Analyzing profile...</div>
              <div className="text-xs text-slate-500 dark:text-zinc-600">AI is reviewing coding patterns and activity</div>
            </div>
          </div>
          <Skeleton />
        </motion.div>
      )}

      {/* ─── ERROR STATE ─── */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111] border border-red-200 dark:border-red-500/20 rounded-xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <span className="text-red-500 text-sm">✗</span>
              </div>
              <div>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">Analysis failed</div>
                <div className="text-xs text-red-500/70 dark:text-red-400/50">{error}</div>
              </div>
            </div>
            <button
              onClick={generate}
              className="text-xs font-mono text-slate-600 dark:text-zinc-500 border border-zinc-300 dark:border-[#2a2a2a] px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-[#444] transition-all"
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {/* ─── RESULT ─── */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl overflow-hidden"
          >
            {/* Header — always visible */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-[#141414] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-emerald-500/10 dark:from-violet-500/20 dark:via-blue-500/20 dark:to-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">AI Coding Personality</span>
                  </div>
                  <div className="text-base font-medium text-slate-900 dark:text-white mt-0.5">
                    {result.codingPersonality}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-violet-500/60 dark:text-violet-400/40 hidden sm:block">
                  Powered by AI
                </span>
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {/* Expandable content */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-5">

                    {/* Divider */}
                    <div className="border-t border-zinc-100 dark:border-[#1a1a1a]" />

                    {/* Summary */}
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <Quote className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
                        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">Summary</span>
                      </div>
                      <p className="text-[13px] text-slate-700 dark:text-zinc-400 leading-relaxed">
                        {result.summary}
                      </p>
                    </div>

                    {/* Strengths & Growth Areas grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="bg-zinc-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-zinc-100 dark:border-[#1a1a1a]">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Strengths</span>
                        </div>
                        <ul className="space-y-2">
                          {result.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-500 leading-relaxed">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Growth Areas */}
                      <div className="bg-zinc-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-zinc-100 dark:border-[#1a1a1a]">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider">Growth Areas</span>
                        </div>
                        <ul className="space-y-2">
                          {result.growthAreas.map((g, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-500 leading-relaxed">
                              <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Fun Fact */}
                    <div className="flex items-start gap-3 bg-zinc-50 dark:bg-[#0d0d0d] rounded-lg p-4 border border-zinc-100 dark:border-[#1a1a1a]">
                      <Lightbulb className="w-4 h-4 text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-mono text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-1">Fun Fact</div>
                        <p className="text-xs text-slate-600 dark:text-zinc-500 leading-relaxed">{result.funFact}</p>
                      </div>
                    </div>

                    {/* Verdict */}
                    <div className="flex items-start gap-3 bg-gradient-to-r from-violet-500/[0.04] to-blue-500/[0.04] dark:from-violet-500/[0.08] dark:to-blue-500/[0.08] rounded-lg p-4 border border-violet-200/50 dark:border-violet-500/10">
                      <Award className="w-4 h-4 text-violet-500 dark:text-violet-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-mono text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-1">Verdict</div>
                        <p className="text-[13px] text-slate-700 dark:text-zinc-400 leading-relaxed font-medium">{result.verdict}</p>
                      </div>
                    </div>

                    {/* Regenerate */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-700">
                        Analysis based on public GitHub data
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          generate()
                        }}
                        className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3" />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
