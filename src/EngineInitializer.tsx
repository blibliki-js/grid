import { useEffect, useState } from "react";
import { useAppDispatch } from "hooks";
import { initialize, dispose } from "./globalSlice";
import { open, close } from "./components/Modal/modalSlice";

export default function EngineInitializer() {
  const dispatch = useAppDispatch();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;

    setEnabled(true);
    dispatch(initialize());
    dispatch(open("patch"));

    return () => {
      dispatch(dispose());
    };
  }, [dispatch, enabled]);

  return null;
}
