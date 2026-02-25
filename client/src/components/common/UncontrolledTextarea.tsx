import React from "react";
import cn from "../../utils/cn";
interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  className?: string;
}
export default function UncontrolledTextarea({
  name,
  label,
  className,
  ...props
}: Props) {
  return (
    <div className="input-group flex flex-col gap-1">
      <label className="uppercase text-xs text-zinc-500" htmlFor={name + label}>
        {label}
      </label>
      <textarea
        {...props}
        id={name + label}
        className={cn(
          "w-full border-[1.5px] transition-all outline-none py-2 px-2 focus:border-primary rounded-md placeholder:italic  text-sm",
          className ? className : ""
        )}
        name={name}
      />
    </div>
  );
}
