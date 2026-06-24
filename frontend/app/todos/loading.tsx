function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-zinc-100 ${className}`} />;
}

export default function TodoLoading() {
  return (
    <main
      className="min-h-screen bg-zinc-50 px-5 py-10 text-zinc-900"
      aria-busy="true"
      aria-label="Todo 데이터를 불러오는 중"
    >
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <SkeletonBlock className="mb-4 h-10 w-24 border border-zinc-200 bg-white" />
          <SkeletonBlock className="mb-3 h-4 w-28" />
          <SkeletonBlock className="h-9 w-44" />
          <SkeletonBlock className="mt-3 h-4 w-64 max-w-full" />
        </header>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <SkeletonBlock className="mb-2 h-4 w-20" />
              <SkeletonBlock className="h-11 w-full" />
            </div>
            <div>
              <SkeletonBlock className="mb-2 h-4 w-20" />
              <SkeletonBlock className="h-11 w-full" />
            </div>
            <SkeletonBlock className="h-11 w-40 max-w-full" />
          </div>

          <div className="mt-5 flex justify-end gap-2 max-sm:grid max-sm:grid-cols-1">
            <SkeletonBlock className="h-11 w-20 max-sm:w-full" />
            <SkeletonBlock className="h-11 w-28 max-sm:w-full" />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <SkeletonBlock className="h-5 w-2/3 max-w-full" />
              <SkeletonBlock className="mt-3 h-4 w-28" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
