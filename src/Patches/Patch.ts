import { v4 as uuidv4 } from "uuid";
import Engine from "@blibliki/engine";
import { EntityState } from "@reduxjs/toolkit";
import {
  addMaster,
  addModule,
  ModuleProps,
  modulesSelector,
  removeAllModules,
} from "components/AudioModule/modulesSlice";
import {
  addPlainLayout,
  ExtendedLayout,
  removeAllLayouts,
} from "Grid/layoutsSlice";
import { store } from "store";
import { addRoute, removeAllRoutes, RouteProps } from "Routes/routesSlice";

const KEY = "grid-patch";

interface PatchStorage {
  id?: string;
  name?: string;
  modules: ModuleProps[];
  routes: RouteProps[];
  layouts: ExtendedLayout[];
}

const InitPatch = {
  modules: [],
  routes: [],
  layouts: [],
};

const STATIC_PATCHES_PATH = "./staticPatches";
const STATIC_PATCHES: { [Key: string]: string } = {
  a1: "oscSynth.json",
  a2: "threeOscSynth.json",
};

export default class Patch {
  id: string;
  name: string;
  props: PatchStorage;

  static async load(id: string) {
    if (!id.length) return new Patch(InitPatch);

    let patchData = JSON.parse(localStorage.getItem(id) || "null");
    if (!patchData) patchData = await this.loadFromFile(id);
    if (!patchData) throw Error(`Patch with ${id} not found`);

    const patch = new Patch(patchData as PatchStorage);
    patch.load();

    return patch;
  }

  static async loadFromFile(id: string): Promise<Object | null> {
    if (!STATIC_PATCHES[id]) return null;

    return await import(`${STATIC_PATCHES_PATH}/${STATIC_PATCHES[id]}`).then(
      (data) => data
    );
  }

  static get availablePatches() {
    const keys = Object.keys(localStorage).filter((name) =>
      name.startsWith(KEY)
    );

    Object.keys(STATIC_PATCHES).forEach((name) => keys.push(name));
    keys.push("");

    return keys;
  }

  constructor(props: PatchStorage) {
    this.props = props;
    this.id = this.assignId();
    this.name = props.name ? props.name : "Init patch";
  }

  save() {
    const { modules, routes, layouts } = store.getState();
    localStorage.setItem(
      `${KEY}-${this.id}`,
      JSON.stringify({
        id: this.id,
        name: this.name,
        modules: this.prepareForSave<ModuleProps>(modules),
        routes: this.prepareForSave<RouteProps>(routes),
        layouts: this.prepareForSave<ExtendedLayout>(layouts),
      })
    );
  }

  load() {
    const { modules, routes, layouts } = this.props;
    Engine.dispose();
    store.dispatch(removeAllModules());
    store.dispatch(removeAllRoutes());
    store.dispatch(removeAllLayouts());

    this.loadModules(modules);
    this.fixModuleIds(routes).forEach((resource) =>
      store.dispatch(addRoute(resource))
    );
    layouts.forEach((resource) => store.dispatch(addPlainLayout(resource)));
  }

  delete() {
    localStorage.removeItem(`${KEY}-${this.id}`);
  }

  private prepareForSave<Resource>(storeResources?: EntityState<Resource>) {
    if (!storeResources) return [];

    return Object.values(storeResources.entities);
  }

  private fixModuleIds(routes: RouteProps[]): RouteProps[] {
    const modules = modulesSelector.selectAll(store.getState());

    return routes.map((route) => {
      const { sourceId, destinationId } = route;

      const source = modules.find((m) => m.initialId === sourceId);
      const destination = modules.find((m) => m.initialId === destinationId);

      if (!source || !destination) throw Error("Id matching failed");

      return { ...route, sourceId: source.id, destinationId: destination.id };
    });
  }

  private loadModules(modules: ModuleProps[]) {
    const master = Engine.master;

    modules.forEach((m) => {
      if (m.type === "master") {
        store.dispatch(addMaster({ ...master, initialId: m.id, layoutId: "" }));
        return;
      }

      store.dispatch(addModule(m));
    });
  }

  private assignId() {
    if (this.props.id && !Object.keys(STATIC_PATCHES).includes(this.props.id)) {
      return this.props.id;
    }

    return uuidv4();
  }
}
