import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import {
  modulesSelector,
  ModuleProps,
} from "components/AudioModule/modulesSlice";
import { useAppDispatch, useAppSelector } from "hooks";
import { useState } from "react";

import { addRoute } from "./routesSlice";

export default function AddRoute() {
  const dispatch = useAppDispatch();
  const modules = useAppSelector((state) => modulesSelector.selectAll(state));

  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");

  const onSelectSource = (event: SelectChangeEvent) => {
    setSourceId(event.target.value);
  };

  const onSelectDestination = (event: SelectChangeEvent) => {
    setDestinationId(event.target.value);
  };

  const onAddRoute = () => {
    const output = outputs(modules).find((io) => io.id === sourceId);
    const input = inputs(modules).find((io) => io.id === destinationId);
    if (!output || !input) return;

    const route = {
      sourceId: output.moduleId,
      outputId: output.id,
      destinationId: input.moduleId,
      inputId: input.id,
    };

    dispatch(addRoute(route));
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="add-source-label">Select source</InputLabel>
        <Select
          labelId="add-source-label"
          id="add-source-select"
          value={sourceId}
          label="Source"
          onChange={onSelectSource}
        >
          {outputs(modules).map((io) => (
            <MenuItem key={io.id} value={io.id}>
              {io.moduleName} // {io.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="add-destination-label">Select destination</InputLabel>
        <Select
          labelId="add-destination-label"
          id="add-destination-select"
          value={destinationId}
          label="Destionation"
          onChange={onSelectDestination}
        >
          {inputs(modules).map((io) => (
            <MenuItem key={io.id} value={io.id}>
              {io.moduleName} // {io.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Button onClick={onAddRoute}>Add route</Button>
      </FormControl>
    </>
  );
}

function inputs(audioModules: ModuleProps[]) {
  return audioModules.map((m) => m.inputs).flat();
}

function outputs(audioModules: ModuleProps[]) {
  return audioModules.map((m) => m.outputs).flat();
}
