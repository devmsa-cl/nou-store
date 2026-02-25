type Props = {
  children: React.ReactNode;
};
export const HeadingText = ({ children }: Props) => {
  return (
    <div className="heading-text relative block">
      <h2 className="text-4xl font-bold text-primary">{children}</h2>
    </div>
  );
};
