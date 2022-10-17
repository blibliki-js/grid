import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Layout } from "react-grid-layout";

import { AppDispatch, RootState } from "store";
import {
  addModule,
  AvailableModules,
} from "components/AudioModule/modulesSlice";

export interface ExtendedLayout extends Layout {
  type: string;
}

const layoutsAdapter = createEntityAdapter<ExtendedLayout>({
  selectId: (layout) => layout.i,
});

export const layoutsSlice = createSlice({
  name: "layouts",
  initialState: layoutsAdapter.getInitialState(),
  reducers: {
    addLayout: layoutsAdapter.addOne,
    updateLayout: layoutsAdapter.updateOne,
  },
});

export const layoutsSelector = layoutsAdapter.getSelectors(
  (state: RootState) => state.layouts
);
export const { updateLayout } = layoutsSlice.actions;

export const addLayout = (type: string) => (dispatch: AppDispatch) => {
  const payload = constructLayout(type);
  const modulePayload = AvailableModules[type];

  dispatch(addModule({ ...modulePayload, layoutId: payload.i }));
  dispatch(layoutsSlice.actions.addLayout(payload));
};

function constructLayout(type: string) {
  const i = uuidv4();

  return {
    i,
    type,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
  };
}

export default layoutsSlice.reducer;
