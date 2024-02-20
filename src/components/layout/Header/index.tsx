"use client";

import { ChangeEvent, ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { start, stop, setBpm } from "@/globalSlice";
import { setName as setPatchName } from "@/patchSlice";
import { Input } from "@/components/ui";
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
      <div className="flex">
        <HeaderItem>
          <Patch />
        </HeaderItem>
        <HeaderItem>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              dispatch(setPatchName(event.target.value))
            }
            value={patchName}
          />
        </HeaderItem>
        <HeaderItem>
          <Input
            type="number"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              dispatch(setBpm(+event.target.value))
            }
            value={bpm}
          />
        </HeaderItem>
        <HeaderItem>
          <button className="btn secondary border-2" onClick={togglePlay}>
            {isStarted ? "Stop" : "Start"}
          </button>
        </HeaderItem>
      </div>
      <div>
        <HeaderItem>
          <a
            href="https://github.com/blibliki-js/grid"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </HeaderItem>
      </div>

      <LoadModal />
      <AddAudioModuleModal />
    </div>
  );
}

function HeaderItem(props: { children: ReactNode }) {
  const { children } = props;

  return <div className="mx-2">{children}</div>;
}
