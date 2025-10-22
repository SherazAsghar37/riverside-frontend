import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Utils from "@/app/utils";
import { AlertCircle } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createSessionApi } from "../sessionApi";

interface CreateSessionInformationProps {
  onAllowAccess?: () => void;
  camBlocked: boolean;
  micBlocked: boolean;
  hostName?: string;
}
function CreateSessionInformation({
  onAllowAccess,
  camBlocked,
  micBlocked,
  hostName,
}: CreateSessionInformationProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { sessionInformation } = useSelector(
    (state: RootState) => state.session
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isJoiningAsHost = location.pathname.includes("host");
  const isCreatingSession = location.pathname.includes("create-session");
  const isJoiningAsParticipant = !isJoiningAsHost && !isCreatingSession;

  const sessionCode = searchParams.get("session-code");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usingHeadphonesIndex, setUsingHeadphonesIndex] = useState(-1);

  async function handleSessionAction() {
    setError(null);
    setIsLoading(true);
    if (isCreatingSession) {
      await createSession();
    } else if (isJoiningAsHost) {
      navigate(`/host?session-code=${sessionCode}`, {
        state: { sessionId: location?.state?.sessionId },
      });
    } else {
      navigate(`/participant?session-code=${sessionCode}`, {
        state: { sessionId: location?.state?.sessionId },
      });
    }
  }

  const createSession = async () => {
    try {
      const response: any = await createSessionApi();
      const data = response.data;
      if (response.status === 200) {
        // do next stuff
        console.log(data);
        const sessionCode = data.sessionCode;
        const sessionId = data.sessionId;
        navigate(`/host?session-code=${sessionCode}`, {
          state: { sessionId: sessionId },
        });
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;
        console.log("Status : ", status);
        console.log("Message : ", message);
        if (status === 400) {
          setError(message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div>
        <p className="text-muted-foreground text-[14px] mb-1">
          You're about to join{" "}
          {Utils.capitalize(sessionInformation?.hostName ?? hostName ?? "")}'s
          Studio
        </p>
        <h1 className="text-2xl font-bold text-white mb-6">
          Let's check your cam and mic
        </h1>
        <div className="mb-4 bg-card px-4 py-[0.5rem] rounded-lg flex justify-between items-center">
          <p className="text-[14px]">
            {Utils.capitalize(sessionInformation?.hostName ?? hostName ?? "")}
          </p>
          <p className="bg-[var(--light-card)] px-3 py-1 rounded-[4px] text-[13px] text-[var(--muted-foreground)]">
            Host
          </p>
        </div>
        <div className="mb-3 gap-3 flex">
          <Button
            className="text-[12px] font-normal bg-card text-[var(--muted-foreground)] hover:text-white"
            selected={usingHeadphonesIndex === 0}
            onClick={() => {
              setUsingHeadphonesIndex(0);
            }}
          >
            I am not using headphones
          </Button>
          <Button
            className="text-[12px] font-normal bg-card text-[var(--muted-foreground)] hover:text-white"
            selected={usingHeadphonesIndex === 1}
            onClick={() => {
              setUsingHeadphonesIndex(1);
            }}
          >
            I am using headphones
          </Button>
        </div>
        {error && (
          <div className="mb-2 bg-red-900/20 border border-red-800 text-red-400 px-4 py-2 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-4 mr-3 shrink-0" />
            <span className="text-[11px]">{error}</span>
          </div>
        )}

        {(camBlocked || micBlocked) && (
          <Button className="flex w-[100%] h-10" onClick={onAllowAccess}>
            Allow Access
          </Button>
        )}
        {!(camBlocked || micBlocked) && (
          <Button
            className="flex w-[100%] h-10"
            onClick={handleSessionAction}
            isLoading={isLoading}
            disabled={
              usingHeadphonesIndex === -1 ||
              (!sessionInformation && isJoiningAsParticipant)
            }
          >
            {isCreatingSession
              ? "Create Session"
              : isJoiningAsHost
              ? "Join as Host"
              : "Join Session"}
          </Button>
        )}
      </div>
    </>
  );
}

export default CreateSessionInformation;
