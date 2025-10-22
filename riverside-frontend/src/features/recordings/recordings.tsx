import { useNavigate } from "react-router-dom";
import RecordingsHeader from "./components/RecordingsHeader";
import { Button } from "@/components/ui/button";
import { HiDownload } from "react-icons/hi";
import RecordingCard from "./components/RecordingCard";

function Recordings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary-background">
      <RecordingsHeader />
      <div className="flex flex-col mx-10 mt-10">
        <h2 className="text-2xl font-bold mb-4">For the Love of pod</h2>

        <RecordingCard
          title="All Participants"
          duration="00:19:46"
          quality="Max 4k"
          status="Done"
          onDownloadHighQuality={() => {}}
          onDownload={() => {}}
        />
      </div>
    </div>
  );
}

export default Recordings;
