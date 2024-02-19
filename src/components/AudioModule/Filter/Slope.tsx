import Fader, { MarkProps } from "@/components/Fader";

interface SlopeProps {
  id: string;
  value: number;
  updateProps: (id: string, props: any) => void;
}

const SLOPES: MarkProps[] = [
  { value: 0, label: "-12" },
  { value: 1, label: "-24" },
  { value: 2, label: "-48" },
  { value: 3, label: "-96" },
];

export default function Slope(props: SlopeProps) {
  const { id, value, updateProps } = props;

  const index = SLOPES.find((t) => t.label === value.toString())?.value;

  const updateProp = (value: number) => {
    const val = SLOPES.find((t) => t.value === value)?.label || SLOPES[0].label;

    updateProps(id, { slope: parseInt(val) });
  };

  return (
    <Fader name="Slope" marks={SLOPES} onChange={updateProp} value={index} />
  );
}
