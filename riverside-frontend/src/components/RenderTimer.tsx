import { useEffect, useState } from "react";

function RenderTimer({ recordingStarTime }: { recordingStarTime: number }) {
  const [elapsed, setElapsed] = useState<string>("00:00:00");

  useEffect(() => {
    if (!recordingStarTime) return;

    const updateTimer = () => {
      const diffMs =
        new Date().getTime() - new Date(recordingStarTime).getTime();

      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);

      setElapsed(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [recordingStarTime]);

  return <span>{elapsed}</span>;
}

export default RenderTimer;
