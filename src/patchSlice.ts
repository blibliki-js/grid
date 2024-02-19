import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Engine from "@blibliki/engine";

import Patch, { IPatch } from "@/models/Patch";
import PatchConfig from "@/models/PatchConfig";

import {
  addModule,
  ModuleProps,
  modulesSelector,
  removeAllModules,
} from "@/components/AudioModule/modulesSlice";

import { AppDispatch, RootState } from "@/store";
import {
  removeAllGridNodes,
  setGridNodes,
} from "@/components/Grid/gridNodesSlice";

interface PatchProps {
  patch: IPatch;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: PatchProps = {
  patch: { name: "Init patch" },
  status: "idle",
};

export const patchSlice = createSlice({
  name: "Patch",
  initialState,
  reducers: {
    setAttributes: (state, action: PayloadAction<PatchProps>) => {
      return { ...state, ...action.payload };
    },
    setId: (state, action: PayloadAction<number>) => {
      state.patch.id = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.patch.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patch = action.payload;
      })
      .addCase(loadById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const initialize = createAsyncThunk(
  "patch/initialze",
  async (_, { dispatch }) => {
    dispatch(setAttributes(initialState));
  },
);

export const loadById = createAsyncThunk(
  "patch/loadById",
  async (id: number, { dispatch }) => {
    const patch = await Patch.find(id);
    const patchConfig = await PatchConfig.findByPatchId(id);
    const { modules, gridNodes } = patchConfig.config;

    dispatch(clearEngine());
    dispatch(loadModules(modules));
    dispatch(setGridNodes(gridNodes));

    return { id: patch.id, name: patch.name, staticId: patch.staticId };
  },
);

export const save = createAsyncThunk(
  "patch/save",
  async (asNew: boolean, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { patch: originalPatch } = state.patch;
    const modules = modulesSelector.selectAll(state);
    const gridNodes = state.gridNodes;
    const config = { modules, gridNodes };

    let id = asNew ? undefined : originalPatch.id;
    const patch = new Patch({ id, name: originalPatch.name, config });
    await patch.save();

    dispatch(loadById(patch.id));
  },
);

export const destroy = createAsyncThunk(
  "patch/delete",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { patch } = state.patch;
    if (!patch.id) throw Error("This patch isn't saved yet");

    await (await Patch.find(patch.id)).delete();

    dispatch(clearEngine());
    dispatch(initialize());
  },
);

export const { setAttributes, setId, setName } = patchSlice.actions;

const clearEngine = createAsyncThunk(
  "patch/clearEngine",
  async (_, { dispatch }) => {
    Engine.dispose();
    dispatch(removeAllModules());
    dispatch(removeAllGridNodes());
  },
);

const loadModules = createAsyncThunk(
  "patch/loadModules",
  async (modules: ModuleProps[], { dispatch }) => {
    modules.forEach((m) => {
      (dispatch as AppDispatch)(addModule(m));
    });
  },
);

export default patchSlice.reducer;
