import { Button } from "@/components/ui/button";
import { HiDownload } from "react-icons/hi";

interface RecordingCardProps {
  title: string;
  duration: string;
  quality: string;
  status: string;
  onDownloadHighQuality: () => void;
  onDownload: () => void;
}

function RecordingCard({
  title,
  duration,
  quality,
  status,
  onDownloadHighQuality,
  onDownload,
}: RecordingCardProps) {
  return (
    <div className="bg-card rounded-md px-3 py-2 flex justify-between items-center">
      <div className="flex flex-row items-center gap-3">
        <div className="h-10 w-15 bg-light-card rounded-md"></div>
        <span className="text-[12px] mt-1">{title}</span>
      </div>
      <span className="text-[12px] text-muted-foreground mt-1">{duration}</span>
      <span className="text-[12px] text-muted-foreground mt-1">{quality}</span>
      <span className="text-[12px] text-muted-foreground mt-1">{status}</span>
      <div className="gap-2 flex">
        <Button
          className="h-9 bg-dark-card hover:bg-light-card"
          onClick={onDownloadHighQuality}
        >
          <HiDownload className="!w-4 !h-4" />
          <span className="spl-5 text-[10px]">High quality</span>
        </Button>
        <Button
          className="h-9 bg-dark-card hover:bg-light-card"
          onClick={onDownload}
        >
          <HiDownload className="!w-4 !h-4" />
          <span className="spl-5 text-[10px]">Download</span>
        </Button>
      </div>
    </div>
  );
}

export default RecordingCard;
