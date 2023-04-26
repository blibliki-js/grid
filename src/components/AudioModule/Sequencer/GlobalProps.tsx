import { ChangeEvent } from "react";
import { Box, TextField } from "@mui/material";

interface IGlobalProps {
  id: string;
  currentBar: number;
  bars: number;
  steps: number;
  setCurrentBar: (bar: number) => void;
  updateProps: Function;
}

export default function GlobalProps(props: IGlobalProps) {
  const { id, currentBar, bars, steps, setCurrentBar, updateProps } = props;

  return (
    <Box sx={{ padding: "8px 0" }}>
      <Steps id={id} steps={steps} updateProps={updateProps} />
      <Bars id={id} bars={bars} updateProps={updateProps} />
      <CurrenrBar
        currentBar={currentBar}
        bars={bars}
        setCurrentBar={setCurrentBar}
      />
    </Box>
  );
}

function Bars(props: { id: string; bars: number; updateProps: Function }) {
  const { id, bars, updateProps } = props;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateProps(id, { bars: +event.target.value });
  };

  return (
    <TextField
      sx={{ width: "120px", paddingRight: "8px" }}
      label="Number of Bars"
      variant="outlined"
      type="number"
      InputProps={{ inputProps: { min: 0 } }}
      onChange={onChange}
      value={bars}
    />
  );
}

function Steps(props: { id: string; steps: number; updateProps: Function }) {
  const { id, steps, updateProps } = props;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateProps(id, { steps: +event.target.value });
  };

  return (
    <TextField
      sx={{ width: "120px", paddingRight: "8px" }}
      label="Number of Steps"
      variant="outlined"
      type="number"
      InputProps={{ inputProps: { min: 0 } }}
      onChange={onChange}
      value={steps}
    />
  );
}

function CurrenrBar(props: {
  setCurrentBar: (bar: number) => void;
  currentBar: number;
  bars: number;
}) {
  const { currentBar, bars, setCurrentBar } = props;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newBar = (+event.target.value - 1) % bars;
    setCurrentBar(Math.abs(newBar));
  };

  return (
    <TextField
      sx={{ width: "100px" }}
      label="Current bar"
      variant="outlined"
      type="number"
      InputProps={{ inputProps: { min: 0 } }}
      onChange={onChange}
      value={currentBar + 1}
    />
  );
}
