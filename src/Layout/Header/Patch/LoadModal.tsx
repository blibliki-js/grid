import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import db from "models/db";
import Modal, { close as closeModal } from "components/Modal";
import { useAppDispatch } from "hooks";

export default function SavePatch() {
  const dispatch = useAppDispatch();
  const [patchId, setPatchId] = useState("");

  const patches = useLiveQuery(() => db.patches.toArray(), []);

  const onSelect = (event: SelectChangeEvent) => setPatchId(event.target.value);
  const select = () => {
    dispatch(closeModal("patch"));
  };

  if (!patches) return null;

  return (
    <Modal modalName="patch">
      <FormControl fullWidth>
        <InputLabel id="select-patch-label">Select Patch</InputLabel>
        <Select
          labelId="select-patch-label"
          id="patch-select"
          value={patchId}
          label="AudioModule"
          onChange={onSelect}
        >
          {patches.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={select}>
        Select
      </Button>
    </Modal>
  );
}
