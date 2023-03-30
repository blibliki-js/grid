import {
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "store";

export interface PatchProps {
  id: string;
  name: string;
}

const patchesAdapter = createEntityAdapter<PatchProps>({});

export const patchesSlice = createSlice({
  name: "patches",
  initialState: patchesAdapter.getInitialState(),
  reducers: {
    addPatch: (state: EntityState<any>, action: PayloadAction<PatchProps>) => {
      return patchesAdapter.addOne(state, action.payload);
    },
    removePatch: (state: EntityState<any>, action: PayloadAction<string>) => {
      return patchesAdapter.removeOne(state, action.payload);
    },
    removeAllPatches: patchesAdapter.removeAll,
  },
});

export const routesSelector = patchesAdapter.getSelectors(
  (state: RootState) => state.patches
);

export const { addPatch, removePatch, removeAllPatches } = patchesSlice.actions;

export default patchesSlice.reducer;
