export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 animate-pulse">
      <div className="bg-netflix-dark rounded-md aspect-[2/3] w-full" />
      <div className="mt-2 h-3 bg-netflix-dark rounded w-3/4" />
      <div className="mt-1 h-3 bg-netflix-dark rounded w-1/2" />
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-netflix-dark rounded-md aspect-[2/3] w-full" />
          <div className="mt-2 h-3 bg-netflix-dark rounded w-3/4" />
          <div className="mt-1 h-3 bg-netflix-dark rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[70vh] animate-pulse bg-netflix-dark">
      <div className="absolute bottom-16 left-8 md:left-16 space-y-4 max-w-xl">
        <div className="h-10 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
        <div className="flex gap-3 mt-4">
          <div className="h-10 w-28 bg-gray-700 rounded" />
          <div className="h-10 w-28 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="my-8">
      <div className="h-6 w-48 bg-netflix-dark rounded mb-4 animate-pulse" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
