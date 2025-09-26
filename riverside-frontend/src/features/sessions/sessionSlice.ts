import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { joinAsHostApi, sessionInformationApi } from "./sessionApi";

interface SessionState {
  sessionInformation: SessionInformation | null;
  recordingState: RecordingState;
  controlState: ControlState;
  disableCallButton: boolean;

  isConnected: boolean;
  connectionStatus: "Idle" | "Connected" | "Disconnected" | "Connection Error";
  error: string | null;
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
}

interface RecordingState {
  isRecording: boolean;
  recordingDuration: number;
  loaderStopRecording: boolean;
  videoUrl?: string;
  isMerged?: boolean;
  startRecordingSignalFromHost?: boolean;
}

const initialState: SessionState = {
  sessionInformation: null,
  disableCallButton: false,
  isConnected: false,
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
    loaderStopRecording: false,
    isMerged: false,
    //TODO: change it to false;
    startRecordingSignalFromHost: true,
  },
};

const joinSessionAsHost = createAsyncThunk(
  "session/joinAsHost",
  async (sessionCode: { sessionCode: string }, { rejectWithValue }) => {
    try {
      const response = await joinAsHostApi(sessionCode);
      console.log("Join session as host response:", response);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

const fetchSessionInformation = createAsyncThunk(
  "session/fetchSessionInformation",
  async (sessionCode: { sessionCode: string }, { rejectWithValue }) => {
    try {
      const response = await sessionInformationApi(sessionCode);
      console.log("Fetch session information response:", response);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

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
      state.recordingState.loaderStopRecording = false;
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
  },
  extraReducers: (builder) => {
    builder.addCase(joinSessionAsHost.fulfilled, (state, action) => {
      console.log("Join session as host fulfilled:", action.payload);
      state.sessionInformation = action.payload.data;
      state.error = null;
    });
    builder.addCase(joinSessionAsHost.rejected, (state, action) => {
      state.sessionInformation = null;
      state.error = action.payload as string;
    });
    builder.addCase(fetchSessionInformation.fulfilled, (state, action) => {
      console.log("Fetch session information fulfilled:", action.payload);
      state.sessionInformation = action.payload.data;
      state.error = null;
    });
    builder.addCase(fetchSessionInformation.rejected, (state, action) => {
      state.sessionInformation = null;
      state.error = action.payload as string;
    });
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
  setRecordingStatusSignalFromHost,
  setMuteState,
  setCameraOffState,
  setScreenShareState,
  setDeafenedState,
} = sessionSlice.actions;

export default sessionSlice.reducer;
export { joinSessionAsHost, fetchSessionInformation };
