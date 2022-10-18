import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "globalSlice";
import midiDevicesReducer from "components/AudioModule/MidiDeviceSelector/midiDevicesSlice";
import modulesReducer from "components/AudioModule/modulesSlice";
import layoutsReducer from "Grid/layoutsSlice";
import routesReducer from "Routes/routesSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    midiDevices: midiDevicesReducer,
    modules: modulesReducer,
    layouts: layoutsReducer,
    routes: routesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
