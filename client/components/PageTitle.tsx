export default function PageTitle({ title }: { title: string }) {
  return (
    <div className="mb-8 pb-6 border-b-2 border-slate-200 text-slate-700 ">
      <h2 className="sm:text-4xl text-3xl font-bold ">{title}</h2>
    </div>
  );
}
