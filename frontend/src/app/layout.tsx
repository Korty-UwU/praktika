import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'Учёт оборудования',
  description: 'Система учёта оборудования и складов',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}