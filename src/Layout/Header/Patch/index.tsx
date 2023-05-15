import { MouseEvent, ReactNode, useState } from "react";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { TriggerModal } from "components/Modal";

import LoadModal from "./LoadModal";
import AddAudioModuleModal from "./AddAudioModuleModal";
import Export from "./Export";
import { useAppDispatch, useAppSelector } from "hooks";
import { destroy, save } from "patchSlice";

export default function Patch() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { patch } = useAppSelector((state) => state.patch);

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
        <MenuItem onClick={handleClose}>
          <Save asNew={false} disabled={Boolean(patch.staticId)}>
            Save
          </Save>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Save asNew={true} disabled={!Boolean(patch.id)}>
            Copy
          </Save>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <TriggerModal modalName="patch" type="open">
            Load
          </TriggerModal>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Destroy disabled={!Boolean(patch.id) || Boolean(patch.staticId)}>
            Delete
          </Destroy>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Export />
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

function Save(props: {
  asNew: boolean;
  disabled: boolean;
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { asNew, disabled, children } = props;

  const onSave = () => {
    dispatch(save(asNew));
  };

  return (
    <Button onClick={onSave} disabled={disabled}>
      {children}
    </Button>
  );
}

function Destroy(props: { disabled: boolean; children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { disabled, children } = props;

  const onDestroy = () => {
    dispatch(destroy());
  };

  return (
    <Button onClick={onDestroy} disabled={disabled}>
      {children}
    </Button>
  );
}
