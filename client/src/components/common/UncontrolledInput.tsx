import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}
export default function UncontrolledInput({ name, label, ...props }: Props) {
  return (
    <div className="input-group flex flex-col gap-1">
      <label className="uppercase text-xs text-zinc-500" htmlFor={name + label}>
        {label}
      </label>
      <input
        {...props}
        id={name + label}
        type="text"
        className="w-full border-[1.5px] transition-all outline-none py-2 px-2 focus:border-primary rounded-md placeholder:italic  text-sm"
        name={name}
      />
    </div>
  );
}
