import { useAppSelector } from "hooks";
import AudioModule from "components/AudioModule";
import { selectModulesByType } from "components/AudioModule/modulesSlice";

export default function Mixer() {
  const oscillators = useAppSelector((state) =>
    selectModulesByType(state, "oscillator")
  );

  return (
    <div>
      {oscillators.map((osc) => (
        <AudioModule key={osc.code} module={osc} componentType="volume" />
      ))}
    </div>
  );
}
