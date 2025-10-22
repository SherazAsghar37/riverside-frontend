import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setConnectionStatus, setIsConnected } from "../sessionSlice";
import { wsBaseUrl } from "../../../api/api";

interface UseWebSocketHandlerOptions {
  sessionId?: string;
  token?: string;
  url?: string;
  onRTPCapabilitiesReceived?: (msg: any) => void;
  createDevice?: (ws: WebSocket, msg: any) => void;
  onSenderTransportCreated?: (msg: any, ws: WebSocket) => void;
  onProducerCreated?: (msg: any, ws: WebSocket) => void;
  onReceiveTransportCreated?: (msg: any, ws: WebSocket) => Promise<void>;
  onConsumerCreated?: (ws: WebSocket, msg: any) => Promise<void>;
  onNewProducerJoined: (ws: WebSocket, msg: any) => void;
  onProducerPaused: (msg: any) => void;
  onDisconnected: (msg: any) => void;
  onSessionEnded?: (msg: any) => void;
}

export const useWebSocketHandler = ({
  sessionId,
  token,
  url = wsBaseUrl,
  onRTPCapabilitiesReceived,
  createDevice,
  onSenderTransportCreated,
  onProducerCreated,
  onReceiveTransportCreated,
  onConsumerCreated,
  onNewProducerJoined,
  onProducerPaused,
  onDisconnected,
  onSessionEnded,
}: UseWebSocketHandlerOptions) => {
  const dispatch = useDispatch();

  const socketRef = useRef<WebSocket | null>(null);

  const connectSocket = () => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected, SessionId ", sessionId);
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
          onUserJoined?.();
          break;
        case "routerRtpCapabilities":
          onRTPCapabilitiesReceived?.(msg);
          createDevice?.(ws, msg);
          break;
        case "sendTransportCreated":
          onSenderTransportCreated?.(msg, ws);
          break;
        case "receiveTransportCreated":
          onReceiveTransportCreated?.(msg, ws);
          break;
        case "senderTransportConnected":
          console.log("Transport connected");
          break;
        case "producerCreated":
          onProducerCreated?.(msg, ws);
          break;
        case "receiveTransportConnected":
          break;
        case "newProducerJoined":
          onNewProducerJoined?.(ws, msg);
          break;
        case "consumerCreated":
          onConsumerCreated?.(ws, msg);
          break;
        case "producerPaused":
          onProducerPaused?.(msg);
          break;
        case "userDisconnected":
          onDisconnected?.(msg);
          break;
        case "sessionEnded":
          console.log("Session ended message received");
          onSessionEnded?.(msg);
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
  };

  const onUserJoined = () => {
    getRtpCapabilities();
    console.log("WebSocket joined room:", sessionId);
  };

  const getRtpCapabilities = () => {
    socketRef.current?.send(JSON.stringify({ type: "getRTPCapabilities" }));
  };

  const onSocketError = (error: any) => {
    console.error("WebSocket error:", error);
    setIsConnected(false);
    setConnectionStatus("Connection Error");
  };

  return {
    socket: socketRef.current,
    connectSocket,
  };
};
