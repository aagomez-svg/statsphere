export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-brand-blue rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
