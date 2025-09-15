import { CheckCircle, Copy, Users } from "lucide-react";
import React from "react";

interface SessionDetailsCardProps {
  sessionCode: string;
}

function SessionDetailsCard({ sessionCode }: SessionDetailsCardProps) {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const copySessionCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy session code:", err);
    }
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">
          Session Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Session Code
            </label>
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 rounded-lg px-3 py-2 flex-1 font-mono text-white">
                {sessionCode}
              </div>
              <button
                onClick={copySessionCode}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                {copiedCode ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Share this code with guests
            </p>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">You are the host</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionDetailsCard;
