import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SessionHeaderProps {
  isConnected: boolean;
  connectionStatus: string;
}

function SessionHeader({ isConnected, connectionStatus }: SessionHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span>{connectionStatus}</span>
        </div>
      </div>
    </div>
  );
}

export default SessionHeader;
