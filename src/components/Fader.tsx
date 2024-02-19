import { Slider } from "./ui";
import { throttle } from "lodash";

export interface MarkProps {
  value: number;
  label: string;
}

interface FaderProps {
  name: string;
  onChange(value: number, calculatedValue: number): void;
  defaultValue?: number;
  value?: number;
  marks?: MarkProps[];
  max?: number;
  min?: number;
  step?: number;
  exp?: number;
}

const calcValue = function (
  value: number,
  min: number,
  max: number,
  exp?: number,
) {
  if (!value || !exp) return value;

  const range = max - min;
  const coeff = Math.pow((value - min) / range, exp);

  return min + coeff * range;
};

const revCalcValue = function (
  value: number,
  min: number,
  max: number,
  exp?: number,
) {
  if (!value || !exp) return value;

  const range = max - min;
  return Math.round(Math.pow((value - min) / range, 1 / exp) * range + min);
};

export default function Fader(props: FaderProps) {
  const { name, onChange, value, defaultValue, marks, exp, min = 0 } = props;

  let { max, step } = props;

  if (marks) {
    step ??= 1;
  }

  if (max === undefined) {
    max = marks ? marks.length - 1 : 1;
  }

  const revValue = value && revCalcValue(value, min, max, exp);

  const internalOnChange = (newValue: number) => {
    onChange(newValue, calcValue(newValue, min, max || 1, exp));
  };
  const debouncedOnChange = throttle(internalOnChange, 500);

  return (
    <div className="flex flex-col justify-center items-center">
      <Slider
        orientation="vertical"
        onChange={debouncedOnChange}
        value={revValue}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step || 0.01}
        marks={marks}
      />
      <div className="text-gray-900 dark:text-white">{name}</div>
    </div>
  );
}
