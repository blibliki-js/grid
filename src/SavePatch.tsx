import { Button } from "@mui/material";
import { savePatch } from "store/localStorege";

export default function SavePatch() {
  return <Button onClick={savePatch}>Save patch</Button>;
}
