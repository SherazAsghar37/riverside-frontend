import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  sessionInformation: SessionInformation | null;
  recordingState: RecordingState;
  disableCallButton: boolean;
  isConnected: boolean;
  connectionStatus: "Idle" | "Connected" | "Disconnected" | "Connection Error";
}

interface SessionInformation {
  sessionId: string;
  sessionCode: string;
}

interface RecordingState {
  isRecording: boolean;
  recordingDuration: number;
  loaderStopRecording: boolean;
  videoUrl?: string;
  isMerged?: boolean;
}

const initialState: SessionState = {
  sessionInformation: null,
  disableCallButton: false,
  isConnected: false,
  connectionStatus: "Idle",
  recordingState: {
    isRecording: false,
    recordingDuration: 0,
    loaderStopRecording: false,
    isMerged: false,
  },
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessionInformation(state, action: PayloadAction<SessionInformation>) {
      state.sessionInformation = action.payload;
    },
    clearSessionInformation(state) {
      state.sessionInformation = null;
    },
    startRecording(state) {
      state.recordingState.isRecording = true;
      state.recordingState.recordingDuration = 0;
    },
    stopRecording(state) {
      state.recordingState.isRecording = false;
      state.recordingState.loaderStopRecording = true;
    },
    setRecordingDuration(state, action: PayloadAction<number>) {
      state.recordingState.recordingDuration = action.payload;
    },
    setLoaderStopRecording(state, action: PayloadAction<boolean>) {
      state.recordingState.loaderStopRecording = action.payload;
    },
    setDisableCallButton(state, action: PayloadAction<boolean>) {
      state.disableCallButton = action.payload;
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
      state.recordingState.loaderStopRecording = false;
      state.recordingState.isRecording = false;

      if (state.sessionInformation) {
        state.recordingState.videoUrl = action.payload;
        state.recordingState.isMerged = true;
      }
    },
  },
});

export const {
  setSessionInformation,
  clearSessionInformation,
  startRecording,
  stopRecording,
  setRecordingDuration,
  setLoaderStopRecording,
  setVideoUrl,
  setDisableCallButton,
  setConnectionStatus,
  setIsConnected,
} = sessionSlice.actions;

export default sessionSlice.reducer;
