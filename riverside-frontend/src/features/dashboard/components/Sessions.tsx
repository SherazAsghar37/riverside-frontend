import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllSessionsApi, SessionInformationType } from "../dashboardApi";
import SessionInfoCard from "./SessionInfoCard";

function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionInformationType[]>([]);

  useEffect(() => {
    async function runFetchAllSessions() {
      const response = await fetchAllSessionsApi();
      if(response.status==200){
        console.log(response.data);
      setSessions(response.data.sessions);
      }else{
        console.log(response.data);
      }
    }
    runFetchAllSessions();
  }, []);

  return (
    <>
      <div>
        <h5 className="font-semibold text-muted-foreground">Sessions</h5>
        <div className="flex flex-wrap justify-center gap-4 my-2 mx-2">
          {sessions && sessions.length > 1 ? (
            sessions.map((session) => (
              <SessionInfoCard
                key={session.id}
                sessionId={session.id}
                sessionCode={session.sessionCode}
                createdAt={session.createdAt}
                scheduledAt={session.scheduledAt}
                status={session.status}
              />
            ))
          ) : (
            <p>No sessions available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Sessions;
