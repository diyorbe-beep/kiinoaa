// FILE: /src/components/Skeleton.jsx
// Skeleton loader component

export const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-primary-200 rounded'
  
  const variants = {
    default: '',
    text: 'h-4',
    title: 'h-6',
    avatar: 'rounded-full',
    card: 'h-64',
    image: 'aspect-[2/3]',
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} aria-hidden="true" />
  )
}

// Skeleton card for movies/series
export const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-primary-200 rounded-lg aspect-[2/3] mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-primary-200 rounded w-3/4" />
        <div className="h-3 bg-primary-200 rounded w-1/2" />
      </div>
    </div>
  )
}

// Skeleton for movie/series details
export const SkeletonDetails = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-primary-200 rounded-lg aspect-[2/3]" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 bg-primary-200 rounded w-3/4" />
          <div className="h-4 bg-primary-200 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-primary-200 rounded" />
            <div className="h-4 bg-primary-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  )
}









