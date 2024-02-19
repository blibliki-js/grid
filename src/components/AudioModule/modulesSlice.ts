import {
  createSlice,
  createSelector,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

import Engine, { IOProps } from "@blibliki/engine";
import { AppDispatch, RootState } from "@/store";
import { Optional } from "@/types";
import { addNode } from "@/components/Grid/gridNodesSlice";

interface ModuleInterface {
  name: string;
  type: string;
  props: any;
}

export interface ModuleProps extends ModuleInterface {
  id: string;
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
    addModule: modulesAdapter.addOne,
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
    removeModule: modulesAdapter.removeOne,
    updatePlainModule: modulesAdapter.updateOne,
    updateModuleName: (
      state: EntityState<any>,
      update: PayloadAction<{ id: string; name: string }>,
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

const { addModule: _addModule } = modulesSlice.actions;

export const {
  updateModule,
  updatePlainModule,
  updateModuleName,
  removeAllModules,
} = modulesSlice.actions;

export const addModule =
  (props: ModuleInterface) => (dispatch: AppDispatch) => {
    const serializedModule = Engine.addModule(props);
    dispatch(_addModule(serializedModule));

    dispatch(
      addNode({
        id: serializedModule.id,
        type: "audioNode",
        position: { x: 0, y: 0 },
        data: {},
      }),
    );
  };

export const addNewModule = (type: string) => (dispatch: AppDispatch) => {
  const modulePayload = AvailableModules[type];
  dispatch(addModule({ props: {}, ...modulePayload }));
};

export const removeModule =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const audioModule = modulesSelector.selectById(getState(), id);
    if (!audioModule) throw Error(`Audio module with id ${id} not exists`);

    Engine.removeModule(id);
    dispatch(modulesSlice.actions.removeModule(id));
  };

export const modulesSelector = modulesAdapter.getSelectors(
  (state: RootState) => state.modules,
);

export const selectModulesByType = createSelector(
  (state: RootState) => modulesSelector.selectAll(state),
  (_: RootState, type: string) => type,
  (modules: ModuleProps[], type: string) =>
    modules.filter((m) => m.type === type),
);

export default modulesSlice.reducer;
