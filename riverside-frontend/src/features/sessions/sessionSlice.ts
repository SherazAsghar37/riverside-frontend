import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { sessionInformationApi } from "./sessionApi";

interface SessionState {
  sessionInformation: SessionInformation | null;
  recordingState: RecordingState;
  controlState: ControlState;
  disableCallButton: boolean;
  mediasoup: MediasoupState;
  isConnected: boolean;
  connectionStatus: "Idle" | "Connected" | "Disconnected" | "Connection Error";
  error: string | null;
}

interface MediasoupState {
  setupDone: boolean;
}

interface ControlState {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isDeafened: boolean;
}

interface SessionInformation {
  sessionId: string;
  sessionCode: string;
  hostId?: string;
  hostName?: string;
  status?: string;
  sessionRecordingId?: string;
  startTime?: number;
}

interface RecordingState {
  isRecording: boolean;
  recordingDuration: number;
  isLoading: boolean;
  videoUrl?: string;
  isMerged?: boolean;
  startRecordingSignalFromHost?: boolean;
  recordingStartTime?: number;
  recordingSessionId: string;
  recordingParticipantId: string;
}

const initialState: SessionState = {
  sessionInformation: null,
  disableCallButton: false,
  isConnected: false,
  mediasoup: {
    setupDone: false,
  },
  connectionStatus: "Idle",
  controlState: {
    isMuted: false,
    isCameraOff: false,
    isScreenSharing: false,
    isDeafened: false,
  },
  error: null,
  recordingState: {
    isRecording: false,
    recordingDuration: 0,
    isLoading: false,
    isMerged: false,
    recordingSessionId: "",
    recordingParticipantId: "",
    //TODO: change it to false;
    startRecordingSignalFromHost: true,
  },
};

const fetchSessionInformation = createAsyncThunk(
  "session/fetchSessionInformation",
  async (
    information: { sessionCode: string; isHost: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await sessionInformationApi(information);
      console.log("Fetch session information response:", response);
      return response;
    } catch (err: any) {
      console.error("Error fetching session information:", err);
      return rejectWithValue(err.response.data.error || "Something went wrong");
    }
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    initializeSessionState(state) {
      resetSlice(state);
    },

    setSessionInformation(state, action: PayloadAction<SessionInformation>) {
      state.sessionInformation = action.payload;
    },
    clearSessionInformation(state) {
      state.sessionInformation = null;
    },
    startRecording(state, action: PayloadAction<any>) {
      state.recordingState.isRecording = true;
      state.recordingState.isLoading = false;
      state.recordingState.recordingDuration = 0;
      state.recordingState.recordingParticipantId =
        action.payload.participantId;
      state.recordingState.recordingSessionId = action.payload.sessionId;
    },
    stopRecording(state) {
      state.recordingState.isRecording = false;
      state.recordingState.isLoading = false;
    },
    setRecordingDuration(state, action: PayloadAction<number>) {
      state.recordingState.recordingDuration = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.recordingState.isLoading = action.payload;
    },
    setDisableCallButton(state, action: PayloadAction<boolean>) {
      state.disableCallButton = action.payload;
    },
    setRecordingStatusSignalFromHost(state, action: PayloadAction<boolean>) {
      state.recordingState.startRecordingSignalFromHost = action.payload;
    },
    setConnectionStatus(
      state,
      action: PayloadAction<
        "Idle" | "Connected" | "Disconnected" | "Connection Error"
      >
    ) {
      state.connectionStatus = action.payload;
    },
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setVideoUrl(state, action: PayloadAction<string>) {
      state.recordingState.isLoading = false;
      state.recordingState.isRecording = false;

      if (state.sessionInformation) {
        state.recordingState.videoUrl = action.payload;
        state.recordingState.isMerged = true;
      }
    },
    setMuteState(state, action: PayloadAction<boolean>) {
      state.controlState.isMuted = action.payload;
    },
    setCameraOffState(state, action: PayloadAction<boolean>) {
      state.controlState.isCameraOff = action.payload;
    },
    setScreenShareState(state, action: PayloadAction<boolean>) {
      state.controlState.isScreenSharing = action.payload;
    },
    setDeafenedState(state, action: PayloadAction<boolean>) {
      state.controlState.isDeafened = action.payload;
    },
    setMediasoupSetupDone(state, action: PayloadAction<boolean>) {
      state.mediasoup.setupDone = action.payload;
    },
    setRecordingStartTime(state, action: PayloadAction<number>) {
      state.recordingState.recordingStartTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(joinSessionAsHost.fulfilled, (state, action) => {
    //   console.log("Join session as host fulfilled:", action.payload);
    //   state.sessionInformation.sessionCode = action.payload.sessionCode;
    //   state.sessionInformation.sessionId = action.payload.sessionId;
    //   state.error = null;
    // });
    // builder.addCase(joinSessionAsHost.rejected, (state, action) => {
    //   state.sessionInformation.sessionCode = null;
    //   state.sessionInformation.sessionId = null;
    //   state.error = action.payload as string;
    // });
    // builder.addCase(joinSessionAsParticipant.fulfilled, (state, action) => {
    //   console.log("Join session as participant fulfilled:", action.payload);
    //   state.sessionInformation.sessionCode = action.payload.sessionCode;
    //   state.sessionInformation.sessionId = action.payload.sessionId;
    //   state.error = null;
    // });
    // builder.addCase(joinSessionAsParticipant.rejected, (state, action) => {
    //   state.sessionInformation.sessionCode = null;
    //   state.sessionInformation.sessionId = null;
    //   state.error = action.payload as string;
    // });
    builder.addCase(fetchSessionInformation.fulfilled, (state, action) => {
      console.log("Fetch session information fulfilled:", action.payload);
      state.sessionInformation = action.payload;
      state.error = null;
      state.recordingState.isRecording = action.payload.status === "RECORDING";

      const date = new Date(action.payload.updatedAt);
      state.recordingState.recordingStartTime = date.getTime();

      const startTime = new Date(
        action.payload.scheduledAt
          ? action.payload.scheduledAt
          : action.payload.createdAt
      );
      state.sessionInformation!.startTime = startTime.getTime();
      state.sessionInformation!.sessionRecordingId =
        action.payload.sessionRecordingId;
    });
    builder.addCase(fetchSessionInformation.rejected, (state, action) => {
      state.sessionInformation = null;

      state.error = action.payload as string;
    });
  },
});

const resetSlice = (state) => {
  state.sessionInformation = {
    sessionCode: null,
    sessionId: null,
    hostId: null,
    hostName: null,
  };
  state.recordingState = initialState.recordingState;
  state.controlState = initialState.controlState;
  state.disableCallButton = false;
  state.isConnected = false;
  state.connectionStatus = "Idle";
  state.error = null;
  state.mediasoup = initialState.mediasoup;
};

export const {
  setSessionInformation,
  clearSessionInformation,
  startRecording,
  stopRecording,
  setRecordingDuration,
  setIsLoading,
  setVideoUrl,
  setDisableCallButton,
  setConnectionStatus,
  setIsConnected,
  setRecordingStatusSignalFromHost,
  setMuteState,
  setCameraOffState,
  setScreenShareState,
  setDeafenedState,
  setMediasoupSetupDone,
  initializeSessionState,
  setRecordingStartTime,
} = sessionSlice.actions;

export default sessionSlice.reducer;
export { fetchSessionInformation };
