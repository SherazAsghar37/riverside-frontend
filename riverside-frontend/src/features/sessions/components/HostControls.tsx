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
import { setCameraOffState, setMuteState } from "../sessionSlice";

interface CallControlsProps {
  stream?: MediaStream;
  isHost: boolean;
}

function CallControls({ stream, isHost }: CallControlsProps) {
  const [deafenStatus, setDeafenStatus] = React.useState(false);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);

  const { controlState } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   if (stream) {
  //     const audioEnabled = stream
  //       .getAudioTracks()
  //       .some((track) => track.enabled);
  //     const videoEnabled = stream
  //       .getVideoTracks()
  //       .some((track) => track.enabled);

  //     // dispatch(setMuteState(!audioEnabled));
  //     // dispatch(setCameraOffState(!videoEnabled));
  //   }
  // }, [stream]);

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

  const enableDeafen = () => {};
  const disableDeafen = () => {};

  /** Screen Share */
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      if (stream) {
        // Replace current camera track with screen track
        const sender = (stream as any)
          ?.getTracks()
          .find((track) => track.kind === "video");

        // Stop old track
        if (sender) sender.stop();

        stream.addTrack(screenTrack);
      }

      setIsScreenSharing(true);

      // Listen for when user stops screen share manually
      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  const stopScreenShare = async () => {
    if (!isScreenSharing) return;

    stream?.getVideoTracks().forEach((track) => track.stop());

    // Restart camera
    const camStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const camTrack = camStream.getVideoTracks()[0];
    if (camTrack && stream) {
      stream.addTrack(camTrack);
    }

    setIsScreenSharing(false);
  };

  const onScreenShareToggle = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center gap-2 p-4">
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
          {isScreenSharing ? (
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
