import { Settings, History } from "lucide-react"

export default function LPactionButtons() {
  return (
    <div className="flex justify-center gap-8 py-6 text-[11px] md:text-xs">
      <button
        type="button"
        aria-label="Bring Your Own Key"
        className="group relative inline-flex items-center gap-1.5 text-gray-800/80 hover:text-gray-900 transition-colors"
      >
        <span className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 ease-out">[</span>
        <Settings className="w-3.5 h-3.5 opacity-60 group-hover:opacity-80 transition-opacity" />
        <span className="font-medium tracking-wide">BYOK</span>
        <span className="opacity-0 translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 ease-out">]</span>
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
      </button>

      <button
        type="button"
        aria-label="View History"
        className="group relative inline-flex items-center gap-1.5 text-gray-800/80 hover:text-gray-900 transition-colors"
      >
        <span className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 ease-out">[</span>
        <History className="w-3.5 h-3.5 opacity-60 group-hover:opacity-80 transition-opacity" />
        <span className="font-medium tracking-wide">History</span>
        <span className="opacity-0 translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 ease-out">]</span>
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
      </button>
    </div>
  );
}