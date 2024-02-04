import { Connection, EdgeChange, Node, NodeChange } from "reactflow";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "store";
import { selectModuleByGridNodeId } from "components/AudioModule/modulesSlice";
import { useCallback } from "react";
import {
  onNodesChange as _onNodesChange,
  onEdgesChange as _onEdgesChange,
  onConnect as _onConnect,
  addNode as _addNode,
} from "Grid/gridNodesSlice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAudioModule = (id: string) => {
  const audioModule = useAppSelector((state) =>
    selectModuleByGridNodeId(state, id)
  );

  if (!audioModule) throw Error(`Audio module with ${id} not found`);

  return audioModule;
};

export function useGridNodes() {
  const dispatch = useAppDispatch();
  const { nodes, edges } = useAppSelector((state) => state.gridNodes);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => dispatch(_onNodesChange(changes)),
    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => dispatch(_onEdgesChange(changes)),
    [dispatch]
  );

  const onConnect = useCallback(
    (connection: Connection) => dispatch(_onConnect(connection)),
    [dispatch]
  );

  const addNode = useCallback(
    (node: Node) => dispatch(_addNode(node)),
    [dispatch]
  );

  return { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect };
}
