import { ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { close as _close } from "./modalSlice";

export { open, close } from "./modalSlice";
export { default as TriggerModal } from "./TriggerModal";

interface ModalProps {
  children: ReactNode;
  modalName: string;
  className?: string;
  onClose?(): void;
}

export default function Modal(props: ModalProps) {
  const { children, modalName, onClose } = props;

  const dispatch = useAppDispatch();
  const { isOpen, modalName: currentModalName } = useAppSelector(
    (state) => state.modal,
  );

  if (currentModalName !== modalName) return null;
  if (!isOpen) return null;

  const close = () => {
    dispatch(_close(modalName));
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full dark:bg-gray-800">
        <div className="flex justify-end">
          <button onClick={close} className="text-black">
            <span className="text-xl">&times;</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
