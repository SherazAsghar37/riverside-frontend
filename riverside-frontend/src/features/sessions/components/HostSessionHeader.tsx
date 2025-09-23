import { RootState } from "@/app/store";
import Utils from "@/app/utils";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { ArrowLeftIcon, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TiUserAdd } from "react-icons/ti";

function HostSessionHeader() {
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 ">
        <div className="flex items-center gap-2 ">
          <IconButton className="h-9 bg-transparent" onClick={onBack}>
            <ArrowLeftIcon />
          </IconButton>
          <h1 className="text-[15px] tracking-[.10em] font-bold text-foreground">
            RIVERSIDE
          </h1>
          <span
            className="w-px h-4 bg-muted-foreground mx-2"
            aria-hidden="true"
          />
          <h1 className="text-[14px]  font-[500] text-foreground">
            {Utils.capitalize(user?.name ?? "")}'s studio
          </h1>
        </div>
        <div>
          <Button className="h-9 bg-card hover:bg-light-card">
            <TiUserAdd className="!w-5 !h-7 " />
            <span className="spl-5">Invite</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default HostSessionHeader;
