// FILE: /src/components/ErrorMessage.jsx
// Error message component

export const ErrorMessage = ({ error, onRetry, className = '' }) => {
  if (!error) return null

  const message = typeof error === 'string' ? error : error.message || 'An error occurred'

  return (
    <div className={`bg-error/10 border border-error/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <span className="text-error text-xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-error mb-1">Error</h3>
          <p className="text-text-primary text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-error text-text-inverse rounded-md hover:bg-red-600 text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}









