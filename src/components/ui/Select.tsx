import { ChangeEvent, useMemo } from "react";

type TOption = string[] | number[] | TDefOption[] | TIDOption[];

type TDefOption = { name: string; value: string | number };
type TIDOption = { id: string; name: string };

interface SelectProps {
  value: string | number;
  options: TOption;
  label?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const defaultClassName =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export default function Select(props: SelectProps) {
  const { value, options, label, onChange, className = "" } = props;

  const opts: TDefOption[] = useMemo(() => {
    if (!options.length) return options as TDefOption[];

    if (options[0] instanceof Object) {
      if ("value" in options[0]) return options as TDefOption[];

      return (options as TIDOption[]).map((opt) => ({
        name: opt.name,
        value: opt.id,
      }));
    } else {
      return (options as string[]).map((opt) => ({
        name: opt.toString(),
        value: opt.toString(),
      }));
    }
  }, [options]);

  return (
    <div className="flex flex-col">
      <Label label={label} />
      <select
        className={`${defaultClassName} ${className}`}
        value={value}
        onChange={onChange}
      >
        {opts.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Label({ label }: { label?: string }) {
  if (!label) return null;

  return (
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {label}
    </label>
  );
}
