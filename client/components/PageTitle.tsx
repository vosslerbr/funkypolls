export default function PageTitle({ title }: { title: string }) {
  return (
    <div className="p-6 bg-gradient-to-r from-violet-700 to-purple-500 rounded-lg shadow">
      <h2 className="text-4xl font-bold text-gray-50">{title}</h2>
    </div>
  );
}
