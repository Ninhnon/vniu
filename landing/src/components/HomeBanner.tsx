'use client';
import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/legacy/image';

function HomeBanner() {
  return (
    <div className="relative text-white text-[20px] w-full lg:px-10 mx-auto">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={true}
        showThumbs={false}
        showStatus={false}
      >
        <div className="h-[300px] lg:h-[700px] w-full">
          <Image
            src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1423,c_limit/b3e44fd7-df8f-449a-a2c7-48bb948518ab/men-s-shoes-clothing-accessories.png"
            alt="Auth background"
            layout="fill"
            objectFit="cover"
            priority
            quality={100}
          />
          <div className="absolute bottom-20 z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;I can accept failure, but I can't accept not
                trying.&rdquo;
              </p>
              <footer className="text-sm">Sanya Richards-Ross</footer>
            </blockquote>
          </div>
          <div className="absolute inset-0 bg-black opacity-10" />
        </div>
        <div>
          <Image
            src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1423,c_limit/481ae448-c295-48cb-b593-fbb80821d102/jordan.png"
            alt="Auth background"
            layout="fill"
            objectFit="cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black opacity-10" />
          <div className="absolute bottom-20 z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Don't be afraid of failure. This is the way to
                succeed.&rdquo;
              </p>
              <footer className="text-sm">LeBron James</footer>
            </blockquote>
          </div>
        </div>
        <div>
          <Image
            src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1423,c_limit/f9e3a04d-c620-45c5-802e-1094a20c6cd9/jordan.png"
            alt="Auth background"
            layout="fill"
            objectFit="cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black opacity-10" />
          <div className="absolute bottom-20 z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Sports is a part of life, and we should live our lives
                like a race with perseverance and effort.&rdquo;
              </p>
              <footer className="text-sm">Jesse Owens</footer>
            </blockquote>
          </div>
        </div>
      </Carousel>
    </div>
  );
}

export default HomeBanner;
