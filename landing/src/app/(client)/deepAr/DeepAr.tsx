'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as deepar from 'deepar';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const listEffects = [
  // {
  //   path: 'effects/glasses-none.bin',
  //   name: 'Naked',
  //   price: 0,
  //   brand: '',
  //   color: '',
  //   gender: '',
  //   sku: '',
  //   material: '',
  // },
  {
    path: 'effects/tom-ford-FT1060-30f.deepar',
    name: 'Tom Ford Xavier Gold',
    image: '/images/tom-ford-FT1060_30F_64MM_B.jpeg',
    price: 495,
    brand: 'Tom Ford',
    color: 'Gold',
    gender: 'Unisex',
    sku: 'FT1060-30F',
    material: 'Metal',
  },
  {
    path: 'effects/tom-ford-FT1058.deepar',
    name: 'Tom Ford Alejandro Black',
    image: '/images/tom-ford-alejandro.webp',
    price: 475,
    brand: 'Tom Ford',
    color: 'Black',
    gender: 'Men',
    sku: 'FT1058',
    material: 'Acetate',
  },
  {
    path: 'effects/tom-ford-FT0009P.deepar',
    name: 'Tom Ford Whitney',
    image: '/images/tom-ford-whitney.webp',
    price: 445,
    brand: 'Tom Ford',
    color: 'Dark Havana',
    gender: 'Women',
    sku: 'FT0009P',
    material: 'Acetate',
  },
  {
    path: 'effects/tom-ford-kyler-FT1043.deepar',
    name: 'Tom Ford Kyler Black',
    image: '/images/tom-ford-kyler.jpeg',
    price: 485,
    brand: 'Tom Ford',
    color: 'Black/Gold',
    gender: 'Men',
    sku: 'FT1043',
    material: 'Metal/Acetate',
  },
  {
    path: 'effects/jimmy-choo-MEGSS51E807.deepar',
    name: 'Jimmy Choo Megs Brown',
    image: '/images/jimmy-choo-megs.webp',
    price: 395,
    brand: 'Jimmy Choo',
    color: 'Brown/Gold',
    gender: 'Women',
    sku: 'MEGSS51E807',
    material: 'Metal',
  },
  {
    path: 'effects/jimmy-choo-LUCINES55EDXL.deepar',
    name: 'Jimmy Choo Lucine Gold',
    image: '/images/jimmy-choo-lucine.webp',
    price: 425,
    brand: 'Jimmy Choo',
    color: 'Rose Gold',
    gender: 'Women',
    sku: 'LUCINES55EDXL',
    material: 'Metal',
  },
  {
    path: 'effects/jimmy-choo-auri.deepar',
    name: 'Jimmy Choo Auri Gold',
    image: '/images/jimmy-choo-auri.webp',
    price: 385,
    brand: 'Jimmy Choo',
    color: 'Black/Gold',
    gender: 'Women',
    sku: 'AURI-55',
    material: 'Metal/Acetate',
  },
  {
    path: 'effects/jimmy-choo-JC124.deepar',
    name: 'Jimmy Choo JC 12456',
    image: '/images/jimmy-choo-jc-124.webp',
    price: 375,
    brand: 'Jimmy Choo',
    color: 'Gold',
    gender: 'Women',
    sku: 'JC124',
    material: 'Metal',
  },
  {
    path: 'effects/prada-PR14Z_E1AB_FE09S_C_050.deepar',
    name: 'Prada Symbole - Black',
    image: '/images/prada-symbole-black.jpg',
    price: 465,
    brand: 'Prada',
    color: 'Black',
    gender: 'Unisex',
    sku: 'PR14Z-E1AB',
    material: 'Metal/Acetate',
  },
  {
    path: 'effects/prada-PR14Z_E19D_FE01T_C_050.deepar',
    name: 'Prada Symbole - Marbleized Black and Yellow',
    image: '/images/prada-symbole-black-yellow.jpg',
    price: 485,
    brand: 'Prada',
    color: 'Black/Yellow',
    gender: 'Unisex',
    sku: 'PR14Z-E19D',
    material: 'Acetate',
  },
  {
    path: 'effects/prada-PR14Z_E142_F05S0_C_050.deepar',
    name: 'Prada Symbole - Chalk White',
    image: '/images/prada-symbole-white.jpg',
    price: 465,
    brand: 'Prada',
    color: 'White',
    gender: 'Unisex',
    sku: 'PR14Z-E142',
    material: 'Acetate',
  },
  {
    path: 'effects/prada-SPR26Z_E12L_FE08Z_C_055.deepar',
    name: 'Prada Symbole, Oval - Orange',
    image: '/images/prada-symbole-oval-orange.jpg',
    price: 445,
    brand: 'Prada',
    color: 'Orange',
    gender: 'Unisex',
    sku: 'SPR26Z-E12L',
    material: 'Acetate',
  },
  {
    path: 'effects/prada-SPR26Z_E16K_FE08Z_C_055.deepar',
    name: 'Prada Symbole, Oval - Black',
    image: '/images/prada-symbole-oval-black.jpg',
    price: 445,
    brand: 'Prada',
    color: 'Black',
    gender: 'Unisex',
    sku: 'SPR26Z-E16K',
    material: 'Acetate',
  },
  {
    path: 'effects/prada-SPR26Z_E17K_FE08Z_C_055.deepar',
    name: 'Prada Symbole, Oval - Chalk White',
    image: '/images/prada-symbole-oval-white.jpg',
    price: 445,
    brand: 'Prada',
    color: 'White',
    gender: 'Unisex',
    sku: 'SPR26Z-E17K',
    material: 'Acetate',
  },
  {
    path: 'effects/ralph-lauren-RL8188Q_Tortoise.deepar',
    name: 'Ralph Lauren Stirrup Antibes Dark Havana',
    image: '/images/stirrup-antibes.png',
    price: 325,
    brand: 'Ralph Lauren',
    color: 'Dark Havana',
    gender: 'Unisex',
    sku: 'RL8188Q',
    material: 'Acetate',
  },
  {
    path: 'effects/ralph-lauren-RL8190Q_Tortoise.deepar',
    name: 'Ralph Lauren Stirrup Ricky Dark Havana',
    image: '/images/stirrup-ricky.png',
    price: 345,
    brand: 'Ralph Lauren',
    color: 'Dark Havana',
    gender: 'Unisex',
    sku: 'RL8190Q',
    material: 'Acetate',
  },
  {
    path: 'effects/ralph-lauren-RL8189Q_Tortoise.deepar',
    name: 'Ralph Lauren Stirrup Shield Dark Havana',
    image: '/images/stirrup-shield.png',
    price: 335,
    brand: 'Ralph Lauren',
    color: 'Dark Havana',
    gender: 'Unisex',
    sku: 'RL8189Q',
    material: 'Acetate',
  },
  {
    path: 'effects/Rb1971V2943.deepar',
    name: 'Ray Ban 1971/V 2943',
    image: '/images/ray-ban_1971_v_2943.jpeg',
    price: 225,
    brand: 'Ray-Ban',
    color: 'Gold',
    gender: 'Unisex',
    sku: 'RB1971V-2943',
    material: 'Metal',
  },
  {
    path: 'effects/RB8125M9165.deepar',
    name: 'Ray Ban Aviator Titanium',
    image: '/images/ray-ban-aviator-titanium-silver.jpeg',
    price: 295,
    brand: 'Ray-Ban',
    color: 'Silver',
    gender: 'Unisex',
    sku: 'RB8125M-9165',
    material: 'Titanium',
  },
  {
    path: 'effects/ray-ban-Rb3580n043e4.deepar',
    name: 'Ray Ban Blaze Cat Eye',
    image: '/images/ray-ban-blaze-cat-eye.jpeg',
    price: 235,
    brand: 'Ray-Ban',
    color: 'Black/Gold',
    gender: 'Women',
    sku: 'RB3580N-043E4',
    material: 'Metal',
  },
  {
    path: 'effects/RadarEvPath.deepar',
    name: 'Oakley Radar EV Path',
    image: '/images/oakley-radar-ev.webp',
    price: 225,
    brand: 'Oakley',
    color: 'Black/Red',
    gender: 'Unisex',
    sku: 'OO9208',
    material: 'O Matter™',
  },
  {
    path: 'effects/oakley-sutro.deepar',
    name: 'Oakley Sutro Matte 1',
    image: '/images/oakley-sutro.webp',
    price: 195,
    brand: 'Oakley',
    color: 'Matte Black',
    gender: 'Unisex',
    sku: 'OO9406',
    material: 'O Matter™',
  },
];

const ProductCard = ({ product }) => {
  if (!product.price) return null; // Don't show card for "Naked" option

  return (
    <Card className="flex flex-row gap-8 fixed top-4 right-40 w-200 bg-white backdrop-blur-sm shadow-lg z-50 p-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-60 h-60 object-fill"
      />
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold">{product.name}</div>
        <div className="text-xl text-blue-600">${product.price}</div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Brand</span>
            <span className="font-medium">{product.brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Color</span>
            <span className="font-medium">{product.color}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Gender</span>
            <span className="font-medium">{product.gender}</span>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </Card>
  );
};

const DeepARComponent = ({ licenseKey }) => {
  const previewRef = useRef(null);
  const deepARInstanceRef = useRef(null);
  const isInitializingRef = useRef(false);
  const [currentEffect, setCurrentEffect] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDeepAR = async () => {
      if (isInitializingRef.current || deepARInstanceRef.current) return;
      isInitializingRef.current = true;

      try {
        const deepAR = await deepar.initialize({
          licenseKey,
          previewElement: document.getElementById('ar-screen'),
          effect: listEffects[0].path,
          rootPath: './deepar-resources',
        });

        deepARInstanceRef.current = deepAR;
        setIsLoading(false);
      } catch (error) {
        console.error('DeepAR initialization error:', error);
      } finally {
        isInitializingRef.current = false;
      }
    };

    initializeDeepAR();

    return () => {
      if (deepARInstanceRef.current) {
        deepARInstanceRef.current = null;
      }
    };
  }, [licenseKey]);

  const switchEffect = async (index) => {
    if (!deepARInstanceRef.current) return;

    try {
      setIsLoading(true);
      await deepARInstanceRef.current.switchEffect(listEffects[index].path);
      setCurrentEffect(index);
    } catch (error) {
      console.error('Error switching effect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    const newIndex =
      (currentEffect - 1 + listEffects.length) % listEffects.length;
    switchEffect(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentEffect + 1) % listEffects.length;
    switchEffect(newIndex);
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Fullscreen AR View */}
      <div
        id="ar-screen"
        ref={previewRef}
        className="absolute inset-0 w-full h-full bg-black"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {/* Product Information Card */}
      <ProductCard product={listEffects[currentEffect]} />

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-0 right-0 z-40">
        <div className="relative w-full mx-auto">
          {/* <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button> */}

          <div className="overflow-x-auto px-40">
            <div className="flex gap-4 py-4 justify-center mx-10">
              {listEffects.map((effect, index) => (
                <button
                  key={effect.path}
                  onClick={() => switchEffect(index)}
                  className={`flex-shrink-0 relative rounded-full overflow-hidden w-24 h-24 border-2 transition-all ${
                    currentEffect === index
                      ? 'border-blue-500 scale-110'
                      : 'border-transparent'
                  }`}
                >
                  {effect.image ? (
                    <img
                      src={effect.image}
                      alt={effect.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      {effect.name.charAt(0)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepARComponent;
