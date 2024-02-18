import { useAppDispatch } from "hooks";
import { ChangeEvent, useState } from "react";

import {
  addNewModule,
  AvailableModules,
} from "components/AudioModule/modulesSlice";
import Modal from "components/Modal";
import { Select } from "components/ui";

const Options = Object.values(AvailableModules).map((am) => ({
  name: am.name,
  value: am.type,
}));

export default function AddAudioModule() {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("");

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  const addAudioModule = () => {
    dispatch(addNewModule(type));
  };

  return (
    <Modal modalName="addAudioModule">
      <Select
        value={type}
        label="Select audio module"
        onChange={onSelect}
        options={Options}
      />
      <button className="btn primary mt-2 float-right" onClick={addAudioModule}>
        Add
      </button>
    </Modal>
  );
}
