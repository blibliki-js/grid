import {
  createSlice,
  createSelector,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "store";
import Engine, { IOProps } from "@blibliki/engine";
import { plainRemoveRoute } from "Routes/routesSlice";
import { Optional } from "types";

interface ModuleInterface {
  name: string;
  type: string;
  props: any;
}

interface AddModuleInterface extends Optional<ModuleInterface, "props"> {
  id?: string;
  gridNodeId: string;
}

export interface ModuleProps extends AddModuleInterface {
  id: string;
  initialId: string;
  inputs: IOProps[];
  outputs: IOProps[];
}

export const AvailableModules: {
  [key: string]: Optional<ModuleInterface, "props">;
} = {
  Master: { name: "Master", type: "Master" },
  Oscillator: { name: "Oscilator", type: "Oscillator" },
  AmpEnvelope: {
    name: "Amp Envelope",
    type: "AmpEnvelope",
  },
  FreqEnvelope: {
    name: "Frequency Envelope",
    type: "FreqEnvelope",
  },
  Filter: { name: "Filter", type: "Filter" },
  Volume: { name: "Volume", type: "Volume" },
  MidiSelector: {
    name: "Midi Selector",
    type: "MidiSelector",
  },
  VoiceScheduler: {
    name: "Voice Scheduler",
    type: "VoiceScheduler",
    props: { numberOfVoices: 1 },
  },
  VirtualMidi: { name: "VirtualMidi", type: "VirtualMidi" },
  Reverb: { name: "Reverb", type: "Reverb" },
  Delay: { name: "Delay", type: "Delay" },
  Distortion: { name: "Distortion", type: "Distortion" },
  BitCrusher: { name: "BitCrusher", type: "BitCrusher" },
  Sequencer: {
    name: "Sequencer",
    type: "Sequencer",
  },
};

const modulesAdapter = createEntityAdapter<ModuleProps>({});

export const modulesSlice = createSlice({
  name: "modules",
  initialState: modulesAdapter.getInitialState(),
  reducers: {
    addMaster: (
      state: EntityState<any>,
      action: PayloadAction<ModuleProps>
    ) => {
      const { payload } = action;
      if (!payload.id || payload.type !== "Master") return;

      return modulesAdapter.addOne(state, action.payload);
    },
    addModule: (
      state: EntityState<any>,
      action: PayloadAction<AddModuleInterface>
    ) => {
      const { name: initialName, props: initialProps } =
        AvailableModules[action.payload.type];
      const {
        id: initialId = "",
        name = initialName,
        gridNodeId,
        type,
      } = action.payload;
      const props = { ...initialProps, ...action.payload.props };

      const payload = Engine.addModule({ name, type, props });
      return modulesAdapter.addOne(state, {
        ...payload,
        initialId,
        gridNodeId,
      });
    },
    updateModule: (state: EntityState<any>, update: PayloadAction<any>) => {
      const {
        id,
        changes: { props: changedProps },
      } = update.payload;
      const audioModule = Engine.updatePropsModule(id, changedProps);
      return modulesAdapter.updateOne(state, {
        id,
        changes: audioModule,
      });
    },
    removeModule: (state: EntityState<any>, action: PayloadAction<string>) => {
      return modulesAdapter.removeOne(state, action.payload);
    },
    updatePlainModule: modulesAdapter.updateOne,
    updateModuleName: (
      state: EntityState<any>,
      update: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = update.payload;
      const audioModule = Engine.updateNameModule(id, name);

      return modulesAdapter.updateOne(state, {
        id,
        changes: audioModule,
      });
    },
    removeAllModules: modulesAdapter.removeAll,
  },
});

export const modulesSelector = modulesAdapter.getSelectors(
  (state: RootState) => state.modules
);

export const selectModuleByGridNodeId = createSelector(
  (state: RootState) => modulesSelector.selectAll(state),
  (_: RootState, layoutId: string) => layoutId,
  (modules: ModuleProps[], layoutId: string) =>
    modules.find((m) => m.gridNodeId === layoutId)
);

export const selectModulesByType = createSelector(
  (state: RootState) => modulesSelector.selectAll(state),
  (_: RootState, type: string) => type,
  (modules: ModuleProps[], type: string) =>
    modules.filter((m) => m.type === type)
);

export const removeModule =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const audioModule = modulesSelector.selectById(getState(), id);
    if (!audioModule) throw Error(`Audio module with id ${id} not exists`);

    const routeIds = Engine.removeModule(id);
    dispatch(modulesSlice.actions.removeModule(id));
    routeIds.forEach((routeId) => dispatch(plainRemoveRoute(routeId)));
  };

export const {
  addModule,
  addMaster,
  updateModule,
  updatePlainModule,
  updateModuleName,
  removeAllModules,
} = modulesSlice.actions;

export default modulesSlice.reducer;
