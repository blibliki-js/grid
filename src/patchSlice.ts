import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Engine from "@blibliki/engine";

import Patch, { IPatch } from "@/models/Patch";

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
  patch: Omit<IPatch, "config">;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: PatchProps = {
  patch: { id: "", userId: "", name: "Init patch" },
  status: "idle",
};

export const patchSlice = createSlice({
  name: "Patch",
  initialState,
  reducers: {
    setAttributes: (state, action: PayloadAction<PatchProps>) => {
      return { ...state, ...action.payload };
    },
    setName: (state, action: PayloadAction<string>) => {
      state.patch.name = action.payload;
    },
  },
});

export const initialize = () => (dispatch: AppDispatch) => {
  dispatch(setAttributes(initialState));
};

export const loadById = (id: string) => async (dispatch: AppDispatch) => {
  if (id === "new") {
    dispatch(clearEngine());

    return { ...initialState.patch };
  }

  const { name, config, userId } = await Patch.find(id);
  const { modules, gridNodes } = config;

  dispatch(clearEngine());
  dispatch(loadModules(modules));
  dispatch(setGridNodes(gridNodes));

  return { id, name, userId };
};

export const save =
  (props: { userId: string; asNew: boolean }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { asNew } = props;
    const state = getState() as RootState;
    const { patch: originalPatch } = state.patch;
    const modules = modulesSelector.selectAll(state);
    const gridNodes = state.gridNodes;
    const config = { modules, gridNodes };

    const id = asNew ? undefined : originalPatch.id;
    const userId = id ? originalPatch.userId : props.userId;
    const patch = new Patch({ id, userId, name: originalPatch.name, config });
    await patch.save();

    dispatch(loadById(patch.id));
  };

export const destroy =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState() as RootState;
    const { patch } = state.patch;
    if (!patch.id) throw Error("This patch isn't saved yet");

    await (await Patch.find(patch.id)).delete();

    dispatch(clearEngine());
    dispatch(initialize());
  };

export const { setAttributes, setName } = patchSlice.actions;

const clearEngine = () => (dispatch: AppDispatch) => {
  Engine.dispose();
  dispatch(removeAllModules());
  dispatch(removeAllGridNodes());
};

const loadModules = (modules: ModuleProps[]) => (dispatch: AppDispatch) => {
  modules.forEach((m) => {
    (dispatch as AppDispatch)(addModule({ audioModule: m }));
  });
};

export default patchSlice.reducer;
