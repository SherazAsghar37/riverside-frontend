import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HiOutlineVideoCameraSlash,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { TbMicrophoneOff, TbMicrophoneFilled } from "react-icons/tb";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";

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
            <video
              ref={videoRef}
              width={320}
              height={180}
              autoPlay
              muted
              className="rounded-lg bg-black"
            />
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
