import { DragEvent, MouseEvent, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { addNewModule } from "../AudioModule/modulesSlice";
import { useAppDispatch } from "@/hooks";
import { Node, XYPosition, useReactFlow } from "reactflow";
import { addNode, updateNode } from "./gridNodesSlice";
import { getNodePositionInsideParent } from "./utils";

function onDragStart(event: DragEvent, nodeType: string) {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

export default function useDrag() {
  const dispatch = useAppDispatch();
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const extraProps: {
        position: XYPosition;
        parentNode?: string;
        expandParent?: boolean;
        style?: object;
      } = { position: { x: 0, y: 0 } };

      const type = event.dataTransfer.getData("application/reactflow");
      extraProps.position = screenToFlowPosition({
        x: event.clientX - 20,
        y: event.clientY - 20,
      });

      const groupNode = getIntersectingNodes({
        x: extraProps.position.x,
        y: extraProps.position.y,
        width: 40,
        height: 40,
      }).find((n) => n.type === "groupNode");

      if (groupNode) {
        // if we drop a node on a group node, we want to position the node inside the group
        extraProps.position = getNodePositionInsideParent(
          {
            position: extraProps.position,
            width: 40,
            height: 40,
          },
          groupNode,
        ) ?? { x: 0, y: 0 };
        extraProps.parentNode = groupNode?.id;
        extraProps.expandParent = true;
      }

      if (type === "groupNode") {
        extraProps.style = { width: 400, height: 200 };
        dispatch(addNode({ id: uuidv4(), type, data: {}, ...extraProps }));
      } else {
        dispatch(addNewModule({ type, ...extraProps }));
      }
    },
    [dispatch, getIntersectingNodes, screenToFlowPosition],
  );

  const onNodeDragStop = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.type !== "audioNode" && !node.parentNode) {
        return;
      }

      const groupNode = getIntersectingNodes(node).find(
        (n) => n.type === "groupNode",
      );

      // when there is an intersection on drag stop, we want to attach the node to its new parent
      if (!groupNode || node.parentNode === groupNode.id) return;

      const position = getNodePositionInsideParent(
        { ...node, position: { ...node.position } },
        groupNode,
      );

      const updatedNode = {
        ...node,
        position,
        parentNode: groupNode.id,
        expandParent: true,
      } as Node;

      dispatch(updateNode(updatedNode));
    },
    [getIntersectingNodes, dispatch],
  );

  return { onDragStart, onDrop, onNodeDragStop, onDragOver };
}
