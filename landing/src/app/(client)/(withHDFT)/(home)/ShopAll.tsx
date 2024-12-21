import { Button } from '@/components/ui/button';
import React from 'react';
import { Balancer } from 'react-wrap-balancer';

function ShopAll() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:py-28"
    >
      <h1 className="px-1 text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
        OPENING A NEW ERA
      </h1>
      <Balancer className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
        A new era is not an end - it is an evolution. Join us in the next
        chapter with heritage Jordan items in futuristic fashion style.
      </Balancer>
      <Button>Shop Now</Button>
    </section>
  );
}

export default ShopAll;
