import { Consumer } from "mediasoup-client/types";
import { useRef, useState } from "react";

type ConsumerParams = {
  id: string;
  producerId: string;
  kind: string;
  rtpParameters: any;
  consumer: Consumer;
};

type ConsumerMediaSource = {
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
  audioParams: ConsumerParams | null;
  videoParams: ConsumerParams | null;
};

type ConsumingStreamInformation = {
  mediaSources: Map<string, ConsumerMediaSource | null>;
};

const useConsumerManager = () => {
  //consumer id to consumer instance
  const consumers = useRef<Map<string, Consumer>>(new Map());
  //participant id to info
  const consumersInformation = useRef<Map<string, ConsumingStreamInformation>>(
    new Map()
  );

  // State for notifying updates
  const [updateNotification, setUpdateNotification] = useState<number>(0);

  // Helper function to trigger update notification
  const notifyUpdate = () => {
    setUpdateNotification((prev) => prev + 1);
  };

  /**
   * Add a new consumer for a participant
   */
  const addConsumer = (
    participantId: string,
    consumer: Consumer,
    appData: string,

    params: {
      id: string;
      producerId: string;
      kind: string;
      rtpParameters: any;
    }
  ): void => {
    const { track } = consumer;
    console.log(
      "Adding consumer:",
      consumer,
      "for participant:",
      participantId
    );

    const { source } = JSON.parse(appData);
    consumers.current.set(consumer.id, consumer);

    const consumerParams: ConsumerParams = {
      id: params.id,
      producerId: params.producerId,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
      consumer: consumer,
    };

    let participantInfo = consumersInformation.current.get(participantId);
    if (!participantInfo) {
      participantInfo = {
        mediaSources: new Map(),
      };
      consumersInformation.current.set(participantId, participantInfo);
    }

    let streamInfo = participantInfo.mediaSources.get(source);

    if (!streamInfo) {
      const mediaSource: ConsumerMediaSource = {
        videoStream: null,
        audioStream: null,
        audioParams: null,
        videoParams: null,
      };
      participantInfo.mediaSources.set(source, mediaSource);
      streamInfo = mediaSource;
    }

    if (params.kind === "audio") {
      streamInfo.audioStream = new MediaStream([track]);
      streamInfo.audioParams = consumerParams;
    } else {
      streamInfo.videoStream = new MediaStream([track]);
      streamInfo.videoParams = consumerParams;
    }

    participantInfo.mediaSources.set(source, streamInfo);
    consumersInformation.current.set(participantId, participantInfo);

    notifyUpdate();

    console.log(
      `Added ${params.kind} consumer for participant ${participantId} on stream ${source}`,
      consumer,
      streamInfo,
      participantInfo,
      consumersInformation.current
    );
  };

  /**
   * Remove a specific consumer
   */
  const removeConsumer = (
    participantId: string,
    consumerId: string,
    kind: string
  ): void => {
    const consumer = consumers.current.get(consumerId);
    if (consumer) {
      consumer.close();
      consumers.current.delete(consumerId);
    }

    // Remove from participant information
    const participantInfo = consumersInformation.current.get(participantId);
    if (participantInfo) {
      participantInfo.mediaSources.forEach(
        (mediaSource: ConsumerMediaSource, source: string) => {
          if (mediaSource) {
            if (
              kind === "audio" &&
              mediaSource.audioParams?.id === consumerId
            ) {
              // Remove audio stream and params
              mediaSource.audioStream = null;
              mediaSource.audioParams = null;
            } else if (
              kind === "video" &&
              mediaSource.videoParams?.id === consumerId
            ) {
              // Remove video stream and params
              mediaSource.videoStream = null;
              mediaSource.videoParams = null;
            }

            // If both audio and video params are null, remove the entire media source
            if (!mediaSource.audioParams && !mediaSource.videoParams) {
              participantInfo.mediaSources.delete(source);
            }
          }
        }
      );
    }

    // Notify that values have been updated
    notifyUpdate();

    console.log(`Removed ${kind} consumer for participant ${participantId}`);
  };

  /**
   * Remove all consumers for a participant (when they leave)
   */
  const removeParticipant = (participantId: string): void => {
    console.log("Removing participant:", participantId);
    const participantInfo = consumersInformation.current.get(participantId);
    if (participantInfo) {
      // Close all consumers for this participant
      participantInfo.mediaSources.forEach((mediaSource) => {
        if (mediaSource) {
          if (mediaSource.audioParams) {
            mediaSource.audioParams.consumer.close();
            consumers.current.delete(mediaSource.audioParams.id);
          }
          if (mediaSource.videoParams) {
            mediaSource.videoParams.consumer.close();
            consumers.current.delete(mediaSource.videoParams.id);
          }
        }
      });
      // Remove participant
      consumersInformation.current.delete(participantId);

      // Notify that values have been updated
      notifyUpdate();

      console.log(
        `Removed participant ${participantId} and all their consumers`
      );
    }
  };

  /**
   * Get camera streams for a participant
   */
  // getParticipantCameraStreams(participantId: string): MediaSource | null {
  //   const info = consumersInformation.current.get(participantId);
  //   return info?.source1 || null;
  // }

  // /**
  //  * Get screen share streams for a participant
  //  */
  // getParticipantScreenStreams(participantId: string): MediaSource | null {
  //   const info = consumersInformation.current.get(participantId);
  //   return info?.source2 |
  // getParticipantScreenStreams(participantId: string): MediaSource | null {
  //   const info = consumersInformation.current.get(participantId);
  //   return info?.source2 || null;
  // }

  /**
   * Get all information for a participant
   */
  const getParticipantInfo = (
    participantId: string
  ): ConsumingStreamInformation | null => {
    return consumersInformation.current.get(participantId) || null;
  };

  /**
   * Get all participant IDs
   */
  const getAllParticipants = (): string[] => {
    return Array.from(consumersInformation.current.keys()).map(
      (id) => id as string
    );
  };

  /**
   * Check if participant has camera
   */
  // hasCamera(participantId: string): boolean {
  //   const info = getParticipantInfo(participantId);
  //   return !!info?.source1?.videoStream;
  // }

  // /**
  //  * Check if participant has microphone
  //  */
  // hasMicrophone(participantId: string): boolean {
  //   const info = getParticipantInfo(participantId);
  //   return !!info?.source1?.audioStream;
  // }

  /**
   * Check if participant is screen sharing
   */
  // isScreenSharing(participantId: string): boolean {
  //   const info = getParticipantInfo(participantId);
  //   return !!(info?.source2?.videoStream || info?.source2?.audioStream);
  // }

  /**
   * Get a specific consumer by ID
   */
  const getConsumer = (consumerId: string): Consumer | null => {
    return consumers.current.get(consumerId) || null;
  };

  /**
   * Pause/Resume a consumer
   */
  const pauseConsumer = (consumerId: string): void => {
    const consumer = consumers.current.get(consumerId);
    if (consumer) {
      consumer.pause();
      // Notify that values have been updated
      notifyUpdate();
    }
  };

  const resumeConsumer = (consumerId: string): void => {
    const consumer = consumers.current.get(consumerId);
    if (consumer) {
      consumer.resume();
      // Notify that values have been updated
      notifyUpdate();
    }
  };

  /**
   * Clean up all consumers (for app shutdown)
   */
  const cleanup = (): void => {
    // Close all consumers
    consumers.current.forEach((consumer) => consumer.close());

    // Clear all maps
    consumers.current.clear();
    consumersInformation.current.clear();

    // Notify that values have been updated
    notifyUpdate();

    console.log("Consumer manager cleaned up");
  };

  /**
   * Get stats for debugging
   */
  const getStats = (): {
    totalConsumers: number;
    totalParticipants: number;
  } => {
    const participants = getAllParticipants();
    return {
      totalConsumers: consumers.current.size,
      totalParticipants: participants.length,
    };
  };

  return {
    addConsumer,
    removeConsumer,
    removeParticipant,
    getParticipantInfo,
    getAllParticipants,
    getConsumer,
    pauseConsumer,
    resumeConsumer,
    cleanup,
    getStats,
    consumersInformation: consumersInformation.current,
    consumers: consumers.current,
    updateNotification,
  };
};

export default useConsumerManager;
export { ConsumerParams, ConsumingStreamInformation };
