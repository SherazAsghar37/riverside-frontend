import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecordingsHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center py-4 mx-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>
    </div>
  );
}

export default RecordingsHeader;
