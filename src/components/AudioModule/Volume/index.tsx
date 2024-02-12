import Fader from "components/Fader";
import Container from "../Container";

interface VolumeProps {
  id: string;
  name: string;
  updateProps: Function;
  props: any;
}

export default function Volume(props: VolumeProps) {
  const {
    id,
    name,
    updateProps,
    props: { volume },
  } = props;

  const updateVolume = (value: number) => {
    updateProps(id, { volume: value });
  };

  return (
    <Container>
      <Fader
        name={name || ""}
        onChange={updateVolume}
        value={volume}
        min={-100}
        max={0}
        step={1}
      />
    </Container>
  );
}
