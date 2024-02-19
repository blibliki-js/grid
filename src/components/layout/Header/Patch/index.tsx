"use client";

import { ReactNode, useState } from "react";

import { TriggerModal } from "@/components/Modal";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { destroy, save } from "@/patchSlice";
import Export from "./Export";

export default function Patch() {
  const { patch } = useAppSelector((state) => state.patch);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={handleClick} className="px-4 py-2 text-blue-700">
        Patch
      </button>
      {isOpen && (
        <div className="absolute -left-[15px] w-40 z-10 mt-3 bg-white border shadow-xl">
          <MenuItem>
            <Save asNew={false} disabled={Boolean(patch.staticId)}>
              Save
            </Save>
          </MenuItem>
          <MenuItem>
            <Save asNew={true} disabled={!patch.id}>
              Copy
            </Save>
          </MenuItem>
          <MenuItem>
            <TriggerModal modalName="patch" type="open">
              Load
            </TriggerModal>
          </MenuItem>
          <MenuItem>
            <Destroy disabled={!patch.id || Boolean(patch.staticId)}>
              Delete
            </Destroy>
          </MenuItem>
          <MenuItem>
            <Export />
          </MenuItem>
          <MenuItem>
            <TriggerModal modalName="addAudioModule" type="open">
              Add module
            </TriggerModal>
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children }: { children: ReactNode }) {
  return (
    <button className="block w-full py-2 text-sm text-gray-700 hover:bg-blue-100">
      {children}
    </button>
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
    <button onClick={onSave} disabled={disabled}>
      {children}
    </button>
  );
}

function Destroy(props: { disabled: boolean; children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { disabled, children } = props;

  const onDestroy = () => {
    dispatch(destroy());
  };

  return (
    <button onClick={onDestroy} disabled={disabled}>
      {children}
    </button>
  );
}
