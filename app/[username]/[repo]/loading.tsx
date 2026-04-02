export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-5 pt-24 pb-20 animate-pulse">
      <div className="mb-10">
        <div className="flex gap-3 mb-4">
          <div className="h-5 w-24 bg-[#1a1a1a] rounded" />
          <div className="h-5 w-4 bg-[#161616] rounded" />
          <div className="h-5 w-40 bg-[#1a1a1a] rounded" />
        </div>
        <div className="h-4 w-96 bg-[#161616] rounded mb-6" />
        <div className="flex gap-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-[#111] border border-[#1a1a1a] rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex gap-6 border-b border-[#1e1e1e] mb-8">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-4 w-20 bg-[#1a1a1a] rounded mb-3" />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-20 bg-[#111] border border-[#1a1a1a] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-28 bg-[#111] border border-[#1a1a1a] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 mb-6">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="h-56 bg-[#111] border border-[#1a1a1a] rounded-xl" />
        ))}
      </div>
    </main>
  )
}
