import { RootState } from "@/app/store";
import Utils from "@/app/utils";
import { IconButton } from "@/components/ui/icon-button";
import { ArrowLeftIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateSessionHeader() {
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-2 ">
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
    </>
  );
}

export default CreateSessionHeader;
