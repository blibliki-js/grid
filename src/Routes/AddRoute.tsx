import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import {
  modulesSelector,
  ModuleProps,
} from "components/AudioModule/modulesSlice";
import { useAppDispatch, useAppSelector } from "hooks";
import { useState } from "react";

import { addRoute } from "./routesSlice";

export default function AddRoute(props: { audioModule: ModuleProps }) {
  const dispatch = useAppDispatch();
  const { audioModule } = props;
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
    const output = audioModule.outputs.find((io) => io.id === sourceId);
    const input = inputs(modules).find((io) => io.id === destinationId);
    if (!output || !input) return;

    const route = {
      sourceId: output.moduleId,
      outputName: output.name,
      destinationId: input.moduleId,
      inputName: input.name,
    };

    dispatch(addRoute(route));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="add-source-label">Select source</InputLabel>
          <Select
            labelId="add-source-label"
            id="add-source-select"
            value={sourceId}
            label="Source"
            onChange={onSelectSource}
          >
            {audioModule.outputs.map((io) => (
              <MenuItem key={io.id} value={io.id}>
                {io.moduleName} // {io.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
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
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <Button onClick={onAddRoute}>Add route</Button>
        </FormControl>
      </Grid>
    </Grid>
  );
}

function inputs(audioModules: ModuleProps[]) {
  return audioModules.map((m) => m.inputs).flat();
}
