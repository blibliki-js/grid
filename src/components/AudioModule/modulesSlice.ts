import {
  createSlice,
  createSelector,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "store";
import Engine, { ModuleType, PolyModuleType, IOProps } from "@blibliki/engine";

interface ModuleInterface {
  name: string;
  type: ModuleType | PolyModuleType;
  props?: { [key: string]: any };
}

interface AddModuleInterface extends ModuleInterface {
  id?: string;
  layoutId: string;
}

export interface ModuleProps extends AddModuleInterface {
  id: string;
  initialId: string;
  inputs: IOProps[];
  outputs: IOProps[];
}

export const AvailableModules: { [key: string]: ModuleInterface } = {
  oscillator: { name: "Oscilator", type: PolyModuleType.Oscillator },
  ampEnvelope: {
    name: "Amp Envelope",
    type: PolyModuleType.AmpEnvelope,
  },
  freqEnvelope: {
    name: "Frequency Envelope",
    type: PolyModuleType.FreqEnvelope,
  },
  filter: { name: "Filter", type: PolyModuleType.Filter },
  volume: { name: "Volume", type: PolyModuleType.Volume },
  midiSelector: {
    name: "Midi Selector",
    type: ModuleType.MidiSelector,
  },
  voiceScheduler: {
    name: "Voice Scheduler",
    type: PolyModuleType.VoiceScheduler,
    props: { numberOfVoices: 1 },
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
      if (!payload.id || payload.type !== "master") return;

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
        layoutId,
        type,
      } = action.payload;
      const props = { ...initialProps, ...action.payload.props };

      const payload = Engine.registerModule(name, type, props);
      return modulesAdapter.addOne(state, { ...payload, initialId, layoutId });
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
  },
});

export const modulesSelector = modulesAdapter.getSelectors(
  (state: RootState) => state.modules
);

export const selectModuleByLayoutId = createSelector(
  (state: RootState) => modulesSelector.selectAll(state),
  (_: RootState, layoutId: string) => layoutId,
  (modules: ModuleProps[], layoutId: string) =>
    modules.find((m) => m.layoutId === layoutId)
);

export const selectModulesByType = createSelector(
  (state: RootState) => modulesSelector.selectAll(state),
  (_: RootState, type: string) => type,
  (modules: ModuleProps[], type: string) =>
    modules.filter((m) => m.type === type)
);

export const { addModule, addMaster, updateModule, updateModuleName } =
  modulesSlice.actions;

export default modulesSlice.reducer;
