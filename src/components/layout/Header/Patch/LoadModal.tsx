import { useLiveQuery } from "dexie-react-hooks";
import { ReactNode } from "react";

import { getDb } from "@/models/db";
import Modal, { close as closeModal } from "@/components/Modal";
import { useAppDispatch } from "@/hooks";
import { loadById } from "@/patchSlice";

export default function SavePatch() {
  const dispatch = useAppDispatch();

  const patches = useLiveQuery(() => getDb().patches.toArray(), []);

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
      <div>
        <ul>
          <li onClick={close}>
            <MenuItem>New patch</MenuItem>
          </li>
          {patches.map(({ id, name }) => (
            <li key={id} className="w-full" onClick={select(id)}>
              <MenuItem>{name}</MenuItem>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

function MenuItem({ children }: { children: ReactNode }) {
  return (
    <button className="block w-full py-2 text-sm text-gray-700 hover:bg-blue-100">
      {children}
    </button>
  );
}
