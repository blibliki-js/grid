import Fader, { MarkProps } from "@/components/Fader";
import Cutoff from "./Cutoff";
import Resonance from "./Resonance";
import FilterType from "./FilterType";
import Slope from "./Slope";
import Container from "../Container";

interface FilterProps {
  id: string;
  updateProps: (id: string, props: any) => void;
  props: {
    cutoff: number;
    resonance: number;
    envelopeAmount: number;
    filterType: BiquadFilterType;
    slope: number;
  };
}

const AmountCenter: MarkProps[] = [{ value: 0, label: "-" }];

export default function Filter(props: FilterProps) {
  const {
    id,
    updateProps,
    props: { cutoff, resonance, filterType, slope, envelopeAmount },
  } = props;

  const updateProp = (propName: string) => (value: number) => {
    updateProps(id, { [propName]: value });
  };

  return (
    <Container>
      <Cutoff id={id} value={cutoff} updateProps={updateProps} />
      <Resonance id={id} value={resonance} updateProps={updateProps} />
      <Fader
        name="Amount"
        marks={AmountCenter}
        min={-8}
        max={8}
        step={0.2}
        onChange={updateProp("envelopeAmount")}
        value={envelopeAmount}
      />
      <FilterType id={id} value={filterType} updateProps={updateProps} />
      <Slope id={id} value={slope} updateProps={updateProps} />
    </Container>
  );
}
