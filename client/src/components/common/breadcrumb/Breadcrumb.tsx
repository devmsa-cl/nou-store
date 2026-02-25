type Props = {
  title: string;
  sub?: string;
};
export const Breadcrumb = ({ title, sub }: Props) => {
  return (
    <div className="page-breadcrumbs bg-primary h-40">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl text-zinc-100">{title}</h1>
        {sub && <p className="text-white">{sub}</p>}
      </div>
    </div>
  );
};
