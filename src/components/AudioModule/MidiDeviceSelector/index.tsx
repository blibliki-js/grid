import { ChangeEvent, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "hooks";
import { initialize, devicesSelector } from "./midiDevicesSlice";
import Container from "../Container";
import { Select } from "components/ui";

export default function MidiDeviceSelector(props: {
  id: string;
  props: { selectedId: string };
  updateProps: Function;
}) {
  const {
    id,
    updateProps,
    props: { selectedId },
  } = props;

  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => devicesSelector.selectAll(state));

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  const updateSelectedId = (event: ChangeEvent<HTMLSelectElement>) => {
    updateProps(id, { selectedId: event.target.value });
  };

  return (
    <Container>
      <Select
        label="Select MIDI device"
        value={selectedId || ""}
        options={devices}
        onChange={updateSelectedId}
      />
    </Container>
  );
}
