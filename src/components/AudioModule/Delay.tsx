import styled from "@emotion/styled";

import Fader from "components/Fader";
import Name from "./attributes/Name";

interface DelayProps {
  id: string;
  name: string;
  updateProps: Function;
  props: { delayTime: number; feedback: number; wet: number };
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

export default function Delay(props: DelayProps) {
  const {
    id,
    updateProps,
    name: title,
    props: { delayTime, feedback, wet },
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
          name="delayTime"
          min={0}
          max={1}
          onChange={updateProp("delayTime")}
          value={delayTime}
        />
        <Fader
          name="feedback"
          min={0}
          max={1}
          onChange={updateProp("feedback")}
          value={feedback}
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
