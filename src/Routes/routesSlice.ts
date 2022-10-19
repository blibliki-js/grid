import {
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "store";
import Engine from "@blibliki/engine";

export interface RouteProps {
  sourceId: string;
  outputName: string;
  destinationId: string;
  inputName: string;
}

interface RouteInterface extends RouteProps {
  id: string;
}

const routesAdapter = createEntityAdapter<RouteInterface>({});

export const routesSlice = createSlice({
  name: "routes",
  initialState: routesAdapter.getInitialState(),
  reducers: {
    addRoute: (state: EntityState<any>, action: PayloadAction<RouteProps>) => {
      const payload = Engine.addRoute(action.payload);
      return routesAdapter.addOne(state, payload);
    },
    removeRoute: (
      state: EntityState<any>,
      action: PayloadAction<RouteInterface>
    ) => {
      Engine.removeRoute(action.payload);
      return routesAdapter.removeOne(state, action.payload.id);
    },
  },
});

export const routesSelector = routesAdapter.getSelectors(
  (state: RootState) => state.routes
);

export const { addRoute, removeRoute } = routesSlice.actions;

export default routesSlice.reducer;
