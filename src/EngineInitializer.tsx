import Engine from "@blibliki/engine";
import { addMaster } from "components/AudioModule/modulesSlice";
import { useAppDispatch } from "hooks";
import { useEffect, useState } from "react";

export default function EngineInitializer() {
  const dispatch = useAppDispatch();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const { master } = Engine.initialize({
      context: {
        latencyHint: "interactive",
        lookAhead: 0.01,
      },
    });
    dispatch(addMaster({ ...master, layoutId: "" }));

    return () => {
      Engine.dispose();
    };
  }, [enabled]);

  if (!enabled) return <button onClick={() => setEnabled(true)}>Start</button>;

  return null;
}
