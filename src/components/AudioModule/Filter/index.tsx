import styled from "@emotion/styled";

import Fader, { MarkProps } from "components/Fader";
import Cutoff from "./Cutoff";
import Resonance from "./Resonance";
import FilterType from "./FilterType";
import Slope from "./Slope";
import Name from "../attributes/Name";

interface FilterProps {
  id: string;
  name: string;
  updateProps: (id: string, props: any) => void;
  props: {
    cutoff: number;
    resonance: number;
    envelopeAmount: number;
    filterType: BiquadFilterType;
    slope: number;
  };
}

const FilterContainer = styled.div`
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

const AmountCenter: MarkProps[] = [{ value: 0, label: "-" }];

export default function Filter(props: FilterProps) {
  const {
    id,
    updateProps,
    name: title,
    props: { cutoff, resonance, filterType, slope, envelopeAmount },
  } = props;

  const updateProp = (propName: string) => (value: number) => {
    updateProps(id, { [propName]: value });
  };

  return (
    <FilterContainer>
      <Title>
        <Name id={id} value={title} />
      </Title>

      <FaderContainer>
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
      </FaderContainer>
    </FilterContainer>
  );
}
