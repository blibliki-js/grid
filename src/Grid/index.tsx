import styled from "@emotion/styled";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow";

import { NodeTypes } from "./AudioNode";
import { useGridNodes } from "hooks";

const Root = styled.div`
  padding: 5px;
  width: calc(100vw -10px);
  height: calc(100vh - 130px);
`;

export default function Grid() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useGridNodes();

  return (
    <Root>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </Root>
  );
}
