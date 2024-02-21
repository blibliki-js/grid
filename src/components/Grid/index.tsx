import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow";

import { NodeTypes } from "./AudioNode";
import { useGridNodes } from "@/hooks";

const DEFAULT_REACT_FLOW_PROPS = {
  hideAttribution: true,
};

export default function Grid() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useGridNodes();

  return (
    <div className="grid-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeTypes}
        proOptions={DEFAULT_REACT_FLOW_PROPS}
      >
        <Controls />
        <MiniMap />
        <Background
          className="dark:bg-gray-700"
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
      </ReactFlow>
    </div>
  );
}
