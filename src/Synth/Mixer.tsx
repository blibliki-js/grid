import { useAppSelector } from "hooks";
import AudioModule from "components/audio_modules";
import { selectModulesByType } from "components/audio_modules/modulesSlice";

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
