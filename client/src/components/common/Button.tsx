import React from "react";
import { VscLoading } from "react-icons/vsc";
import cn from "../../utils/cn";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}
export default function Button({ children, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        "btn py-2 px-4 bg-primary text-orange-900  hover:text-white transition-all rounded-lg text-bold tracking-wider text-center cursor-pointer text-sm",
        className ? className : "",
      )}
    >
      {children}
    </button>
  );
}

export function ButtonWithLoadingIcon({
  children,
  className,
  isLoading,
  loadingLabel,
  ...props
}: Props & { isLoading?: boolean; loadingLabel?: string }) {
  return (
    <button
      {...props}
      className={cn(
        "btn py-2 px-4 bg-primary text-orange-900  hover:text-white transition-all rounded-lg text-bold tracking-wider text-center cursor-pointer text-sm",
        className ? className : "",
        isLoading ? "text-white " : "",
      )}
      disabled={isLoading}
    >
      <div className="flex items-center gap-2">
        {isLoading && <VscLoading className="animate-spin" />}
        {isLoading ? (loadingLabel ? loadingLabel : "Loading...") : children}
      </div>
    </button>
  );
}
