import { Device } from "mediasoup-client";
import { type Consumer } from "mediasoup-client/types";
import { useRef, useState } from "react";

type Params = {
  encoding: {
    rid: string;
    maxBitrate: number;
    scalabilityMode: string;
  }[];
  codecOptions: {
    videoGoogleStartBitrate: number;
  };
  track?: MediaStreamTrack;
};

const useMediasoup = () => {
  const consumers = new Map<string, Consumer>();
  const [streams, setStreams] = useState<Map<string, MediaStream>>(new Map());

  const consumerTransportRef = useRef<any | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const paramRef = useRef<Params | null>(null);

  const deviceRef = useRef<any>(null);

  const rtpCapabilitiesRef = useRef<any>(null);

  let pendingProduceCallback: ((arg0: { id: any }) => void) | null = null;

  const initializeStreamInsideMediasoup = (
    stream: MediaStream,
    params: Params
  ) => {
    streamRef.current = stream;
    paramRef.current = params;
    console.log("Stream in initializeStreamInsideMediasoup: ", stream);
  };

  const onRTPCapabilitiesReceived = (msg: any) => {
    console.log("RTP Capabilities: ", msg.data);
  };

  const createDevice = async (ws: WebSocket, msg: any) => {
    try {
      const newDevice = new Device();
      const rtpCapabilities = msg.data;
      console.log("RTP Capabilities in createDevice: ", rtpCapabilities);
      await newDevice.load({ routerRtpCapabilities: rtpCapabilities });

      rtpCapabilitiesRef.current = rtpCapabilities;

      deviceRef.current = newDevice;

      ws?.send(JSON.stringify({ type: "createSendTransport" }));
    } catch (error: any) {
      console.log(error);
      if (error.name === "UnsupportedError") {
        console.error("Browser not supported");
      }
    }
  };

  const onSenderTransportCreated = async (msg: any, ws: WebSocket) => {
    console.log("Sender Transport Params: ", msg.data);
    const params = msg.data;
    let transport = deviceRef.current?.createSendTransport(params);

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
              userType: "sender",
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
              type: "transportProducer",
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

    await connectSendTransport(transport);
  };

  const connectSendTransport = async (producerTransport: any) => {
    const stream = streamRef.current;
    const params = paramRef.current;
    console.log("Params in connectSendTransport: ", params);
    console.log("Connecting Send Transport...");
    console.log("Stream in connectSendTransport: ", stream);

    const audioTrack = stream?.getAudioTracks()[0];

    // produce video
    const localProducer = await producerTransport?.produce({
      track: params?.track,
      encodings: params?.encoding, // simulcast/SVC layers
      codecOptions: params?.codecOptions,
    });

    // await producerTransport?.produce({
    //   track: audioTrack,
    //   encodings: params?.encoding, // simulcast/SVC layers
    //   codecOptions: params?.codecOptions,
    // });

    // Event handlers for track ending and transport closing events
    localProducer?.on("trackended", () => {
      console.log("trackended");
    });
    localProducer?.on("transportclose", () => {
      console.log("transportclose");
    });
  };

  const onProducerCreated = async (msg: any, ws: WebSocket) => {
    console.log("Producer created with ID:", msg.data);
    if (pendingProduceCallback) {
      pendingProduceCallback({ id: msg.data });
      pendingProduceCallback = null;
    }
    ws.send(JSON.stringify({ type: "createReceiveTransport" }));
  };

  const onReceiveTransportCreated = async (msg: any, ws: WebSocket) => {
    console.log("Receive Transport Params: ", msg.data);
    const params = msg.data;
    let transport = deviceRef.current?.createRecvTransport(params);
    consumerTransportRef.current = transport;

    transport?.on(
      "connect",
      async ({ dtlsParameters }: any, callback: any, errback: any) => {
        try {
          // Notifying the server to connect the receive transport with the provided DTLS parameters
          await ws.send(
            JSON.stringify({
              userType: "receiver",
              type: "connectTransport",
              transportId: transport.id,
              dtlsParameters: JSON.stringify(dtlsParameters),
            })
          );
          console.log("----------> consumer transport has connected");
          callback();
        } catch (error) {
          errback(error);
        }
      }
    );
  };

  const onNewProducerJoined = async (ws: WebSocket, msg: any) => {
    console.log("Server producerId", msg.data.id);
    console.log("My producerId", msg.data.producerId);
    ws.send(
      JSON.stringify({
        type: "transportConsumer",
        transportId: consumerTransportRef.current?.id,
        producerId: msg.data.id,
        kind: msg.data.kind,
        rtpCapabilities: JSON.stringify(rtpCapabilitiesRef.current),
      })
    );
    console.log("New producer joined with ID:", {
      type: "transportConsumer",
      transportId: consumerTransportRef.current?.id,
      producerId: msg.data.id,
      kind: msg.data.kind,
      rtpCapabilities: JSON.stringify(rtpCapabilitiesRef.current),
    });
  };

  const onConsumerCreated = async (ws: WebSocket, msg: any) => {
    // Consuming media using the receive transport
    const params = msg.data;
    const kind = JSON.parse(params.kind);
    const rtpParameters = JSON.parse(params.rtpParameters);

    let consumer = await consumerTransportRef.current?.consume({
      id: params.id,
      producerId: params.producerId,
      kind: kind,
      rtpParameters: rtpParameters,
    });

    // Accessing the media track from the consumer
    const { track } = consumer!;
    console.log("************** track", track);

    // Attaching the media track to the remote video element for playback
    // if (remoteVideoRef.current) {
    //   remoteVideoRef.current.srcObject = new MediaStream([track]);
    //   console.log("----------> remote video attached", remoteVideoRef.current);
    // }

    consumers.set(consumer.id, consumer!);
    setStreams((prev) =>
      new Map(prev).set(consumer.id, new MediaStream([track]))
    );

    // Notifying the server to resume media consumption
    ws.send(JSON.stringify({ type: "resumeReceiver", consumerId: params.id }));
    console.log("----------> consumer transport has resumed");
  };

  return {
    onRTPCapabilitiesReceived,
    createDevice,
    onSenderTransportCreated,
    onProducerCreated,
    onReceiveTransportCreated,
    onNewProducerJoined,
    onConsumerCreated,
    initializeStreamInsideMediasoup,
    connectSendTransport,
    streams,
  };
};

export { useMediasoup };
