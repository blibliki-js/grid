import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";

import db from "models/db";
import Modal, { close as closeModal } from "components/Modal";
import { useAppDispatch } from "hooks";
import { loadById } from "patchSlice";

export default function SavePatch() {
  const dispatch = useAppDispatch();

  const patches = useLiveQuery(() => db.patches.toArray(), []);

  const close = () => {
    dispatch(closeModal("patch"));
  };

  const select = (id: number) => () => {
    dispatch(loadById(id));
    dispatch(closeModal("patch"));
  };

  if (!patches) return null;

  return (
    <Modal modalName="patch">
      <h2>Select a patch</h2>
      <Paper style={{ maxHeight: 300, overflow: "auto" }}>
        <List>
          <ListItem>
            <ListItemButton component="button" onClick={close}>
              <ListItemText primary="New patch" />
            </ListItemButton>
          </ListItem>
          {patches.map(({ id, name }) => (
            <ListItem key={id}>
              <ListItemButton component="button" onClick={select(id)}>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Modal>
  );
}
