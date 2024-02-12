import AudioModule from "components/AudioModule";
import Name from "components/AudioModule/attributes/Name";
import { useAudioModule } from "hooks";
import { Handle, NodeProps, Position } from "reactflow";

export const NodeTypes = {
  audioNode: AudioNode,
};

export default function AudioNode(props: NodeProps) {
  const { id: gridNodeId } = props;
  const audioModuleProps = useAudioModule(gridNodeId);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white dark:bg-gray-800 border-2 border-stone-400">
      <Name id={audioModuleProps.id} value={audioModuleProps.name} />

      <AudioModule audioModule={audioModuleProps} />

      <div className="p-2">
        <IO />
      </div>
    </div>
  );
}

function IO() {
  return (
    <div>
      <div>Midi in</div>
      <Handle
        type="source"
        position={Position.Right}
        className="block rounded w-auto h-6 text-white text-xs -bottom-5 p-1"
      />
    </div>
  );
}
