"use client";

import { ChangeEvent } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { start, stop, setBpm } from "@/globalSlice";
import { setName as setPatchName } from "@/patchSlice";
import { Input } from "@/components/ui";

import ColorSchemeToggle from "./ColorSchemeToggle";
import Patch from "./Patch";
import LoadModal from "./Patch/LoadModal";
import AddAudioModuleModal from "./Patch/AddAudioModuleModal";

export default function Header() {
  const dispatch = useAppDispatch();
  const { isStarted, bpm } = useAppSelector((state) => state.global);
  const {
    patch: { name: patchName },
  } = useAppSelector((state) => state.patch);

  const togglePlay = () => {
    const toggle = isStarted ? stop : start;
    dispatch(toggle());
  };

  return (
    <div className="flex items-center justify-between p-2 border-b-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-900">
      <div className="flex gap-2">
        <Patch />
        <Input
          className="w-40"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            dispatch(setPatchName(event.target.value))
          }
          value={patchName}
        />
        <Input
          className="w-20"
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            dispatch(setBpm(+event.target.value))
          }
          value={bpm}
        />
      </div>
      <div>
        <button className="btn secondary border-2" onClick={togglePlay}>
          {isStarted ? "Stop" : "Start"}
        </button>
      </div>
      <div>
        <a
          href="https://github.com/blibliki-js/grid"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        <ColorSchemeToggle />
      </div>

      <LoadModal />
      <AddAudioModuleModal />
    </div>
  );
}
