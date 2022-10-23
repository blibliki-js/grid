import styled from "@emotion/styled";

import Fader from "components/Fader";
import Name from "./attributes/Name";

interface ReverbProps {
  id: string;
  name: string;
  updateProps: Function;
  props: { decay: number; preDelay: number; wet: number };
}

const Container = styled.div`
  padding: 5px;
`;

const FaderContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 5px;
`;

export default function Reverb(props: ReverbProps) {
  const {
    id,
    updateProps,
    name: title,
    props: { decay, preDelay, wet },
  } = props;

  const updateProp = (propName: string) => (value: number) => {
    updateProps(id, { [propName]: value });
  };

  return (
    <Container>
      <Title>
        <Name id={id} value={title} />
      </Title>

      <FaderContainer>
        <Fader
          name="decay"
          min={0}
          max={60}
          onChange={updateProp("decay")}
          value={decay}
        />
        <Fader
          name="preDelay"
          min={0}
          max={0.25}
          onChange={updateProp("preDelay")}
          value={preDelay}
        />
        <Fader
          name="wet"
          min={0}
          max={1}
          onChange={updateProp("wet")}
          value={wet}
        />
      </FaderContainer>
    </Container>
  );
}
