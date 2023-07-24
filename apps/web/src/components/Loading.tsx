export default function Loading() {
  return (
    <div className="absolute left-0 top-0 bg-white z-10 h-full w-full flex items-center justify-center">
      <div className="flex gap-4 items-center justify-center h-screen">
        <span className="loading loading-bars loading-xs text-info"></span>
        <span className="loading loading-bars loading-sm text-success"></span>
        <span className="loading loading-bars loading-md text-warning"></span>
        <span className="loading loading-bars loading-lg text-error"></span>
      </div>
    </div>
  )
}
