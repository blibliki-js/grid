import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Engine from "@blibliki/engine";

import Patch, { IPatch } from "models/Patch";
import PatchConfig from "models/PatchConfig";

import {
  addMaster,
  addModule,
  ModuleProps,
  modulesSelector,
  removeAllModules,
} from "components/AudioModule/modulesSlice";

import {
  addRoute,
  removeAllRoutes,
  RouteProps,
  routesSelector,
} from "Routes/routesSlice";
import { RootState } from "store";
import { removeAllGridNodes, setGridNodes } from "Grid/gridNodesSlice";

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
    const master = Engine.master;
    dispatch(addMaster({ ...master, initialId: master.id, gridNodeId: "" }));
  }
);

export const loadById = createAsyncThunk(
  "patch/loadById",
  async (id: number, { dispatch }) => {
    const patch = await Patch.find(id);
    const patchConfig = await PatchConfig.findByPatchId(id);
    const { modules, routes, gridNodes } = patchConfig.config;

    const url = `/patch/${id}`;
    if (window.location.pathname !== url) {
      window.location.href = url;
    }

    dispatch(clearEngine());
    dispatch(loadModules(modules));
    dispatch(fixModuleIds(routes));
    dispatch(setGridNodes(gridNodes));

    return { id: patch.id, name: patch.name, staticId: patch.staticId };
  }
);

export const save = createAsyncThunk(
  "patch/save",
  async (asNew: boolean, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { patch: originalPatch } = state.patch;
    const modules = modulesSelector.selectAll(state);
    const routes = routesSelector.selectAll(state);
    const gridNodes = state.gridNodes;
    const config = { modules, routes, gridNodes };

    let id = asNew ? undefined : originalPatch.id;
    const patch = new Patch({ id, name: originalPatch.name, config });
    await patch.save();

    dispatch(loadById(patch.id));
  }
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
  }
);

export const { setAttributes, setId, setName } = patchSlice.actions;

const clearEngine = createAsyncThunk(
  "patch/clearEngine",
  async (_, { dispatch }) => {
    Engine.dispose();
    dispatch(removeAllModules());
    dispatch(removeAllRoutes());
    dispatch(removeAllGridNodes());
  }
);

const loadModules = createAsyncThunk(
  "patch/loadModules",
  async (modules: ModuleProps[], { dispatch }) => {
    const master = Engine.master;

    modules.forEach((m) => {
      if (m.type === "Master") {
        dispatch(addMaster({ ...master, initialId: m.id, gridNodeId: "" }));
        return;
      }

      dispatch(addModule(m));
    });
  }
);

const fixModuleIds = createAsyncThunk(
  "patch/fixModuleIds",
  async (routes: RouteProps[], { getState, dispatch }) => {
    const modules = modulesSelector.selectAll(getState() as RootState);

    const resources = routes.map((route) => {
      const { sourceId, destinationId } = route;

      const source = modules.find((m) => m.initialId === sourceId);
      const destination = modules.find((m) => m.initialId === destinationId);

      if (!source || !destination) throw Error("Id matching failed");

      return { ...route, sourceId: source.id, destinationId: destination.id };
    });

    resources.forEach((resource) => {
      dispatch(addRoute(resource));
    });
  }
);

export default patchSlice.reducer;
