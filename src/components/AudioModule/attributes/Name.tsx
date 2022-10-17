import { TextField } from "@mui/material";
import { useAppDispatch } from "hooks";
import { ChangeEvent } from "react";
import { updateModuleName } from "../modulesSlice";

interface NameInterface {
  id: string;
  value: string;
}

export default function Name(props: NameInterface) {
  const dispatch = useAppDispatch();
  const { id, value } = props;

  const updateProp = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateModuleName({ id, name: event.target.value }));
  };

  return <TextField variant="standard" value={value} onChange={updateProp} />;
}
