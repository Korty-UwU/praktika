import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold hover:text-gray-300 transition">
          SramWay
          </Link>
          <div className="space-x-4">
            <Link 
              href="/warehouses" 
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition font-medium"
            >
              Склады
            </Link>
            <Link 
              href="/equipment" 
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition font-medium"
            >
              Оборудование
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}