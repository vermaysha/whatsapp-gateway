export default function Loading() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex gap-4">
        <span className="loading loading-bars loading-xs text-info"></span>
        <span className="loading loading-bars loading-sm text-success"></span>
        <span className="loading loading-bars loading-md text-warning"></span>
        <span className="loading loading-bars loading-lg text-error"></span>
      </div>
    </div>
  )
}
