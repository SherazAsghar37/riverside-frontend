import Utils from "@/app/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IoVideocamOutline } from "react-icons/io5";

interface SessionInfoCardProps {
  createdAt: string;
  scheduledAt: string | null;
  status: string;
}

function SessionInfoCard({
  createdAt,
  scheduledAt,
  status,
}: SessionInfoCardProps) {
  const onJoin = () => {
    if (status === "Created") {
    }
  };

  return (
    <>
      <div className="p-2 bg-light-card rounded-xl max-w-[18rem] flex flex-col my-2">
        {/* Video Placeholder */}
        <div className="w-full aspect-[1920/1080] bg-dark-card rounded-lg flex items-center justify-center h-40">
          <p className="text-muted-foreground text-[10px]">
            No Preview Available
          </p>
        </div>

        {/* This will push content to bottom */}
        <div className="flex flex-col flex-1 justify-between w-full">
          <div className="flex items-center justify-between mt-2 mb-3 w-full">
            <div className="flex gap-2">
              <IoVideocamOutline color="var(--muted-foreground)" />
              <p className="text-muted-foreground text-[10px]">
                {scheduledAt
                  ? Utils.renderDateTime(scheduledAt.toString())
                  : Utils.renderDateTime(createdAt.toString())}
              </p>
            </div>
            <p className="text-muted-foreground font-semibold text-[10px]">
              {status}
            </p>
          </div>

          <Button className="w-full">
            <Plus />
            Join
          </Button>
        </div>
      </div>
    </>
  );
}

export default SessionInfoCard;
