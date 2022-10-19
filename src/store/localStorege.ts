import {
  addModule,
  ModuleProps,
  modulesSelector,
} from "components/AudioModule/modulesSlice";
import { addPlainLayout, ExtendedLayout } from "Grid/layoutsSlice";
import { addRoute, RouteProps } from "Routes/routesSlice";
import { store } from "store";

const KEY = "grid-state";

export function savePatch() {
  const { modules, layouts, routes } = store.getState();
  localStorage.setItem(KEY, JSON.stringify({ modules, layouts, routes }));
}

export function loadPatch() {
  const { layouts, modules, routes } = JSON.parse(
    localStorage.getItem(KEY) || "{}"
  );

  if (modules) loadModules(Object.values(modules.entities));
  if (routes) loadRoutes(fixModuleIds(Object.values(routes.entities)));
  if (layouts) loadLayouts(Object.values(layouts.entities));
}

export function getInitialMasterId() {
  const { modules } = JSON.parse(localStorage.getItem(KEY) || "{}");
  const master = (Object.values(modules.entities) as ModuleProps[]).find(
    (m) => m.type === "master"
  );

  return master ? master.id : "";
}

function loadModules(modules: ModuleProps[]) {
  modules.forEach((m) => {
    if (m.type === "master") return;

    store.dispatch(addModule(m));
  });
}

function loadRoutes(routes: RouteProps[]) {
  routes.forEach((r) => {
    store.dispatch(addRoute(r));
  });
}

function loadLayouts(layouts: ExtendedLayout[]) {
  layouts.forEach((l) => {
    store.dispatch(addPlainLayout(l));
  });
}

function fixModuleIds(routes: RouteProps[]) {
  const modules = modulesSelector.selectAll(store.getState());

  return routes.map((route) => {
    const { sourceId, destinationId } = route;

    const source = modules.find((m) => m.initialId === sourceId);
    const destination = modules.find((m) => m.initialId === destinationId);

    if (!source || !destination) throw Error("Id matching failed");

    return { ...route, sourceId: source.id, destinationId: destination.id };
  });
}
