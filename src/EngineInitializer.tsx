import { useEffect, useState } from "react";
import Engine from "@blibliki/engine";
import { addMaster } from "components/AudioModule/modulesSlice";
import { useAppDispatch } from "hooks";
import { loadPatch, getInitialMasterId } from "store/localStorege";

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

    const { master } = Engine.initialize({
      context: {
        latencyHint: "interactive",
        lookAhead: 0.01,
      },
    });

    dispatch(
      addMaster({ ...master, initialId: getInitialMasterId(), layoutId: "" })
    );
    loadPatch();

    return () => {
      Engine.dispose();
    };
  }, [enabled]);

  return null;
}
