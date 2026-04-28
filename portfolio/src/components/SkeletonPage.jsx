const SkeletonBox = ({ className = "" }) => (
    <div className={`animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10 ${className}`} />
  );
  
  export default function SkeletonPage() {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E1A] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-16">
  
          {/* Navbar */}
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-10 w-32 rounded-full" />
            <div className="hidden md:flex gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <SkeletonBox key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
            <SkeletonBox className="h-10 w-10 rounded-full" />
          </div>
  
          {/* Hero */}
          <section className="grid lg:grid-cols-2 gap-10 items-center pt-16">
            <div className="space-y-5">
              <SkeletonBox className="h-5 w-40" />
              <SkeletonBox className="h-14 w-full max-w-xl" />
              <SkeletonBox className="h-14 w-4/5" />
              <SkeletonBox className="h-24 w-full max-w-2xl" />
              <div className="flex gap-3">
                <SkeletonBox className="h-12 w-36 rounded-full" />
                <SkeletonBox className="h-12 w-36 rounded-full" />
              </div>
            </div>
  
            <div className="flex justify-center">
              <SkeletonBox className="h-72 w-72 rounded-full" />
            </div>
          </section>
  
          {/* Cards sections */}
          {[1, 2, 3].map(section => (
            <section key={section} className="space-y-8">
              <div className="text-center space-y-4">
                <SkeletonBox className="h-4 w-32 mx-auto" />
                <SkeletonBox className="h-10 w-72 mx-auto" />
                <SkeletonBox className="h-5 w-96 max-w-full mx-auto" />
              </div>
  
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(card => (
                  <div
                    key={card}
                    className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 space-y-4"
                  >
                    <SkeletonBox className="aspect-video w-full" />
                    <SkeletonBox className="h-5 w-3/4" />
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-5/6" />
                    <div className="flex gap-2">
                      <SkeletonBox className="h-7 w-16 rounded-full" />
                      <SkeletonBox className="h-7 w-20 rounded-full" />
                      <SkeletonBox className="h-7 w-14 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }