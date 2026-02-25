import React from "react";
interface Props extends React.InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: string[];
}
export default function UncontrolledSelect({
  name,
  label,
  options,
  ...props
}: Props) {
  return (
    <div className="input-group flex flex-col  gap-1">
      <label className="text-xs text-zinc-600 capitalize" id={name + label}>
        {label}
      </label>
      <select
        name={name}
        id={name + label}
        className="w-32 border-[1.5px] transition-all outline-none py-2 px-2 focus:border-primary rounded-md placeholder:italic  text-sm"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
