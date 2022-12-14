import styled from "@emotion/styled";

import Fader from "components/Fader";
import Name from "../attributes/Name";

const EnvelopeContainer = styled.div`
  padding: 5px;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 5px;
`;

const FaderContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

interface EnvelopeProps {
  id: string;
  name: string;
  updateProps: Function;
  props: { attack: number; decay: number; sustain: number; release: number };
}

export default function Envelope(props: EnvelopeProps) {
  const {
    id,
    name,
    updateProps,
    props: { attack, decay, sustain, release },
  } = props;

  const updateProp = (propName: string) => (value: number | string) => {
    updateProps(id, { [propName]: value });
  };

  return (
    <EnvelopeContainer>
      <Title>
        <Name id={id} value={name} />
      </Title>

      <FaderContainer>
        <Fader name="A" onChange={updateProp("attack")} value={attack} />
        <Fader name="D" onChange={updateProp("decay")} value={decay} />
        <Fader name="S" onChange={updateProp("sustain")} value={sustain} />
        <Fader name="R" onChange={updateProp("release")} value={release} />
      </FaderContainer>
    </EnvelopeContainer>
  );
}
