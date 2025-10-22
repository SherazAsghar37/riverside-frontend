import React from "react";
import { Button } from "@/components/ui/button";
import { BsRecord2 } from "react-icons/bs";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { TbVideo, TbVideoOff } from "react-icons/tb";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { ImPhoneHangUp } from "react-icons/im";
import { RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setCameraOffState,
  setMuteState,
  setScreenShareState,
} from "../sessionSlice";

interface CallControlsProps {
  stream?: MediaStream;
  isHost: boolean;
}

function CallControls({ stream, isHost }: CallControlsProps) {
  const [deafenStatus, setDeafenStatus] = React.useState(false);

  const { controlState } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();

  const onMicStateChange = () => {
    if (controlState.isMuted) {
      dispatch(setMuteState(false));
    } else {
      dispatch(setMuteState(true));
    }
  };

  const onCameraStateChange = () => {
    if (controlState.isCameraOff) {
      dispatch(setCameraOffState(false));
    } else {
      dispatch(setCameraOffState(true));
    }
  };

  const onDeafenStateChange = () => {
    if (deafenStatus) {
      disableDeafen();
      setDeafenStatus(false);
    } else {
      enableDeafen();
      setDeafenStatus(true);
    }
  };

  const onScreenShareToggle = () => {
    if (controlState.isScreenSharing) {
      dispatch(setScreenShareState(false));
    } else {
      dispatch(setScreenShareState(true));
    }
  };

  const enableDeafen = () => {};
  const disableDeafen = () => {};

  return (
    <>
      <div className="flex justify-center items-center gap-2 p-2">
        {isHost && (
          <Button className="bg-red-600 hover:bg-red-400">
            <BsRecord2 className="!w-5 !h-7" />
            <span>Record</span>
          </Button>
        )}
        <Button
          className="bg-light-card rounded-lg hover:bg-card"
          onClick={onMicStateChange}
        >
          {!controlState.isMuted ? (
            <BiMicrophone className="!w-5 !h-7 " />
          ) : (
            <BiMicrophoneOff color="red" className="!w-5 !h-7" />
          )}
        </Button>
        <Button
          className="bg-light-card rounded-lg hover:bg-card"
          onClick={onCameraStateChange}
        >
          {!controlState.isCameraOff ? (
            <TbVideo className="!w-5 !h-7 " />
          ) : (
            <TbVideoOff color="red" className="!w-5 !h-7" />
          )}
        </Button>
        <Button
          className="bg-light-card rounded-lg hover:bg-card"
          onClick={onDeafenStateChange}
        >
          {deafenStatus ? (
            <HiOutlineSpeakerWave className="!w-5 !h-7" />
          ) : (
            <HiOutlineSpeakerXMark color="red" className="!w-5 !h-7" />
          )}
        </Button>
        <Button
          className={`bg-light-card rounded-lg hover:bg-card `}
          onClick={onScreenShareToggle}
        >
          {controlState.isScreenSharing ? (
            <LuScreenShareOff color="red" className="!w-5 !h-7" />
          ) : (
            <LuScreenShare className="!w-5 !h-7" />
          )}
        </Button>
        <Button className="bg-red-950 hover:bg-red-900 rounded-lg">
          <ImPhoneHangUp color="red" className="!w-5 !h-7" />
        </Button>
      </div>
    </>
  );
}

export default CallControls;
