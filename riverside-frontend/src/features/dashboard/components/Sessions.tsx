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
      console.log(response.data);
      setSessions(response.data.sessions);
    }
    runFetchAllSessions();
  }, []);

  return (
    <>
      <div>
        <h5 className="font-semibold text-muted-foreground">Sessions</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2 mx-2">
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
