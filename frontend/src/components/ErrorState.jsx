export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-4xl">⚠️</p>
      <p className="text-sm text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
