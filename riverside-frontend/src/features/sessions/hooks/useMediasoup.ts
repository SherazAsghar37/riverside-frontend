import { Device } from "mediasoup-client";
import { useState } from "react";

const useMediasoup = () => {
  const [device, setDevice] = useState<any>(null);

  let pendingProduceCallback: ((arg0: { id: any }) => void) | null = null;

  const onRTPCapabilitiesReceived = (msg: any) => {
    console.log("RTP Capabilities: ", msg.data);
  };

  const onSenderTransportCreated = (msg: any, ws: WebSocket) => {
    console.log("Sender Transport Params: ", msg.data);
    const params = msg.data;
    let transport = device?.createSendTransport(params);

    // connect event
    transport?.on(
      "connect",
      async ({ dtlsParameters }: any, callback: any, errorCallback: any) => {
        try {
          console.log(
            "Connecting transport with DTLS parameters:",
            dtlsParameters
          );
          ws?.send(
            JSON.stringify({
              type: "connectTransport",
              transportId: transport.id,
              dtlsParameters: JSON.stringify(dtlsParameters),
            })
          );
          callback(); // after server confirms
        } catch (err: any) {
          errorCallback(err);
        }
      }
    );

    // produce event
    transport?.on(
      "produce",
      async (
        { kind, rtpParameters }: any,
        callback: any,
        errorCallback: any
      ) => {
        try {
          console.log("Producing with RTP parameters:", rtpParameters);
          ws?.send(
            JSON.stringify({
              type: "transportProduce",
              transportId: transport.id,
              kind: JSON.stringify(kind),
              rtpParameters: JSON.stringify(rtpParameters),
            })
          );
          // Store the callback to be called when server responds with the producer ID
          pendingProduceCallback = callback;
          // callback({ id });
        } catch (err: any) {
          errorCallback(err);
        }
      }
    );
  };

  const onProducerCreated = (msg: any) => {
    console.log("Producer created with ID:", msg.id);
    if (pendingProduceCallback) {
      pendingProduceCallback({ id: msg.data });
      pendingProduceCallback = null;
    }
  };

  const createDevice = async (ws: WebSocket, msg: any) => {
    try {
      const newDevice = new Device();
      const rtpCapabilities = msg.data;
      console.log("RTP Capabilities in createDevice: ", rtpCapabilities);
      await newDevice.load({ routerRtpCapabilities: rtpCapabilities });

      setDevice(newDevice);

      ws?.send(JSON.stringify({ type: "createSendTransport" }));
    } catch (error: any) {
      console.log(error);
      if (error.name === "UnsupportedError") {
        console.error("Browser not supported");
      }
    }
  };

  return {
    onRTPCapabilitiesReceived,
    createDevice,
    onSenderTransportCreated,
    onProducerCreated,
  };
};

export { useMediasoup };
