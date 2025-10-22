import ConsumerManager from "@/services/ConsumerManager";
import { Device } from "mediasoup-client";
import { type Consumer } from "mediasoup-client/types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMediasoupSetupDone } from "../sessionSlice";
import useConsumerManager from "@/services/ConsumerManager";
import { useConsumerContext } from "../contexts/ConsumerContext";
import { RootState } from "@/app/store";

type Params = {
  encodings: any;
  codecOptions: any;
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
  const { cleanup, addConsumer, removeConsumer, removeParticipant } =
    useConsumerContext();

  const audioProducerRef = useRef<any | null>(null);
  const cameraProducerRef = useRef<any | null>(null);
  const screenProducerRef = useRef<any | null>(null);
  const screenAudioProducerRef = useRef<any | null>(null);

  const producerTransportRef = useRef<any | null>(null);
  const consumerTransportRef = useRef<any | null>(null);

  const deviceRef = useRef<any>(null);

  const rtpCapabilitiesRef = useRef<any>(null);

  const dispatch = useDispatch();

  let pendingProduceCallback: ((arg0: { id: any }) => void) | null = null;

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
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
        { kind, rtpParameters, appData }: any,
        callback: any,
        errorCallback: any
      ) => {
        try {
          console.log("Producing with RTP parameters:", rtpParameters);
          ws?.send(
            JSON.stringify({
              type: "createProducer",
              transportId: transport.id,
              kind: kind,
              rtpParameters: JSON.stringify(rtpParameters),
              appData: JSON.stringify(appData),
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
    dispatch(setMediasoupSetupDone(true));
  };

  const produceStream = async (
    stream: MediaStream,
    params: Params,
    source: string,
    sourceId: string
  ) => {
    console.log("Stream in produce Stream: ", stream);

    const localProducer = await producerTransportRef.current?.produce({
      track: params?.track,
      encodings: params?.encodings,
      codecOptions: params?.codecOptions,
      appData: {
        source: source,
        streamId: stream.id,
        sourceId: sourceId,
        timeStamp: Date.now(),
      },
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

    const localProducer = await produceStream(
      stream,
      params,
      "camera",
      "camera_audio"
    );
    audioProducerRef.current = localProducer;
    return localProducer;
  };

  const pauseProducingAudio = () => {
    if (audioProducerRef.current) {
      audioProducerRef.current.pause();
    }
  };

  const resumeProducingAudio = () => {
    if (audioProducerRef.current) {
      audioProducerRef.current.resume();
    }
  };

  const produceCamera = async (stream: MediaStream, params: Params) => {
    if (cameraProducerRef.current) {
      console.log("Camera producer already exists");
      return cameraProducerRef.current;
    }

    const localProducer = await produceStream(
      stream,
      params,
      "camera",
      "camera_video"
    );
    cameraProducerRef.current = localProducer;
    return localProducer;
  };

  const produceScreen = async (stream: MediaStream, params: Params) => {
    if (screenProducerRef.current) {
      console.log("Screen producer already exists");
      return screenProducerRef.current;
    }

    const localProducer = await produceStream(
      stream,
      params,
      "screen",
      "screen_video"
    );
    screenProducerRef.current = localProducer;
    return localProducer;
  };

  const produceScreenAudio = async (stream: MediaStream, params: Params) => {
    if (screenAudioProducerRef.current) {
      console.log("Screen Audio producer already exists");
      return screenAudioProducerRef.current;
    }

    const localProducer = await produceStream(
      stream,
      params,
      "screen",
      "screen_audio"
    );
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
      wsRef.current?.send(
        JSON.stringify({
          type: "closeProducer",
          producerId: screenProducerRef.current?.id,
          source: "screen",
          kind: "video",
        })
      );
      screenProducerRef.current.close();
      screenProducerRef.current = null;
    }
  };

  const stopProducingScreenAudio = () => {
    if (screenAudioProducerRef.current) {
      wsRef.current?.send(
        JSON.stringify({
          type: "closeProducer",
          source: "screen",
          kind: "audio",
          producerId: screenAudioProducerRef.current?.id,
        })
      );
      screenAudioProducerRef.current.close();
      screenAudioProducerRef.current = null;
    }
  };

  const pauseProducing = (producer: any, source: string, kind: string) => {
    wsRef.current?.send(
      JSON.stringify({
        type: "pauseProducer",
        producerId: producer.id,
        source,
        kind,
      })
    );
  };

  const resumeProducing = (producer: any, source: string, kind: string) => {
    wsRef.current?.send(
      JSON.stringify({
        type: "resumeProducer",
        producerId: producer.id,
        source,
        kind,
      })
    );
  };

  const pauseProducingCamera = () => {
    if (cameraProducerRef.current) {
      cameraProducerRef.current.pause();
      pauseProducing(cameraProducerRef.current, "camera", "video");
    }
  };
  const resumeProducingCamera = () => {
    if (cameraProducerRef.current) {
      cameraProducerRef.current.resume();
      resumeProducing(cameraProducerRef.current, "camera", "video");
    }
  };

  const onProducerPaused = (msg: any) => {
    console.log("Producer paused:", msg);
    const { userId, source, kind } = msg.data;
    removeConsumer(userId, source, kind);
  };

  const onProducerCreated = async (msg: any, ws: WebSocket) => {
    console.log("Producer created with ID:", msg.data);
    if (pendingProduceCallback) {
      pendingProduceCallback({ id: msg.data });
      pendingProduceCallback = null;
    }


  };

  const onNewProducerJoined = async (ws: WebSocket, msg: any) => {
    console.log("New producer Joined", msg);
    ws.send(
      JSON.stringify({
        type: "createConsumer",
        transportId: consumerTransportRef.current?.id,
        producerId: msg.data.id,
        kind: msg.data.kind,
        participantId: msg.data.userId,
        userName: msg.data.userName,
        appData: msg.data.appData,
        rtpCapabilities: JSON.stringify(rtpCapabilitiesRef.current),
      })
    );
  };

  const startConsumingProducer = async (ws: WebSocket, producer: any) => {
    const msg = JSON.parse(producer);
    console.log("Start Consuming Producer on join", msg);
    ws.send(
      JSON.stringify({
        type: "createConsumer",
        transportId: consumerTransportRef.current?.id,
        producerId: msg.id,
        kind: msg.kind,
        userName: msg.userName,
        appData: msg.appData,
        participantId: msg.userId,
        rtpCapabilities: JSON.stringify(rtpCapabilitiesRef.current),
      })
    );
  };

  const onConsumerCreated = async (ws: WebSocket, msg: any) => {
    try {
      console.log("msg in onConsumerCreated", msg);
      const params = msg.data;
      const kind = params.kind;
      const rtpParameters = JSON.parse(params.rtpParameters);

      // Extract from server message - adjust based on your server implementation
      const participantId = msg.participantId;

      if (!participantId) {
        console.error("No participantId provided in consumer message");
        return;
      }

      console.log();

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
      addConsumer(participantId, consumer, params.appData, {
        id: params.id,
        producerId: params.producerId,
        kind: kind,
        rtpParameters: rtpParameters,
        userName: params.userName,
      });

      // Resume consumer
      ws.send(
        JSON.stringify({ type: "resumeReceiver", consumerId: params.id })
      );

      // Handle track end
      const { track } = consumer;
      track.onended = () => {
        removeConsumer(participantId, consumer.id, kind);
      };

      consumer.on("producerpause", () => {
        console.log("Remote user paused video");
        // Client UI can show "camera off" icon
      });

      consumer.on("producerresume", () => {
        console.log("Remote user resumed video");
        // Client UI shows video again
      });

      console.log(
        `Consumer created and managed for ${participantId}  ${kind})`
      );
    } catch (error) {
      console.error("Error in onConsumerCreated:", error);
    }
  };

  const onDisconnected = (msg: any) => {
    console.log("User disconnected:", msg);
    if (msg.participantId) {
      removeParticipant(msg.participantId);
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
    pauseProducingAudio,
    resumeProducingAudio,
    produceCamera,
    stopProducingCamera,
    pauseProducingCamera,
    resumeProducingCamera,
    produceScreen,
    produceScreenAudio,
    stopProducingScreen,
    stopProducingScreenAudio,
    onDisconnected,
    onProducerPaused,
    audioProducerRef,
    cameraProducerRef,
    screenProducerRef,
    screenAudioProducerRef,
  };
};

export { useMediasoup };
