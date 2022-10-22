import { useState } from "react";
import styled from "@emotion/styled";

import ComputerMidiKeyboard from "./ComputerMidiKeyboard";
import Octave from "./Octave";

const OctaveContainer = styled.div`
  display: flex;
`;

export default function Keyboard(params: {
  id: string;
  name: string;
  props: { activeNotes: string[] };
  updateProps: any;
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
    <OctaveContainer
      onMouseDown={enableTriggering}
      onMouseUp={disableTriggering}
      onMouseLeave={disableTriggering}
    >
      <ComputerMidiKeyboard id={id} />
      <Octave id={id} props={props} triggerable={triggerable} octave={2} />
      <Octave id={id} props={props} triggerable={triggerable} octave={3} />
      <Octave id={id} props={props} triggerable={triggerable} octave={4} />
    </OctaveContainer>
  );
}
