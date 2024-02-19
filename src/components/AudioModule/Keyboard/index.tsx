import { useState } from "react";
import { TUpdateProps } from "..";
import ComputerMidiKeyboard from "./ComputerMidiKeyboard";
import Octave from "./Octave";

export default function Keyboard(params: {
  id: string;
  name: string;
  props: { activeNotes: string[] };
  updateProps: TUpdateProps;
}) {
  const { id, props } = params;
  const [triggerable, setTriggerable] = useState(false);

  const enableTriggering = () => {
    setTriggerable(true);
  };
  const disableTriggering = () => {
    setTriggerable(false);
  };

  return (
    <div
      onMouseDown={enableTriggering}
      onMouseUp={disableTriggering}
      onMouseLeave={disableTriggering}
    >
      <ComputerMidiKeyboard id={id} />
      <Octave id={id} props={props} triggerable={triggerable} octave={2} />
      <Octave id={id} props={props} triggerable={triggerable} octave={3} />
      <Octave id={id} props={props} triggerable={triggerable} octave={4} />
    </div>
  );
}
