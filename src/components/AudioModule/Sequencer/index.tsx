import { useState } from "react";
import styled from "@emotion/styled";
import { Box, List } from "@mui/material";
import { ISequence } from "@blibliki/engine";

import GlobalProps from "./GlobalProps";
import StepProps from "./StepProps";
import Step from "./Step";
import Name from "../attributes/Name";

const Title = styled.div`
  text-align: center;
  margin-bottom: 5px;
`;

export interface SequenceProps extends ISequence {
  duration: string;
}

export default function Sequencer(props: {
  id: string;
  name: string;
  props: { bars: number; steps: number; sequences: SequenceProps[][] };
  updateProps: Function;
}) {
  const {
    id,
    updateProps,
    name: title,
    props: { bars, steps, sequences },
  } = props;
  const [bar, setBar] = useState<number>(0);
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const barSequences = sequences[bar];
  const selectedSequence = barSequences[selectedStep];

  const update = (step: number) => (props: Partial<SequenceProps>) => {
    const sequence: SequenceProps = { ...barSequences[step], ...props };

    if (barSequences[step].notes.length === 0 && !props.notes?.length) {
      const prevSequence = sequences.flat().find((sequence) => sequence.active);

      if (prevSequence) {
        sequence.notes = [...prevSequence.notes];
      }
    }

    const newBarSequences = barSequences.map((_, i) =>
      i === step ? sequence : barSequences[i]
    );

    const newSequences = sequences.map((_, i) =>
      i === bar ? newBarSequences : sequences[i]
    );

    updateProps(id, { sequences: newSequences });
  };

  const onSelectStep = (step: number) => () => {
    update(step)({});
    setSelectedStep(step);
  };

  return (
    <Box>
      <Title>
        <Name id={id} value={title} />
      </Title>

      <GlobalProps
        id={id}
        currentBar={bar}
        bars={bars}
        steps={steps}
        setCurrentBar={setBar}
        updateProps={updateProps}
      />

      <StepProps
        step={selectedStep}
        sequence={selectedSequence}
        updateCallback={update(selectedStep)}
      />

      <List sx={{ display: "flex", flexDirection: "row" }}>
        {barSequences.map((sequence, i) => (
          <Step
            key={i}
            step={i}
            selectedStep={selectedStep}
            sequence={sequence}
            updateCallback={update(i)}
            selectCallback={onSelectStep(i)}
          />
        ))}
      </List>
    </Box>
  );
}
