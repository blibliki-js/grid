import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "store";
import Engine from "@blibliki/engine";

import { updatePlainModule } from "components/AudioModule/modulesSlice";
import { initialize as patchInitialize } from "patchSlice";

interface IContext {
  latencyHint: "interactive" | "playback";
  lookAhead?: number;
}

interface GlobalProps {
  isInitialized: boolean;
  isStarted: boolean;
  context: IContext;
  activeTab: number;
}

const initialState: GlobalProps = {
  isInitialized: false,
  isStarted: false,
  context: { latencyHint: "playback" },
  activeTab: 0,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAttributes: (state, action) => {
      return { ...state, ...action.payload };
    },
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
  },
});

export const initialize =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const { context } = getState().global;

    Engine.initialize({ context });
    dispatch(patchInitialize());

    Engine.onPropsUpdate((id, props) => {
      dispatch(updatePlainModule({ id, changes: { props } }));
    });

    return dispatch(
      setAttributes({ isInitialized: true, isStarted: Engine.isStarted })
    );
  };

export const start = () => (dispatch: AppDispatch) => {
  Engine.start();
  dispatch(setAttributes({ isStarted: true }));
};

export const stop = () => (dispatch: AppDispatch) => {
  Engine.stop();
  dispatch(setAttributes({ isStarted: false }));
};

export const dispose = () => () => {
  Engine.stop();
};

export const { setAttributes, setActiveTab } = globalSlice.actions;

export default globalSlice.reducer;
