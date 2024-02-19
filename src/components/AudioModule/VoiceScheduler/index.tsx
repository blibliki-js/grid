import { Select } from "@/components/ui";
import { ChangeEvent } from "react";
import Container from "../Container";

const VOICE_SELECTIONS = [1, 2, 3, 4, 5, 6];

export default function VoiceScheduler(props: {
  id: string;
  props: { polyNumber: number };
  updateProps: Function;
}) {
  const {
    id,
    updateProps,
    props: { polyNumber },
  } = props;
  const updateSelectedId = (event: ChangeEvent<HTMLSelectElement>) => {
    updateProps(id, { polyNumber: Number(event.target.value) });
  };

  return (
    <Container>
      <Select
        value={polyNumber}
        options={VOICE_SELECTIONS}
        onChange={updateSelectedId}
      />
    </Container>
  );
}
