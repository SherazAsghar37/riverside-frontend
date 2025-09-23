import { Button } from "@/components/ui/button";
import DashboardActions from "../components/DashboardActions";
import { Plus } from "lucide-react";
import { IoVideocamOutline } from "react-icons/io5";
import SessionInfoCard from "../components/SessionInfoCard";
import Sessions from "../components/Sessions";

function DashboardBody() {
  return (
    <>
      <div className="border m-2 flex-1 rounded-lg flex bg-secondary-background">
        <div className="p-5">
          <DashboardActions />

          <Sessions />
        </div>
      </div>
    </>
  );
}

export default DashboardBody;
