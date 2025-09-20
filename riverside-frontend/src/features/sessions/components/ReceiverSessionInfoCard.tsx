import { Users } from "lucide-react";

interface ReceiverSessionInfoCardProps {
  sessionCode?: string;
}

function ReceiverSessionInfoCard({
  sessionCode,
}: ReceiverSessionInfoCardProps) {
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
            <div className="bg-white/10 rounded-lg px-3 py-2 font-mono text-white">
              {sessionCode}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">You are a guest</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReceiverSessionInfoCard;
