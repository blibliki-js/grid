import { RouteInterface } from "@blibliki/engine/build/routes";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { sortBy } from "lodash";
import {
  ModuleProps,
  modulesSelector,
} from "components/AudioModule/modulesSlice";
import { useAppDispatch, useAppSelector } from "hooks";
import { ReactNode } from "react";
import AddRoute from "./AddRoute";
import { removeRoute, routesSelector } from "./routesSlice";

export default function Routes() {
  return (
    <Box>
      <RouteList />
    </Box>
  );
}

function RouteList() {
  const routes = useAppSelector((state) => routesSelector.selectAll(state));
  const modules = useAppSelector((state) => modulesSelector.selectAll(state));

  const routesWithNames = getRouteNames(routes, modules);

  return (
    <>
      {modules
        .sort((m1, m2) => m1.name.localeCompare(m2.name))
        .map((audioModule) => (
          <ModuleRoutes
            key={audioModule.id}
            audioModule={audioModule}
            routes={routesWithNames}
          />
        ))}
    </>
  );
}

function ModuleRoutes(props: {
  audioModule: ModuleProps;
  routes: RouteWithNames[];
}) {
  const dispatch = useAppDispatch();
  const { audioModule, routes } = props;

  const onClick = (id: string) => () => {
    const route = routes.find((r) => r.id === id);
    if (!route) return;

    dispatch(removeRoute(route.id));
  };

  if (audioModule.outputs.length === 0) return null;

  return (
    <Container>
      <Typography>{audioModule.name}</Typography>
      <AddRoute audioModule={audioModule} />
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>Source</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routes
            .filter((r) => r.sourceId === audioModule.id)
            .map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.outputName}</TableCell>
                <TableCell>{route.destinationName}</TableCell>
                <TableCell>
                  <Button onClick={onClick(route.id)}>x</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Container>
  );
}

function Container(props: { children: ReactNode }) {
  const { children } = props;
  return <Box sx={{ p: 2, m: 2, border: 1, width: 700 }}>{children}</Box>;
}

interface RouteWithNames {
  id: string;
  sourceId: string;
  outputName: string;
  destinationName: string;
}

function getRouteNames(
  routes: RouteInterface[],
  modules: ModuleProps[]
): RouteWithNames[] {
  const routesWithNames = routes.map((route) => {
    const source = modules.find((m) => m.id === route.sourceId);
    const destination = modules.find((m) => m.id === route.destinationId);

    if (!source || !destination) throw Error("Routing error");

    const output = source.outputs.find((io) => io.name === route.outputName);
    const input = destination.inputs.find((io) => io.name === route.inputName);

    if (!output || !input) throw Error("Routing error");

    return {
      id: route.id,
      sourceId: route.sourceId,
      outputName: output.name,
      destinationName: `${input.moduleName} // ${input.name}`,
    };
  });

  return sortBy(routesWithNames, ["outputName", "destinationName"]);
}
