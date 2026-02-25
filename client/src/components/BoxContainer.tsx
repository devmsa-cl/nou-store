import React from "react";
import cn from "../utils/cn";
type BoxContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};

export const BoxContainer: React.FC<BoxContainerProps> = ({
  children,
  className,
  ...props
}: BoxContainerProps) => {
  return (
    <div
      {...props}
      className={cn(
        "cart-container bg-white p-8 rounded-md",
        className ? className : ""
      )}
    >
      {children}
    </div>
  );
};
interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}
export const BoxHeadingText = ({ children, className }: Props) => {
  return (
    <h2 className={cn("text-2xl leading-relaxed", className ? className : "")}>
      {children}
    </h2>
  );
};
export const BoxSubText = ({ children }: Props) => {
  return <p className="text-zinc-800">{children}</p>;
};
