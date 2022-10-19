import { RouteInterface } from "@blibliki/engine/build/routes";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ModuleProps,
  modulesSelector,
} from "components/AudioModule/modulesSlice";
import { useAppDispatch, useAppSelector } from "hooks";
import AddRoute from "./AddRoute";
import { removeRoute, routesSelector } from "./routesSlice";

export default function Routes() {
  return (
    <Box>
      <AddRoute />
      <RouteList />
    </Box>
  );
}

function RouteList() {
  const dispatch = useAppDispatch();
  const routes = useAppSelector((state) => routesSelector.selectAll(state));
  const modules = useAppSelector((state) => modulesSelector.selectAll(state));

  const routeNames = getRouteNames(routes, modules);

  const onClick = (id: string) => () => {
    const route = routes.find((r) => r.id === id);
    if (!route) return;

    dispatch(removeRoute(route));
  };

  return (
    <Table sx={{ minWidth: 700 }} aria-label="customized table">
      <TableHead>
        <TableRow>
          <TableCell>Source</TableCell>
          <TableCell>Destination</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {routeNames.map(([id, source, destination]) => (
          <TableRow key={id}>
            <TableCell>{source}</TableCell>
            <TableCell>{destination}</TableCell>
            <TableCell>
              <Button onClick={onClick(id)}>x</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getRouteNames(routes: RouteInterface[], modules: ModuleProps[]) {
  return routes.map((route) => {
    const source = modules.find((m) => m.id === route.sourceId);
    const destination = modules.find((m) => m.id === route.destinationId);

    if (!source || !destination) throw Error("Routing error");

    const output = source.outputs.find((io) => io.name === route.outputName);
    const input = destination.inputs.find((io) => io.name === route.inputName);

    if (!output || !input) throw Error("Routing error");

    return [
      route.id,
      `${output.moduleName} // ${output.name}`,
      `${input.moduleName} // ${input.name}`,
    ];
  });
}
