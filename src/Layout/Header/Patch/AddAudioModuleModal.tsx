import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useAppDispatch } from "hooks";
import { useState } from "react";

import { AvailableModules } from "components/AudioModule/modulesSlice";
import Modal from "components/Modal";
import { addNewAudioNode } from "Grid/gridNodesSlice";

export default function AddAudioModule() {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("");

  const onSelect = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const addAudioModule = () => {
    dispatch(addNewAudioNode(type));
  };

  return (
    <Modal modalName="addAudioModule">
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
    </Modal>
  );
}
