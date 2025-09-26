import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Play,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardActions() {
  const navigator = useNavigate();
  const onRecordingClick = () => {
    navigator("/create-session");
  };
  return (
    <>
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-foreground mb-6">
          Welcome back!
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  items-center gap-4 justify-center">
          <Button
            size="lg"
            className="h-10 bg-[red] hover:bg-[red]/80 text-primary-foreground"
            onClick={onRecordingClick}
          >
            <Video className="mr-2 h-5 w-5" />
            Start Recording
          </Button>
          <Button variant="outline" size="lg" className="h-10 bg-transparent">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Call
          </Button>
          <Button variant="outline" size="lg" className="h-10 bg-transparent">
            <Users className="mr-2 h-5 w-5" />
            Invite Guests
          </Button>
          <Button variant="outline" size="lg" className="h-10 bg-transparent">
            <Upload className="mr-2 h-5 w-5" />
            Upload recording
          </Button>
        </div>
      </div>
    </>
  );
}

export default DashboardActions;
