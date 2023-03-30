import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

import Modal, { close as closeModal } from "components/Modal";
import { useAppDispatch } from "hooks";
import Patch from "./Patch";

export default function SavePatch() {
  const dispatch = useAppDispatch();
  const [patchId, setPatchId] = useState("");

  const onSelect = (event: SelectChangeEvent) => setPatchId(event.target.value);
  const select = () => {
    Patch.load(patchId).then(() => {
      dispatch(closeModal("patch"));
    });
  };

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
          {Patch.availablePatches.map((id) => (
            <MenuItem key={id} value={id}>
              {id}
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
