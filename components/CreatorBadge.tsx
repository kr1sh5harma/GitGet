'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Sparkles, Check, Copy } from 'lucide-react'

const CREATOR_DATA = {
  name: 'Harsh Sharma',
  handle: 'kr1sh5harma',
  role: 'Creator & Developer of GitGet',
  avatar: 'https://avatars.githubusercontent.com/u/173617857?v=4',
  githubUrl: 'https://github.com/kr1sh5harma',
  linkedinUrl: 'https://www.linkedin.com/in/harsh-sharma-26b151306/',
}

export default function CreatorBadge() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const copyProfileLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(CREATOR_DATA.githubUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* ─── FLOATING BOTTOM-RIGHT CREATOR PILL ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-5 right-5 z-40"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-white/90 dark:bg-[#111]/90 backdrop-blur-md border border-zinc-200/90 dark:border-[#262626] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-slate-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-mono text-xs shadow-lg shadow-black/5 dark:shadow-black/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          title="Creator - Harsh Sharma"
        >
          {/* Subtle live indicator dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="text-[11px] text-slate-500 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors">
            Crafted by
          </span>

          <span className="font-medium text-slate-900 dark:text-white tracking-tight">
            {CREATOR_DATA.name}
          </span>

          <motion.span
            className="text-[11px] text-zinc-400 group-hover:text-emerald-500 transition-transform duration-200 inline-block ml-0.5"
            whileHover={{ y: -1, x: 1 }}
          >
            ↗
          </motion.span>
        </button>
      </motion.div>

      {/* ─── POPUP MODAL ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="relative z-10 w-full max-w-sm sm:max-w-md bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#242424] rounded-2xl shadow-2xl overflow-hidden p-6 text-left"
            >
              {/* Ambient gradient glow in dark mode */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />

              {/* Top header row */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-full px-2.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Creator Profile
                </span>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1f1f1f] transition-colors"
                  aria-label="Close creator popup"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Creator details header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative shrink-0">
                  <Image
                    src={CREATOR_DATA.avatar}
                    alt={CREATOR_DATA.name}
                    width={56}
                    height={56}
                    unoptimized
                    className="rounded-xl border border-zinc-200 dark:border-[#2a2a2a] object-cover shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white leading-tight truncate">
                    {CREATOR_DATA.name}
                  </h3>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                    @{CREATOR_DATA.handle}
                  </p>
                  <p className="text-[12px] text-slate-600 dark:text-zinc-400 mt-1 line-clamp-1">
                    {CREATOR_DATA.role}
                  </p>
                </div>
              </div>

              {/* Social Link Cards */}
              <div className="space-y-2.5 mb-5">
                {/* ─── GITHUB LINK ─────────────────────────────────────────── */}
                <a
                  href={CREATOR_DATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shine-button shine-button-github group relative flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-[#161616] hover:bg-zinc-100 dark:hover:bg-[#1c1c1c] border border-zinc-200 dark:border-[#262626] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-black border border-zinc-700/50 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-900 dark:text-white">
                        <span>GitHub</span>
                        <ExternalLink size={12} className="text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                        github.com/{CREATOR_DATA.handle}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors shrink-0 ml-2">
                    Follow ↗
                  </span>
                </a>

                {/* ─── LINKEDIN LINK ───────────────────────────────────────── */}
                <a
                  href={CREATOR_DATA.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shine-button shine-button-linkedin group relative flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-[#161616] hover:bg-zinc-100 dark:hover:bg-[#1c1c1c] border border-zinc-200 dark:border-[#262626] hover:border-sky-500/40 dark:hover:border-sky-500/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-900 dark:text-white">
                        <span>LinkedIn</span>
                        <ExternalLink size={12} className="text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                        Harsh Sharma
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 group-hover:text-[#0A66C2] dark:group-hover:text-sky-400 transition-colors shrink-0 ml-2">
                    Connect ↗
                  </span>
                </a>
              </div>

              {/* ─── EXPLORE ON GITGET ACTION ───────────────────────────────── */}
              <div className="pt-3 border-t border-zinc-200 dark:border-[#202020] flex items-center justify-between gap-3">
                <a
                  href={`/${CREATOR_DATA.handle}`}
                  className="shine-button group flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 text-white dark:text-black text-sm font-semibold tracking-tight shadow-lg shadow-slate-900/20 dark:shadow-white/10 ring-1 ring-white/10 dark:ring-black/5 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer">
                  <span>Analyze {CREATOR_DATA.name} on GitGet</span>
                </a>

                <button
                  type="button"
                  onClick={copyProfileLink}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-[#2a2a2a] text-zinc-500 hover:text-slate-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1a1a1a] transition-colors"
                  title="Copy GitHub URL"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
