import Modal, { close as closeModal } from "@/components/Modal";
import { useAppDispatch, usePatches } from "@/hooks";
import { loadById } from "@/patchSlice";
import Link from "next/link";

export default function SavePatch() {
  const dispatch = useAppDispatch();
  const patches = usePatches();

  const close = () => {
    dispatch(closeModal("patch"));
  };

  const select = (id: string) => () => {
    dispatch(loadById(id));
    dispatch(closeModal("patch"));
  };

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
