import { ChangeEvent } from "react";

interface InputProps {
  value: string | number;
  type?: "text" | "number";
  label?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const defaultClassName =
  "nodrag bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export default function InputText(props: InputProps) {
  const { value, onChange, label, type = "text", className = "" } = props;

  return (
    <div className="relative">
      <Label text={label} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`${defaultClassName} ${className}`}
      />
    </div>
  );
}

function Label({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {text}
    </label>
  );
}
