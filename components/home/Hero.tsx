import * as React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import HeroCarousel from './HeroCarousel';

function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div>
        <h1 className="max-w-2xl font-bold text-4xl tracking-tight sm:text-6xl">
          Shoppping has to be the best experience ever
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
          Shop with confidence, security and dignity.
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/products">our products</Link>
        </Button>
      </div>
      <HeroCarousel />
    </section>
  );
}
export default Hero;
