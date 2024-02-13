import { IOProps } from "@blibliki/engine";
import AudioModule from "components/AudioModule";
import Name from "components/AudioModule/attributes/Name";
import { useAudioModule } from "hooks";
import { ReactNode, useMemo } from "react";
import { Handle, HandleType, NodeProps, Position } from "reactflow";

export const NodeTypes = {
  audioNode: AudioNode,
};

export default function AudioNode(props: NodeProps) {
  const { id: gridNodeId } = props;
  const { inputs, outputs, ...audioModuleProps } = useAudioModule(gridNodeId);

  return (
    <div className="flex gap-3 items-stretch shadow-md rounded-md bg-white dark:bg-gray-800 border-2 border-stone-400">
      <IOContainer>
        {inputs.map((io) => (
          <IO key={io.id} io={io} />
        ))}
      </IOContainer>

      <div className="py-2">
        <AudioModule audioModule={audioModuleProps} />
      </div>

      <IOContainer>
        {outputs.map((io) => (
          <IO key={io.id} io={io} />
        ))}
      </IOContainer>
    </div>
  );
}

function IO({ io }: { io: IOProps }) {
  const handleProps = useMemo(() => {
    const position = io.ioType.includes("Input")
      ? Position.Left
      : Position.Right;
    const type: HandleType = io.ioType.includes("Input") ? "target" : "source";
    const className = io.ioType.includes("Input")
      ? "-left-[6px]"
      : "-right-[6px]";

    return { type, position, className };
  }, [io.ioType]);

  return (
    <div className="relative">
      <div className="px-2">{io.name}</div>
      <Handle
        id={io.id}
        type={handleProps.type}
        position={handleProps.position}
        className={`${handleProps.className} block rounded w-auto h-6 text-white text-xs -bottom-5 p-1`}
      />
    </div>
  );
}

function IOContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 justify-center bg-gray-100 dark:bg-gray-700">
      {children}
    </div>
  );
}
