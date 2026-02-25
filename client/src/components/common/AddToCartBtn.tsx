import React from "react";
import { LiaCartPlusSolid } from "react-icons/lia";
import cn from "../../utils/cn";
interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
}
export default function AddToCartBtn({ className, disabled, ...props }: Props) {
  return (
    <button
      disabled={disabled}
      {...props}
      className={cn(
        "bg-primary p-2 rounded-2xl cursor-pointer",
        className ? className : "",
      )}
    >
      <LiaCartPlusSolid size={32} />
    </button>
  );
}
