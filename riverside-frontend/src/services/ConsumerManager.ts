import { Consumer } from "mediasoup-client/types";

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

class ConsumerManager {
  private consumers: Map<string, Consumer> = new Map();
  private consumersInformation: Map<string, MediaSource[]> = new Map();

  /**
   * Add a new consumer for a participant
   */
  addConsumer(
    participantId: string,
    consumer: Consumer,
    params: {
      id: string;
      producerId: string;
      kind: string;
      rtpParameters: any;
    }
  ): void {
    const { track } = consumer;
    const mediaStream = new MediaStream([track]);

    this.consumers.set(consumer.id, consumer);

    const consumerParams: ConsumerParams = {
      id: params.id,
      producerId: params.producerId,
      kind: params.kind,
      rtpParameters: params.rtpParameters,
      consumer: consumer,
    };

    let participantInfo = this.consumersInformation.get(participantId);
    if (!participantInfo) {
      participantInfo = [];
    }

    const mediaSource: MediaSource = {
      audioStream: null,
      videoStream: null,
      audioConsumer: null,
      videoConsumer: null,
    };

    if (params.kind === "audio") {
      mediaSource.audioStream = mediaStream;
      mediaSource.audioConsumer = consumerParams;
    } else {
      mediaSource.videoStream = mediaStream;
      mediaSource.videoConsumer = consumerParams;
    }

    participantInfo.push(mediaSource);

    this.consumersInformation.set(participantId, participantInfo);

    console.log(
      `Added ${params.kind} consumer for participant ${participantId}`
    );
  }

  /**
   * Remove a specific consumer
   */
  removeConsumer(
    participantId: string,
    consumerId: string,
    sourceType: "camera" | "screen",
    kind: string
  ): void {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      consumer.close();
      this.consumers.delete(consumerId);
    }

    // Remove from participant information
    const participantInfo = this.consumersInformation.get(participantId);
    participantInfo?.forEach((element) => {
      if (element.audioConsumer?.id === consumerId) {
        element.audioStream = null;
        element.audioConsumer = null;
        element.audioConsumer.consumer.close();
        this.consumers.delete(consumerId);
      } else if (element.videoConsumer?.id === consumerId) {
        element.videoStream = null;
        element.videoConsumer = null;
        element.videoConsumer.consumer.close();
        this.consumers.delete(consumerId);
      }
    });
    if (participantInfo) {
      const mediaSource: MediaSource = {
        audioConsumer: null,
        audioStream: null,
        videoConsumer: null,
        videoStream: null,
      };

      if (kind === "audio") {
        mediaSource.audioStream = null;
        mediaSource.audioConsumer = null;
      } else {
        mediaSource.videoStream = null;
        mediaSource.videoConsumer = null;
      }
    }

    console.log(
      `Removed ${kind} ${sourceType} consumer for participant ${participantId}`
    );
  }

  /**
   * Remove all consumers for a participant (when they leave)
   */
  removeParticipant(participantId: string): void {
    const participantInfo = this.consumersInformation.get(participantId);
    if (participantInfo) {
      // Close all consumers for this participant
      participantInfo.forEach((mediaSource) => {
        if (mediaSource.audioConsumer) {
          mediaSource.audioConsumer.consumer.close();
          this.consumers.delete(mediaSource.audioConsumer.id);
        }
        if (mediaSource.videoConsumer) {
          mediaSource.videoConsumer.consumer.close();
          this.consumers.delete(mediaSource.videoConsumer.id);
        }
      });
      // Remove participant
      this.consumersInformation.delete(participantId);
      console.log(
        `Removed participant ${participantId} and all their consumers`
      );
    }
  }

  /**
   * Get camera streams for a participant
   */
  // getParticipantCameraStreams(participantId: string): MediaSource | null {
  //   const info = this.consumersInformation.get(participantId);
  //   return info?.source1 || null;
  // }

  // /**
  //  * Get screen share streams for a participant
  //  */
  // getParticipantScreenStreams(participantId: string): MediaSource | null {
  //   const info = this.consumersInformation.get(participantId);
  //   return info?.source2 || null;
  // }

  /**
   * Get all information for a participant
   */
  getParticipantInfo(participantId: string): MediaSource[] | null {
    return this.consumersInformation.get(participantId) || null;
  }

  /**
   * Get all participant IDs
   */
  getAllParticipants(): string[] {
    return Array.from(this.consumersInformation.keys());
  }

  /**
   * Check if participant has camera
   */
  // hasCamera(participantId: string): boolean {
  //   const info = this.getParticipantInfo(participantId);
  //   return !!info?.source1?.videoStream;
  // }

  // /**
  //  * Check if participant has microphone
  //  */
  // hasMicrophone(participantId: string): boolean {
  //   const info = this.getParticipantInfo(participantId);
  //   return !!info?.source1?.audioStream;
  // }

  /**
   * Check if participant is screen sharing
   */
  // isScreenSharing(participantId: string): boolean {
  //   const info = this.getParticipantInfo(participantId);
  //   return !!(info?.source2?.videoStream || info?.source2?.audioStream);
  // }

  /**
   * Get a specific consumer by ID
   */
  getConsumer(consumerId: string): Consumer | null {
    return this.consumers.get(consumerId) || null;
  }

  /**
   * Pause/Resume a consumer
   */
  pauseConsumer(consumerId: string): void {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      consumer.pause();
    }
  }

  resumeConsumer(consumerId: string): void {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      consumer.resume();
    }
  }

  /**
   * Clean up all consumers (for app shutdown)
   */
  cleanup(): void {
    // Close all consumers
    this.consumers.forEach((consumer) => consumer.close());

    // Clear all maps
    this.consumers.clear();
    this.consumersInformation.clear();

    console.log("Consumer manager cleaned up");
  }

  /**
   * Get stats for debugging
   */
  getStats(): {
    totalConsumers: number;
    totalParticipants: number;
  } {
    const participants = this.getAllParticipants();
    return {
      totalConsumers: this.consumers.size,
      totalParticipants: participants.length,
    };
  }
}

export default ConsumerManager;
