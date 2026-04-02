import Navbar from '@/components/Navbar'
import StarField from '@/components/StarField'
import SearchBar from '@/components/SearchBar'
import TypewriterText from '@/components/TypewriterText'

export default function Home() {
  return (
    <>
      <Navbar />
      <StarField />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 pt-14">
        {/* Centered content */}
        <div className="flex flex-col items-center text-center max-w-2xl animate-fade-up">

          {/* Eyebrow label */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-[0.15em]">
              GitHub Profile Analyzer
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-light tracking-[-0.04em] leading-none mb-5 text-white">
            Understand any<br />
            <TypewriterText text="codebase" />
          </h1>

          <p className="text-[15px] text-zinc-500 leading-relaxed mb-12 max-w-sm">
            Deep insights into GitHub profiles — commits, patterns, languages, and coding personality at a glance.
          </p>

          <SearchBar />

          {/* Quick examples */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-mono text-zinc-700 uppercase tracking-wider mr-1">Try:</span>
            {['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'].map(u => (
              <a
                key={u}
                href={`/${u}`}
                className="text-[11px] font-mono text-zinc-600 border border-[#222] rounded-full px-3 py-1 hover:text-zinc-300 hover:border-[#444] transition-all"
              >
                @{u}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom feature hints */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[11px] font-mono text-zinc-700">
          {['Commit patterns', 'Language analysis', 'PR insights', 'Repo health scores'].map(f => (
            <span key={f} className="hidden md:block">{f}</span>
          ))}
        </div>
      </main>
    </>
  )
}
