import { Settings, History } from "lucide-react"

export default function LPactionButtons() {
    return (
        <div className="flex justify-center gap-10 py-6 ">
          <button className="flex items-center text-xs text-gray-400">
            <Settings className="w-4 h-4 mr-2" /> BYOK
          </button>
          <button className="flex items-center text-xs text-gray-400">
            <History className="w-4 h-4 mr-2" /> History
          </button>
        </div>
    )
}