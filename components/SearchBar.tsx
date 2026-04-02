'use client'
import { useState, FormEvent, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar({ defaultValue = '', compact = false }: { defaultValue?: string; compact?: boolean }) {
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const go = (e?: FormEvent) => {
    e?.preventDefault()
    const u = value.trim().replace('@', '')
    if (!u) return
    setLoading(true)
    router.push(`/${u}`)
  }

  if (compact) {
    return (
      <form onSubmit={go} className="flex items-center gap-2">
        <div className="flex items-center bg-[#111] border border-[#2a2a2a] rounded-lg overflow-hidden focus-within:border-[#444] transition-colors">
          <span className="pl-3 text-zinc-500 text-sm font-mono">@</span>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="username"
            className="bg-transparent text-sm text-zinc-200 placeholder-zinc-600 font-mono px-2 py-2 w-36 outline-none"
            autoComplete="off" spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="bg-white text-black text-xs font-medium px-3 py-1.5 m-1 rounded-md hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer"
          >
            {loading ? '...' : 'Go'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={go} className="w-full max-w-lg">
      <div className="flex items-center bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-[#444] transition-colors">
        <span className="pl-5 text-zinc-500 text-lg font-mono select-none">@</span>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-1 bg-transparent text-[15px] text-zinc-200 placeholder-zinc-600 font-mono px-3 py-4 outline-none"
          autoFocus autoComplete="off" spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="bg-white text-black text-sm font-medium px-5 py-2 m-2 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : 'Analyze →'}
        </button>
      </div>
      <p className="text-center text-xs text-zinc-600 mt-3 font-mono">
        Press <kbd className="text-zinc-500 border border-[#333] rounded px-1 py-0.5">Enter</kbd> to search
      </p>
    </form>
  )
}
