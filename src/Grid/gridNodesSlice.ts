import { v4 as uuidv4 } from "uuid";
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
import { AppDispatch } from "store";
import {
  addModule,
  AvailableModules,
} from "components/AudioModule/modulesSlice";

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
      return action.payload;
    },
    removeAllGridNodes: () => {
      return { nodes: [], edges: [] };
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    onConnect: (state, action: PayloadAction<Connection>) => {
      state.edges = addEdge(action.payload, state.edges);
    },
  },
});

export const {
  setGridNodes,
  removeAllGridNodes,
  addNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
} = gridNodesSlice.actions;

export const addNewAudioNode = (type: string) => (dispatch: AppDispatch) => {
  const id = uuidv4();
  dispatch(
    addNode({ id, type: "audioNode", position: { x: 0, y: 0 }, data: { type } })
  );

  const modulePayload = AvailableModules[type];
  dispatch(addModule({ ...modulePayload, gridNodeId: id }));
};

export default gridNodesSlice.reducer;
