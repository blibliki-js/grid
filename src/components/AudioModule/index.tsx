import { updateModule } from "./modulesSlice";
import { useAppDispatch } from "hooks";

import Oscillator from "./Oscillator";
import Envelope from "./Envelope";
import Filter from "./Filter";
import Volume from "./Volume";
import MidiDeviceSelector from "./MidiDeviceSelector";
import VoiceScheduler from "./VoiceScheduler";
import Keyboard from "./Keyboard";
import Reverb from "./Reverb";
import Delay from "./Delay";
import Distortion from "./Distortion";
import BitCrusher from "./BitCrusher";

export interface AudioModuleProps {
  id: string;
  name: string;
  type: string;
  props?: any;
}

export default function AudioModule(audioModuleProps: {
  audioModule: AudioModuleProps;
  componentType?: string;
}) {
  const dispatch = useAppDispatch();

  const { id, name, type, props } = audioModuleProps.audioModule;

  let Component;

  const updateProps = (id: string, props: any) => {
    dispatch(updateModule({ id, changes: { props } }));
  };

  switch (type) {
    case "Oscillator":
      Component = Oscillator;
      break;
    case "Filter":
      Component = Filter;
      break;
    case "Volume":
      Component = Volume;
      break;
    case "Envelope":
    case "AmpEnvelope":
    case "FreqEnvelope":
      Component = Envelope;
      break;
    case "MidiSelector":
      Component = MidiDeviceSelector;
      break;
    case "VoiceScheduler":
      Component = VoiceScheduler;
      break;
    case "VirtualMidi":
      Component = Keyboard;
      break;
    case "Reverb":
      Component = Reverb;
      break;
    case "Delay":
      Component = Delay;
      break;
    case "Distortion":
      Component = Distortion;
      break;
    case "BitCrusher":
      Component = BitCrusher;
      break;
    default:
      throw Error(`Unknown audio module type ${type}`);
  }

  return (
    <Component id={id} name={name} props={props} updateProps={updateProps} />
  );
}
