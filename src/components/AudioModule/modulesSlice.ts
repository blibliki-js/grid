import {
  createSlice,
  createSelector,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "store";
import Engine, { ModuleType, PolyModuleType } from "@blibliki/engine";

interface ModuleInterface {
  name: string;
  type: ModuleType | PolyModuleType;
  props?: { [key: string]: any };
}

interface ModuleProps extends AddModuleInterface {
  id: string;
  inputs: any[];
  outputs: any[];
}

interface AddModuleInterface extends ModuleInterface {
  layoutId: string;
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
    addModule: (
      state: EntityState<any>,
      action: PayloadAction<AddModuleInterface>
    ) => {
      const { name: initialName, props: initialProps } =
        AvailableModules[action.payload.type];
      const { name = initialName, layoutId, type } = action.payload;
      const props = { ...initialProps, ...action.payload.props };

      const payload = Engine.registerModule(name, type, props);
      return modulesAdapter.addOne(state, { ...payload, layoutId });
    },
    updateModule: (state: EntityState<any>, update: PayloadAction<any>) => {
      const {
        id,
        changes: { props: changedProps },
      } = update.payload;
      const { props } = Engine.updatePropsModule(id, changedProps);
      return modulesAdapter.updateOne(state, {
        id,
        changes: { props },
      });
    },
    updateModuleName: (
      state: EntityState<any>,
      update: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = update.payload;
      const { name: newName } = Engine.updateNameModule(id, name);

      return modulesAdapter.updateOne(state, {
        id,
        changes: { name: newName },
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

export const { addModule, updateModule, updateModuleName } =
  modulesSlice.actions;

export default modulesSlice.reducer;
