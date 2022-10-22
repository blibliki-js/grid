import Engine, { Note } from "@blibliki/engine";

import { useEffect } from "react";

const MAP_KEYS: { [key: string]: Note } = {
  a: new Note("C3"),
  s: new Note("D3"),
  d: new Note("E3"),
  f: new Note("F3"),
  g: new Note("G3"),
  h: new Note("A3"),
  j: new Note("B3"),
  k: new Note("C4"),
  l: new Note("D4"),
  w: new Note("C#3"),
  e: new Note("D#3"),
  t: new Note("F#3"),
  y: new Note("G#3"),
  u: new Note("A#3"),
  o: new Note("C#4"),
  p: new Note("D#4"),
};

const onKeyTrigger = (id: string, type: string) => (event: KeyboardEvent) => {
  const note = MAP_KEYS[event.key];
  if (!note) return;

  Engine.triggerVirtualMidi(id, note.fullName, type);
};

export default function ComputerMidiKeyboard(props: { id: string }) {
  const { id } = props;
  const onKeyDown = onKeyTrigger(id, "noteOn");
  const onKeyUp = onKeyTrigger(id, "noteOff");

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [id]);

  return null;
}
