import cn from "../../utils/cn";
interface Props {
  variant?: "primary" | "secondary" | "ghost";
}
export const Avatar = ({ variant }: Props) => {
  let ringColor = "ring-rose-600";
  if (variant === "primary") {
    ringColor = "ring-rose-600";
  } else if (variant === "secondary") {
    ringColor = "ring-sky-600";
  } else if (variant === "ghost") {
    ringColor = "ring-slate-600";
  }
  return (
    <div className="avatar">
      <img
        width={40}
        height={40}
        src="/user-avatar.png"
        alt="user avatar"
        className={cn(
          "rounded-full aspect-square object-cover ring-2 ring-offset-2",
          ringColor,
        )}
      />
    </div>
  );
};
