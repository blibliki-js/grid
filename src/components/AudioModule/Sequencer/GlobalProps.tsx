import { ChangeEvent } from "react";
import { InputText } from "components/ui";

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
    <div className="flex p-2">
      <Steps id={id} steps={steps} updateProps={updateProps} />
      <Bars id={id} bars={bars} updateProps={updateProps} />
      <CurrenrBar
        currentBar={currentBar}
        bars={bars}
        setCurrentBar={setCurrentBar}
      />
    </div>
  );
}

function Bars(props: { id: string; bars: number; updateProps: Function }) {
  const { id, bars, updateProps } = props;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateProps(id, { bars: +event.target.value });
  };

  return (
    <InputText
      label="Number of Bars"
      type="number"
      onChange={onChange}
      className="w-[120px] mr-2"
      value={bars.toString()}
    />
  );
}

function Steps(props: { id: string; steps: number; updateProps: Function }) {
  const { id, steps, updateProps } = props;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateProps(id, { steps: +event.target.value });
  };

  return (
    <InputText
      label="Number of Steps"
      type="number"
      onChange={onChange}
      className="w-[120px] mr-2"
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
    <InputText
      label="Current bar"
      type="number"
      onChange={onChange}
      className="w-[100px]"
      value={currentBar + 1}
    />
  );
}
