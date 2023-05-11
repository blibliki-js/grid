import { useEffect, useState } from "react";
import { useAppDispatch } from "hooks";
import { initialize, dispose } from "./globalSlice";

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

    dispatch(initialize());

    return () => {
      dispatch(dispose());
    };
  }, [dispatch, enabled]);

  return null;
}
