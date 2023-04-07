import { MouseEvent, useState } from "react";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { TriggerModal } from "components/Modal";

import LoadModal from "./LoadModal";
import AddAudioModuleModal from "./AddAudioModuleModal";

export default function Patch() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Patch
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Save</MenuItem>
        <MenuItem onClick={handleClose}>
          <TriggerModal modalName="patch" type="open">
            Load
          </TriggerModal>
        </MenuItem>
        <Divider />

        <MenuItem onClick={handleClose}>
          <TriggerModal modalName="addAudioModule" type="open">
            Add module
          </TriggerModal>
        </MenuItem>
      </Menu>

      <LoadModal />
      <AddAudioModuleModal />
    </div>
  );
}
