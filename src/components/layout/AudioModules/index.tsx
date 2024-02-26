"use client";
import {
  AvailableModules,
  addNewModule,
} from "@/components/AudioModule/modulesSlice";
import { Button } from "@/components/ui";
import { useAppDispatch } from "@/hooks";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

export default function AudioModules() {
  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState<boolean>(true);
  const onClick = () => setVisible(!visible);
  const left = visible ? "0px" : "-150px";

  const addAudioModule = (type: string) => () => {
    dispatch(addNewModule(type));
  };

  return (
    <div
      className="absolute z-10 top-[58px] w-[150px] border-b border-r bg-gray-50 dark:bg-gray-800"
      style={{ left }}
    >
      <Button
        variant="ghost"
        className="absolute left-[150px] border-b border-r bg-gray-50 dark:bg-gray-800"
        onClick={onClick}
      >
        {visible ? <PanelLeftClose /> : <PanelLeftOpen />}
      </Button>
      <nav className="flex-1 overflow-y-auto pt-4 pb-4">
        <ul className="px-2">
          {Object.keys(AvailableModules).map((moduleName) => (
            <li key={moduleName} className="mb-1">
              <Button
                variant="outline"
                className="w-full"
                onClick={addAudioModule(moduleName)}
              >
                {moduleName}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
