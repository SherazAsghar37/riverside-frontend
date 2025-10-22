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
import { useNavigate } from "react-router-dom";
import {
  setCameraOffState,
  setMuteState,
  setScreenShareState,
  initializeSessionState,
} from "../sessionSlice";
import { sendFinalCallToEndOfRecordingApi } from "../sessionApi";

interface CallControlsProps {
  stream?: MediaStream;
  isHost: boolean;
  socket?: WebSocket | null;
}

function CallControls({ stream, isHost, socket }: CallControlsProps) {
  const [deafenStatus, setDeafenStatus] = React.useState(false);
  const [showEndOptions, setShowEndOptions] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const { controlState } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access session information for end-session API
  const { sessionInformation } = useSelector(
    (state: RootState) => state.session
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setShowEndOptions(false);
      }
    };

    if (showEndOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEndOptions]);

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

  const onLeave = () => {
    try {
      socket?.close();
    } catch (_) {}
    navigate("/dashboard");
    setTimeout(() => {
      dispatch(initializeSessionState());
    }, 10);
  };

  const onEndSession = async () => {
    try {
      if (sessionInformation?.sessionCode && sessionInformation?.sessionId) {
        await sendFinalCallToEndOfRecordingApi({
          sessionId: sessionInformation.sessionId,
        });
      }
    } catch (e) {
      console.error("Failed to end session on server:", e);
    } finally {
      try {
        socket?.close();
      } catch (_) {}
      navigate("/dashboard");
      setTimeout(() => {
        dispatch(initializeSessionState());
      }, 10);
    }
  };

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
        <div
          className="relative flex items-center justify-center"
          ref={overlayRef}
        >
          {showEndOptions && isHost && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-background border rounded-md shadow-md px-2 py-1 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground px-2 h-7"
                onClick={onLeave}
              >
                Leave
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="px-2 h-7"
                onClick={onEndSession}
              >
                End session
              </Button>
            </div>
          )}
          <Button
            className="bg-red-950 hover:bg-red-900 rounded-lg"
            onClick={() => (isHost ? setShowEndOptions((s) => !s) : onLeave())}
            aria-expanded={showEndOptions}
            aria-label="End call"
          >
            <ImPhoneHangUp color="red" className="!w-5 !h-7" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default CallControls;
