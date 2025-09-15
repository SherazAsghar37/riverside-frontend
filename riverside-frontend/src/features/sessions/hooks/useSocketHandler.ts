import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setConnectionStatus, setIsConnected } from "../sessionSlice";

interface UseWebSocketHandlerOptions {
  sessionId?: string;
  token?: string;
  url?: string;
  onRTPCapabilitiesReceived?: (msg: any) => void;
  createDevice?: (ws: WebSocket, msg: any) => void;
  onSenderTransportCreated?: (msg: any, ws: WebSocket) => void;
  onProducerCreated?: (msg: any) => void;
  onSocketError?: (msg: any) => void;
}

export const useWebSocketHandler = ({
  sessionId,
  token,
  url = "ws://localhost:8080/ws",
  onRTPCapabilitiesReceived,
  createDevice,
  onSenderTransportCreated,
  onProducerCreated,
}: UseWebSocketHandlerOptions) => {
  const dispatch = useDispatch();

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      dispatch(setIsConnected(true));
      dispatch(setConnectionStatus("Connected"));
      if (sessionId) {
        ws.send(
          JSON.stringify({
            type: "join",
            sessionId,
            token,
          })
        );
      }
    };

    ws.onclose = () => {
      dispatch(setIsConnected(false));
      dispatch(setConnectionStatus("Disconnected"));
      console.log("WebSocket disconnected");
    };

    ws.onerror = () => {
      dispatch(setIsConnected(false));
      dispatch(setConnectionStatus("Connection Error"));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("Message received: ", msg);

      switch (msg.type) {
        case "joined":
          onUserJoined?.(ws);
          break;
        case "routerRtpCapabilities":
          onRTPCapabilitiesReceived?.(msg);
          createDevice?.(ws, msg);
          break;
        case "sendTransportCreated":
          onSenderTransportCreated?.(msg, ws);
          break;
        case "transportConnected":
          console.log("Transport connected");
          break;
        case "producerCreated":
          onProducerCreated?.(msg);
          break;
        case "error":
          onSocketError?.(msg);
          break;
        default:
          console.log("Unknown message type:", msg.type);
      }
    };

    return () => {
      ws.close();
    };
  }, [sessionId, token, url]);

  const onUserJoined = (ws: WebSocket) => {
    setIsConnected(true);
    setConnectionStatus("Connected");

    console.log("WebSocket joined room:", sessionId);

    ws.send(JSON.stringify({ type: "getRTPCapabilities" }));
  };

  const onSocketError = (error: any) => {
    console.error("WebSocket error:", error);
    setIsConnected(false);
    setConnectionStatus("Connection Error");
  };

  return {
    socket: socketRef.current,
  };
};
