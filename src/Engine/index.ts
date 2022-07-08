import Module from "./Module";
import Oscillator from "./modules/Oscillator";
import Envelope from "./modules/Envelope";
import MidiDeviceManager from "Engine/MidiDeviceManager";
import MidiEvent from "Engine/MidiEvent";

class Engine {
  modules: { [Identifier: string]: Module };

  private static instance: Engine;

  private constructor() {
    this.modules = {};
  }

  public static getInstance(): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }

    return Engine.instance;
  }

  public registerModule(modula: Module) {
    this.modules[modula.id] ??= modula;
    this.applyRoutes();
  }

  private applyRoutes() {
    console.log(Object.values(this.modules).map((m) => m.name));
    const oscs = Object.values(this.modules).filter((m: Module) =>
      m.name.startsWith("Osc")
    );
    const ampEnv = Object.values(this.modules).find(
      (m: Module) => m.name === "Amp Envelope"
    );

    if (oscs.length !== 3 || !ampEnv) return;

    oscs.forEach((osc) => osc.connect(ampEnv));
    ampEnv.toDestination();
    console.log("connected");
    this.registerMidiEvents(oscs as Oscillator[], ampEnv as Envelope);
  }

  private registerMidiEvents(oscs: Array<Oscillator>, ampEnv: Envelope) {
    MidiDeviceManager.fetchDevices().then((devices) => {
      const device = devices[1];
      console.log(devices.map((d) => d.name));
      device.connect();

      device.onNote((midiEvent: MidiEvent) => {
        const { note } = midiEvent;
        if (!note) return;

        switch (midiEvent.type) {
          case "noteOn":
            oscs.forEach((osc) => (osc.note = note));
            ampEnv.triggerAttack(note);
            break;
          case "noteOff":
            ampEnv.triggerRelease(note);
            break;
        }
      });
    });
  }
}

export default Engine.getInstance();
