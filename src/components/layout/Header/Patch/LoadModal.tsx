import { useLiveQuery } from "dexie-react-hooks";

import { getDb } from "@/models/db";
import Modal, { close as closeModal } from "@/components/Modal";
import { useAppDispatch } from "@/hooks";
import { loadById } from "@/patchSlice";
import Link from "next/link";

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
            <span>New patch</span>
          </li>
          {patches.map(({ id, name }) => (
            <li key={id} className="w-full" onClick={select(id)}>
              <Link href={`/patch/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
