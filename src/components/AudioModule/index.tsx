import { updateModule } from "./modulesSlice";
import { useAppDispatch } from "hooks";

import Oscillator from "./Oscillator";
import Envelope from "./Envelope";
import Filter from "./Filter";
import Volume from "./Volume";
import MidiDeviceSelector from "./MidiDeviceSelector";
import VoiceScheduler from "./VoiceScheduler";
import Keyboard from "./Keyboard";

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
    case "oscillator":
      Component = Oscillator;
      break;
    case "filter":
      Component = Filter;
      break;
    case "volume":
      Component = Volume;
      break;
    case "envelope":
    case "ampEnvelope":
    case "freqEnvelope":
      Component = Envelope;
      break;
    case "midiSelector":
      Component = MidiDeviceSelector;
      break;
    case "voiceScheduler":
      Component = VoiceScheduler;
      break;
    case "virtualMidi":
      Component = Keyboard;
      break;
    default:
      throw Error(`Unknown audio module type ${type}`);
  }

  return (
    <Component id={id} name={name} props={props} updateProps={updateProps} />
  );
}
