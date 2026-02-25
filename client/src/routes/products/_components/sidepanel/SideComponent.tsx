type Props = {
  children: React.ReactNode;
};
export const SideHeadingText = ({ children }: Props) => {
  return <h2 className="text-lg font-bold text-zinc-700">{children}</h2>;
};
export const SideBox = ({ children }: Props) => {
  return <div className="side-box bg-white p-4 rounded-md">{children}</div>;
};
