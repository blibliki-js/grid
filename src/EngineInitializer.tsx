import { useEffect, useState } from "react";
import Engine from "@blibliki/engine";
import { useAppDispatch } from "hooks";
import { updatePlainModule } from "components/AudioModule/modulesSlice";

export default function EngineInitializer() {
  const dispatch = useAppDispatch();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const setEnabledTrue = () => {
      document.body.removeEventListener("click", setEnabledTrue);
      setEnabled(true);
    };

    document.addEventListener("click", setEnabledTrue);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    Engine.initialize({
      context: {
        latencyHint: "interactive",
        lookAhead: 0.01,
      },
    });
    Engine.onPropsUpdate((id, props) => {
      dispatch(updatePlainModule({ id, changes: { props } }));
    });

    return () => {
      Engine.dispose();
    };
  }, [enabled]);

  return null;
}
