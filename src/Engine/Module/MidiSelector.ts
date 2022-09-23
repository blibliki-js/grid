import MidiDevice from "Engine/MidiDevice";
import MidiDeviceManager from "Engine/MidiDeviceManager";
import MidiEvent from "Engine/MidiEvent";
import { Destination } from "tone";
import Module, { ModuleType, Connectable } from "../Module";
import { Output } from "./IO";

export interface MidiSelectorInterface {
  selectedId: string | null;
}

const InitialProps: MidiSelectorInterface = {
  selectedId: null,
};

export default class MidiSelector extends Module<
  Connectable,
  MidiSelectorInterface
> {
  midiOutput: Output;

  constructor(
    name: string,
    code: string,
    props: Partial<MidiSelectorInterface>
  ) {
    super(Destination, {
      name,
      code,
      props: { ...InitialProps, ...props },
      type: ModuleType.MidiSelector,
    });

    this.registerOutputs();
  }

  get selectedId() {
    return this._props["selectedId"];
  }

  set selectedId(value: string | null) {
    if (this.selectedId) {
      MidiDeviceManager.find(this.selectedId).then((midiDevice: MidiDevice) => {
        midiDevice.removeEventListener(this.onMidiEvent);
      });
    }

    this._props = { ...this.props, selectedId: value };

    if (!value) return;

    MidiDeviceManager.find(value).then((midiDevice: MidiDevice) => {
      midiDevice.addEventListener(this.onMidiEvent);
    });
  }

  onMidiEvent = (midiEvent: MidiEvent) => {
    this.midiOutput.connections.forEach((input) => {
      input.pluggable(midiEvent);
    });
  };

  async availableDevices(): Promise<MidiDevice[]> {
    return MidiDeviceManager.fetchDevices();
  }

  private registerOutputs() {
    this.midiOutput = this.registerOutput({ name: "midi out" });
  }
}
