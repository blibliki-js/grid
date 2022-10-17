import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { AvailableModules } from "components/AudioModule/modulesSlice";
import { useAppDispatch } from "hooks";
import { useState } from "react";

import { addLayout } from "./layoutsSlice";

export default function AddAudioModule() {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("");

  const onSelect = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const addAudioModule = () => {
    dispatch(addLayout(type));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="add-module-label">Select Module</InputLabel>
      <Select
        labelId="add-module-label"
        id="add-module-selectg"
        value={type}
        label="AudioModule"
        onChange={onSelect}
      >
        {Object.values(AvailableModules).map(({ name, type }) => (
          <MenuItem key={type} value={type}>
            {name}
          </MenuItem>
        ))}
      </Select>
      <Button variant="contained" onClick={addAudioModule}>
        Add
      </Button>
    </FormControl>
  );
}
