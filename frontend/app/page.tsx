import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Система учёта оборудования</h1>
      <p className="text-gray-600">
        Управление складами и оборудованием
      </p>
      <div className="flex gap-4">
        <Link href="/warehouses" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Управление складами
        </Link>
        <Link href="/equipment" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Управление оборудованием
        </Link>
      </div>
    </div>
  );
}1