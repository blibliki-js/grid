import { Fab, ListItem } from "@mui/material";

import { SequenceProps } from ".";

interface IStep {
  step: number;
  selectedStep: number;
  sequence: SequenceProps;
  updateCallback: (props: Partial<SequenceProps>) => void;
  selectCallback: () => void;
}

export default function Step(props: IStep) {
  const { step, selectedStep, sequence, updateCallback, selectCallback } =
    props;

  const activate = () => {
    updateCallback({ active: !sequence.active });
  };

  return (
    <ListItem
      sx={{
        padding: "4px",
        fontSize: "0.8rem",
        flexDirection: "column",
      }}
    >
      <Fab
        style={{ transform: "scale(0.3)" }}
        size="small"
        color={sequence.active ? "primary" : undefined}
        onClick={activate}
      />
      <Fab
        size="small"
        color={step === selectedStep ? "primary" : undefined}
        onClick={selectCallback}
      >
        {step + 1}
      </Fab>
    </ListItem>
  );
}
