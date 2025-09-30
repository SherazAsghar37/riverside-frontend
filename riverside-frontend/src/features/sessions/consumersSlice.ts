// import { createSlice } from "@reduxjs/toolkit";
// import { Consumer } from "mediasoup-client/types";

// const consumerInitialState: ConsumerState = {
//   consumers: new Map(),
//   consumersInformation: new Map(),
// };

// const consumerSlice = createSlice({
//   name: "consumersManager",
//   initialState: consumerInitialState,
//   reducers: {
//     addConsumerInMap: (state, action) => {
//       const { id, consumer } = action.payload;
//       const consumerInstance: Consumer = consumer;
//       state.consumers.set(id, consumerInstance);
//     },
//     addConsumerInformationInMap: (state, action) => {
//       const { participantId, mediaSources } = action.payload;
//       const mediaSourcesArray: Array<LocalMediaSource> = mediaSources;
//       state.consumersInformation.set(participantId, mediaSourcesArray);
//     },
//     removeConsumerFromMap: (state, action) => {
//       state.consumers.delete(action.payload.consumerId);
//     },
//     removeConsumerInformationFromMap: (state, action) => {
//       state.consumersInformation.delete(action.payload.participantId);
//     },
//     clearState: (state) => {
//       state.consumers.clear();
//       state.consumersInformation.clear();
//     },
//   },
// });

// export const {
//   addConsumerInMap,
//   addConsumerInformationInMap,
//   removeConsumerFromMap,
//   removeConsumerInformationFromMap,
//   clearState,
// } = consumerSlice.actions;

// export type { LocalMediaSource, ConsumerParams };

// export default consumerSlice.reducer;
