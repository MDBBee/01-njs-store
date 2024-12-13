import type { Metadata } from 'next';
import { Inter, Inconsolata, Fjalla_One, Comfortaa } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Container from '@/components/global/Container';
import Providers from './providers';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });
const inconsolata = Inconsolata({ subsets: ['latin'], weight: '400' });
const fjalla_One = Fjalla_One({ subsets: ['latin'], weight: '400' });
const comfortaa = Comfortaa({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Digi-Store njs',
  description: 'An online-store built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={comfortaa.className}>
          <Providers>
            <Navbar />
            <Container className="py-20">{children}</Container>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
