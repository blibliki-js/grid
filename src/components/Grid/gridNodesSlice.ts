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
} from "reactflow";

import { AppDispatch, RootState } from "@/store";
import { removeModule } from "@/components/AudioModule/modulesSlice";

export interface IGridNodes {
  nodes: Node[];
  edges: Edge[];
}

const initialState: IGridNodes = {
  nodes: [],
  edges: [],
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
      return { nodes: [], edges: [] };
    },
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
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
  },
});

const { setNodes } = gridNodesSlice.actions;

export const {
  setGridNodes,
  removeAllGridNodes,
  addNode,
  onEdgesChange,
  onConnect,
} = gridNodesSlice.actions;

export const onNodesChange =
  (changes: NodeChange[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nodes = getState().gridNodes.nodes;
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
