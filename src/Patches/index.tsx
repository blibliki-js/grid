import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import Patch from "./Patch";

export default function SavePatch() {
  const [patchId, setPatchId] = useState("");
  const [patch, setPatch] = useState<Patch>();

  const onSelect = (event: SelectChangeEvent) => setPatchId(event.target.value);
  const select = () => Patch.load(patchId).then((patch) => setPatch(patch));
  const save = () => patch?.save();

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="select-patch-label">Select Patch</InputLabel>
          <Select
            labelId="select-patch-label"
            id="patch-select"
            value={patchId}
            label="AudioModule"
            onChange={onSelect}
          >
            {Patch.availablePatches.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" onClick={select}>
          Select
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={save}>Save</Button>
      </Grid>
    </Grid>
  );
}
