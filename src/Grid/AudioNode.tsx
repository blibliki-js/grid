import AudioModule from "components/AudioModule";
import { useAudioModule } from "hooks";
import { NodeProps } from "reactflow";

export const NodeTypes = {
  audioNode: AudioNode,
};

export default function AudioNode(props: NodeProps) {
  const { id } = props;
  const audioModuleProps = useAudioModule(id);

  return <AudioModule audioModule={audioModuleProps} />;
}
