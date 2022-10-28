import Fader from "components/Fader";

interface ResonanceProps {
  id: string;
  value: number;
  updateProps: (id: string, props: any) => void;
}

export default function Resonance(props: ResonanceProps) {
  const { id, value, updateProps } = props;

  const updateProp = (_: number, calcValue: number) => {
    updateProps(id, { resonance: calcValue });
  };

  return (
    <Fader
      name="Q"
      min={0}
      max={100}
      onChange={updateProp}
      value={value}
      exp={5}
    />
  );
}
