export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-5 pt-24 pb-20 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-24 h-24 rounded-2xl bg-[#111] border border-[#1a1a1a] shrink-0" />
        <div className="flex-1 space-y-4 pt-1">
          <div className="h-7 w-56 bg-[#111] border border-[#1a1a1a] rounded-lg" />
          <div className="h-4 w-32 bg-[#111] rounded" />
          <div className="h-4 w-full max-w-lg bg-[#111] rounded" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-[#111] rounded" />
            <div className="h-4 w-32 bg-[#111] rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-20 bg-[#111] border border-[#1a1a1a] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-[210px] bg-[#111] border border-[#1a1a1a] rounded-xl" />
        ))}
      </div>
      <div className="flex justify-between mb-5">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-[#111] rounded" />
          <div className="h-4 w-48 bg-[#111] rounded" />
        </div>
        <div className="h-9 w-64 bg-[#111] border border-[#1a1a1a] rounded-lg hidden sm:block" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-40 bg-[#111] border border-[#1a1a1a] rounded-xl" />
        ))}
      </div>
    </main>
  )
}
