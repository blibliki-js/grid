import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "globalSlice";
import midiDevicesReducer from "components/AudioModule/MidiDeviceSelector/midiDevicesSlice";
import modulesReducer from "components/AudioModule/modulesSlice";
import modalReducer from "components/Modal/modalSlice";
import routesReducer from "Routes/routesSlice";
import patchReducer from "patchSlice";
import gridNodesReducer from "Grid/gridNodesSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    midiDevices: midiDevicesReducer,
    modules: modulesReducer,
    modal: modalReducer,
    gridNodes: gridNodesReducer,
    routes: routesReducer,
    patch: patchReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
