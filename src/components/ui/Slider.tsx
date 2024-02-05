import { ChangeEvent, useMemo } from "react";

interface SliderProps {
  min: number;
  max: number;
  value?: number;
  defaultValue?: number;
  step?: number;
  marks?: MarkProps[];
  orientation?: TOrientation;
  onChange: (newValue: number) => void;
}

type TOrientation = "vertical" | "horizontal";

interface MarkProps {
  value: number;
  label: string;
}

export default function Slider(props: SliderProps) {
  const {
    min,
    max,
    value,
    defaultValue,
    marks,
    onChange,
    step = 0.01,
    orientation = "horizontal",
  } = props;

  const wrapperClassName = useMemo(() => {
    const rules = ["flex", "gap-x-2", "nodrag"];

    if (orientation === "horizontal") rules.push("flex-col");

    return rules.join(" ");
  }, [orientation]);

  const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className={wrapperClassName}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        step={step}
        className="bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        onChange={_onChange}
        style={{
          writingMode:
            orientation === "vertical" ? "vertical-lr" : "horizontal-tb",
        }}
      />

      <Labels marks={marks} orientation={orientation} onClick={onChange} />
    </div>
  );
}

function Labels({
  orientation,
  onClick,
  marks,
}: {
  orientation: TOrientation;
  onClick: (newValue: number) => void;
  marks?: MarkProps[];
}) {
  if (!marks) return null;

  const labelDirection = orientation === "vertical" ? "flex-col-reverse" : "";
  const justify = marks.length === 1 ? "justify-center" : "justify-between";

  const _onClick = (value: number) => () => {
    onClick(value);
  };

  return (
    <div className={`flex ${labelDirection} ${justify}`}>
      {marks.map((mark, index) => (
        <button key={index} className="text-xs" onClick={_onClick(mark.value)}>
          {mark.label}
        </button>
      ))}
    </div>
  );
}
