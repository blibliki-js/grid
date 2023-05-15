import { Button } from "@mui/material";
import { modulesSelector } from "components/AudioModule/modulesSlice";
import { routesSelector } from "Routes/routesSlice";
import { layoutsSelector } from "Grid/layoutsSlice";
import { useAppSelector } from "hooks";

export default function Export() {
  const { patch } = useAppSelector((state) => state.patch);
  const modules = useAppSelector((state) => modulesSelector.selectAll(state));
  const routes = useAppSelector((state) => routesSelector.selectAll(state));
  const layouts = useAppSelector((state) => layoutsSelector.selectAll(state));

  const exportJSON = () => {
    const data = { id: patch.id, name: patch.name, modules, routes, layouts };
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${patch.name.split(" ").join("_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <Button onClick={exportJSON}>Export</Button>;
}
