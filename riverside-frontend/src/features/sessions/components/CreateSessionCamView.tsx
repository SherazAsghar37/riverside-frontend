import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { TbVideo, TbVideoOff } from "react-icons/tb";

import {
  HiOutlineVideoCameraSlash,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { TbMicrophoneOff, TbMicrophoneFilled } from "react-icons/tb";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { Root } from "react-dom/client";
import { RootState } from "@/app/store";
import { setCameraOffState, setMuteState } from "../sessionSlice";

interface CreateSessionCamViewProps {
  stream: MediaStream | null;
  onAllowAccess?: () => void;
}

// Accept stream prop
function CreateSessionCamView({
  stream,
  onAllowAccess,
}: CreateSessionCamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDevice, setVideoDevice] = useState<string | null>(null);
  const [audioDevice, setAudioDevice] = useState<string | null>(null);

  const { controlState } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  useEffect(() => {
    if (stream) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInput = devices.find((d) => d.kind === "videoinput");
        const audioInput = devices.find((d) => d.kind === "audioinput");
        setVideoDevice(videoInput ? videoInput.label : "Unknown Camera");
        setAudioDevice(audioInput ? audioInput.label : "Unknown Microphone");
      });
    }
  }, [stream]);

  const onMicStateChange = () => {
    if (controlState.isMuted) {
      unmuteMic();
    } else {
      muteMic();
    }
  };

  const muteMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = false));
      dispatch(setMuteState(true));
    }
  };

  const unmuteMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = true));
      dispatch(setMuteState(false));
    }
  };
  const onCameraStateChange = () => {
    if (controlState.isCameraOff) {
      enabledCamera();
    } else {
      disableCamera();
    }
  };

  const enabledCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = true));
      dispatch(setCameraOffState(false));
    }
  };

  const disableCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = false));
      dispatch(setCameraOffState(true));
    }
  };

  const camBlocked = !stream;
  const micBlocked = !stream || !stream.getAudioTracks().length;

  return (
    <div className="w-[400px] bg-[var(--dark-card)] p-5 rounded-lg">
      <div className="mb-6 bg-card px-4 py-2 rounded-lg h-48 flex flex-col justify-center items-center">
        {camBlocked ? (
          <>
            <p className="text-[13px]">Camera access is blocked.</p>
            <Button
              className="bg-card hover:bg-card text-primary"
              onClick={onAllowAccess}
            >
              Allow Access
            </Button>
          </>
        ) : (
          <>
            <div className="relative w-[320px] h-[180px] flex items-center justify-center gap-2">
              <video
                ref={videoRef}
                width={320}
                height={180}
                autoPlay
                muted
                className="rounded-lg bg-black absolute top-0 left-0 object-cover w-full h-full"
              />
              <div className="absolute bottom-1 ">
                <Button
                  className="bg-light-card rounded-lg hover:bg-card mr-1"
                  onClick={onMicStateChange}
                >
                  {!controlState.isMuted ? (
                    <BiMicrophone className="!w-5 !h-7 " />
                  ) : (
                    <BiMicrophoneOff color="red" className="!w-5 !h-7" />
                  )}
                </Button>
                <Button
                  className="bg-light-card rounded-lg hover:bg-card ml-1"
                  onClick={onCameraStateChange}
                >
                  {!controlState.isCameraOff ? (
                    <TbVideo className="!w-5 !h-7 " />
                  ) : (
                    <TbVideoOff color="red" className="!w-5 !h-7" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mb-2 bg-card px-4 py-[0.5rem] rounded-lg h-11 items-center w-[100%] gap-3 flex justify-start">
        {camBlocked ? (
          <HiOutlineVideoCameraSlash size={18} className="text-red-400" />
        ) : (
          <HiOutlineVideoCamera size={18} className="text-green-400" />
        )}
        <p className="text-[var(--muted-foreground)] text-[13px]">
          {camBlocked ? "Cam Blocked" : videoDevice}
        </p>
      </div>
      <div className="mb-2 bg-card px-4 py-[0.5rem] rounded-lg h-11 items-center w-[100%] gap-3 flex justify-start">
        {micBlocked ? (
          <TbMicrophoneOff size={18} className="text-red-400" />
        ) : (
          <TbMicrophoneFilled size={18} className="text-green-400" />
        )}
        <p className="text-[var(--muted-foreground)] text-[13px]">
          {micBlocked ? "Microphone Blocked" : audioDevice}
        </p>
      </div>
      <div className="mb-3 bg-card px-4 py-[0.5rem] rounded-lg h-11 items-center w-[100%] gap-3 flex justify-start">
        <HiOutlineSpeakerWave size={18} className="text-green-400" />
        <p className="text-[var(--muted-foreground)] text-[13px]">
          Default Speaker
        </p>
      </div>
    </div>
  );
}

export default CreateSessionCamView;
