import ConsumerManager from "@/services/ConsumerManager";
import { Device } from "mediasoup-client";
import { type Consumer } from "mediasoup-client/types";
import { useEffect, useRef, useState } from "react";

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

type ConsumerParams = {
  id: string;
  producerId: string;
  kind: string;
  rtpParameters: any;
  consumer: Consumer;
};

type MediaSource = {
  audioStream: MediaStream | null;
  videoStream: MediaStream | null;
  audioConsumer: ConsumerParams | null;
  videoConsumer: ConsumerParams | null;
};

type ConsumerInformation = {
  source1: MediaSource | null; //camera
  source2: MediaSource | null; //screen
};

const useMediasoup = () => {
  const consumerManagerRef = useRef<ConsumerManager>(new ConsumerManager());

  const audioProducerRef = useRef<any | null>(null);
  const cameraProducerRef = useRef<any | null>(null);
  const screenProducerRef = useRef<any | null>(null);
  const screenAudioProducerRef = useRef<any | null>(null);

  const producerTransportRef = useRef<any | null>(null);
  const consumerTransportRef = useRef<any | null>(null);

  const deviceRef = useRef<any>(null);

  const rtpCapabilitiesRef = useRef<any>(null);

  let pendingProduceCallback: ((arg0: { id: any }) => void) | null = null;

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      consumerManagerRef.current.cleanup();
      audioProducerRef.current = null;
      cameraProducerRef.current = null;
      screenProducerRef.current = null;

      producerTransportRef.current = null;
      consumerTransportRef.current = null;

      deviceRef.current = null;

      rtpCapabilitiesRef.current = null;
      pendingProduceCallback = null;
    };
  }, []);

  const onRTPCapabilitiesReceived = (msg: any) => {
    console.log("RTP Capabilities: ", msg.data);
  };

  const createDevice = async (ws: WebSocket, msg: any) => {
    try {
      wsRef.current = ws;

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
    producerTransportRef.current = transport;

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

    ws.send(JSON.stringify({ type: "createReceiveTransport" }));
  };

  const onReceiveTransportCreated = async (msg: any, ws: WebSocket) => {
    console.log("Receive Transport Params: ", msg.data);
    const params = msg.data;
    let transport = deviceRef.current?.createRecvTransport(params);
    consumerTransportRef.current = transport;

    //start consuming all producers
    msg.producers.forEach((producer: any) => {
      startConsumingProducer(ws, producer);
    });

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

  const produceStream = async (stream: MediaStream, params: Params) => {
    console.log("Params in connectSendTransport: ", params);
    console.log("Connecting Send Transport...");
    console.log("Stream in connectSendTransport: ", stream);

    const localProducer = await producerTransportRef.current?.produce({
      track: params?.track,
      encodings: params?.encoding,
      codecOptions: params?.codecOptions,
    });

    localProducer?.on("trackended", () => {
      console.log("trackended");
    });
    localProducer?.on("transportclose", () => {
      console.log("transportclose");
    });

    return localProducer;
  };

  const produceAudio = async (stream: MediaStream, params: Params) => {
    if (audioProducerRef.current) {
      console.log("Audio producer already exists");
      return audioProducerRef.current;
    }

    const localProducer = await produceStream(stream, params);
    audioProducerRef.current = localProducer;
    return localProducer;
  };

  const produceCamera = async (stream: MediaStream, params: Params) => {
    if (cameraProducerRef.current) {
      console.log("Camera producer already exists");
      return cameraProducerRef.current;
    }

    const localProducer = await produceStream(stream, params);
    cameraProducerRef.current = localProducer;
    return localProducer;
  };

  const produceScreen = async (stream: MediaStream, params: Params) => {
    if (screenProducerRef.current) {
      console.log("Screen producer already exists");
      return screenProducerRef.current;
    }

    const localProducer = await produceStream(stream, params);
    screenProducerRef.current = localProducer;
    return localProducer;
  };

  const produceScreenAudio = async (stream: MediaStream, params: Params) => {
    if (screenAudioProducerRef.current) {
      console.log("Screen Audio producer already exists");
      return screenAudioProducerRef.current;
    }

    const localProducer = await produceStream(stream, params);
    screenAudioProducerRef.current = localProducer;
    return localProducer;
  };

  const stopProducingCamera = () => {
    if (cameraProducerRef.current) {
      cameraProducerRef.current.close();
      cameraProducerRef.current = null;

      wsRef.current?.send(
        JSON.stringify({
          type: "closeProducer",
          producerId: cameraProducerRef.current?.id,
        })
      );
    }
  };

  const stopProducingScreen = () => {
    if (screenProducerRef.current) {
      screenProducerRef.current.close();
      screenProducerRef.current = null;

      wsRef.current?.send(
        JSON.stringify({
          type: "closeProducer",
          producerId: screenProducerRef.current?.id,
        })
      );
    }
  };

  const onProducerCreated = async (msg: any, ws: WebSocket) => {
    console.log("Producer created with ID:", msg.data);
    if (pendingProduceCallback) {
      pendingProduceCallback({ id: msg.data });
      pendingProduceCallback = null;
    }
  };

  const onNewProducerJoined = async (ws: WebSocket, msg: any) => {
    console.log("Server producerId", msg.data.id);
    console.log("My producerId", msg.data.producerId);
    console.log("Producer userId", msg.data.userId);

    //send a request to server to create a consumer
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

  const startConsumingProducer = async (ws: WebSocket, producer: any) => {
    const msg = JSON.parse(producer);
    console.log("Server producerId", msg.producer.id);
    console.log("My producerId", msg.data.producerId);
    console.log("Producer userId", msg.producer.userId);

    //send a request to server to create a consumer
    ws.send(
      JSON.stringify({
        type: "transportConsumer",
        transportId: consumerTransportRef.current?.id,
        producerId: msg.producer.id,
        kind: msg.producer.kind,
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
    try {
      const params = msg.data;
      const kind = JSON.parse(params.kind);
      const rtpParameters = JSON.parse(params.rtpParameters);

      // Extract from server message - adjust based on your server implementation
      const participantId =
        params.participantId || params.appData?.participantId;
      const sourceType =
        params.sourceType || params.appData?.sourceType || "camera";

      if (!participantId) {
        console.error("No participantId provided in consumer message");
        return;
      }

      // Create consumer
      let consumer = await consumerTransportRef.current?.consume({
        id: params.id,
        producerId: params.producerId,
        kind: kind,
        rtpParameters: rtpParameters,
      });

      if (!consumer) {
        console.error("Failed to create consumer");
        return;
      }

      // Add to consumer manager
      consumerManagerRef.current.addConsumer(participantId, consumer, {
        id: params.id,
        producerId: params.producerId,
        kind: kind,
        rtpParameters: rtpParameters,
      });

      // Resume consumer
      ws.send(
        JSON.stringify({ type: "resumeReceiver", consumerId: params.id })
      );

      // Handle track end
      const { track } = consumer;
      track.onended = () => {
        consumerManagerRef.current.removeConsumer(
          participantId,
          consumer.id,
          sourceType,
          kind
        );
      };

      console.log(
        `Consumer created and managed for ${participantId} (${sourceType} ${kind})`
      );
    } catch (error) {
      console.error("Error in onConsumerCreated:", error);
    }
  };

  return {
    onRTPCapabilitiesReceived,
    createDevice,
    onSenderTransportCreated,
    onProducerCreated,
    onReceiveTransportCreated,
    onNewProducerJoined,
    onConsumerCreated,
    produceAudio,
    produceCamera,
    produceScreen,
    produceScreenAudio,
    stopProducingCamera,
    stopProducingScreen,
    audioProducerRef,
    cameraProducerRef,
    screenProducerRef,
    screenAudioProducerRef,
    consumerManagerRef,
  };
};

export { useMediasoup };
