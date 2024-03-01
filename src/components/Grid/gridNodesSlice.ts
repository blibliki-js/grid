import Engine, { RouteInterface, RouteProps } from "@blibliki/engine";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Viewport,
} from "reactflow";

import { AppDispatch, RootState } from "@/store";
import { removeModule } from "@/components/AudioModule/modulesSlice";
import { cloneDeep } from "lodash";

export interface IGridNodes {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}

const initialState: IGridNodes = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
};

export const gridNodesSlice = createSlice({
  name: "gridNodes",
  initialState,
  reducers: {
    setGridNodes: (_, action: PayloadAction<IGridNodes>) => {
      action.payload.edges.forEach((edge) => {
        const route: RouteInterface = {
          id: edge.id,
          ...connectionToRoute(edge as Connection),
        };
        Engine.addRoute(route);
      });
      return action.payload;
    },
    removeAllGridNodes: () => {
      return { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };
    },
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action: PayloadAction<Node>) => {
      const node = action.payload;
      const nodes = state.nodes.filter((n) => n.id !== node.id);

      state.nodes = [...nodes, node];
    },
    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      const changes = action.payload;
      state.edges = applyEdgeChanges(changes, state.edges);

      changes.forEach((change) => {
        if (change.type !== "remove") return;

        Engine.removeRoute(change.id);
      });
    },
    onConnect: (state, action: PayloadAction<Connection>) => {
      const route = Engine.addRoute(connectionToRoute(action.payload));
      state.edges = addEdge({ id: route.id, ...action.payload }, state.edges);
    },
    setViewport: (state, action: PayloadAction<Viewport>) => {
      state.viewport = action.payload;
    },
  },
});

const { setNodes } = gridNodesSlice.actions;

export const {
  setGridNodes,
  removeAllGridNodes,
  addNode,
  updateNode,
  onEdgesChange,
  onConnect,
  setViewport,
} = gridNodesSlice.actions;

export const onNodesChange =
  (changes: NodeChange[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nodes = cloneDeep(getState().gridNodes.nodes);
    dispatch(setNodes(applyNodeChanges(changes, nodes)));

    changes.forEach((change) => {
      if (change.type !== "remove") return;

      dispatch(removeModule(change.id));
    });
  };

function connectionToRoute(connection: Connection): RouteProps {
  const {
    source: sourceId,
    sourceHandle: sourceIOId,
    target: destinationId,
    targetHandle: destinationIOId,
  } = connection;

  if (!sourceId || !sourceIOId || !destinationId || !destinationIOId)
    throw Error("Some value is null");

  return { sourceId, sourceIOId, destinationId, destinationIOId };
}

export default gridNodesSlice.reducer;
