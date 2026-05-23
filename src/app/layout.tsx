// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/hooks/useCart'; // <-- Import your cart wrapper
import MiniCart from '@/components/customer/MiniCart';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NovaMarket | Premium General Merchandise',
  description: 'Shop home decor, tech accessories, and fitness gear.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <MiniCart />
        </CartProvider>
      </body>
    </html>
  );
}
