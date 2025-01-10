'use client';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { CommonSvg } from '@/assets/CommonSvg';
import Link from 'next/link';
import AuthSvg from '@/assets/AuthSvg';
import { signOut } from 'next-auth/react';

const sidebarNavItems = [
  {
    title: 'Account',
    href: 'user/profile',
    icon: 'user',
    items: [],
  },
  {
    title: 'Orders',
    href: 'user/profile/orders',
    icon: 'store',
    items: [],
  },
];
const mainNavItems = [
  {
    title: 'Shirt',
    items: [
      {
        title: 'Hoodie',
        href: '/products?categoryIds=de3b7ec3-5d4d-4a74-b772-1a32b3fe8b64',
        description: 'All the products we have to offer.',
        items: [],
      },
      {
        title: 'Polo',
        href: '/products?categoryIds=1ba3ff22-f0e4-4a69-9f56-f55fa9deeae8',
        description: 'Build your own custom skateboard.',
        items: [],
      },
      {
        title: 'Shirt',
        href: '/products?categoryIds=832c6153-0a8b-463b-b868-0c6666647ced',
        description: 'Read our latest blog posts.',
        items: [],
      },
    ],
  },
  {
    title: 'Trouser',
    items: [
      {
        title: 'Jeans',
        href: '/products?categoryIds=eab1fd95-1fd0-4076-9e4f-939743f1f9b1',
        description: 'All the products we have to offer.',
        items: [],
      },
      {
        title: 'Tall',
        href: '/products?categoryIds=181ae735-fea6-4d5c-aca1-24265090d7f2',
        description: 'Build your own custom skateboard.',
        items: [],
      },
      {
        title: 'Short',
        href: '/products?categoryIds=299099c6-223f-43dd-aeda-f3433494ad72',
        description: 'Read our latest blog posts.',
        items: [],
      },
    ],
  },
];
export function MobileNav({ session }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent
           focus-visible:bg-transparent focus-visible:ring-0 
           focus-visible:ring-offset-0 lg:hidden"
        >
          {CommonSvg.menuBurger()}
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Link
            aria-label="Home"
            href="/"
            className="flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-bold">
              {session?.user ? `Hi, ${session?.user.name}` : 'Hi'}
            </span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            <Accordion type="single" collapsible className="w-full">
              {mainNavItems?.map((item, index) => (
                <AccordionItem value={item.title} key={index}>
                  <AccordionTrigger className="text-sm capitalize">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {item.items?.map((subItem, index) =>
                        subItem.href ? (
                          <MobileLink
                            key={index}
                            href={String(subItem.href)}
                            pathname={pathname}
                            setIsOpen={setIsOpen}
                          >
                            {subItem.title}
                          </MobileLink>
                        ) : (
                          <div
                            key={index}
                            className="text-foreground/70 transition-colors"
                          >
                            {item.title}
                          </div>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
              <AccordionItem value="sidebar">
                <AccordionTrigger className="text-sm">
                  Sidebar Menu
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    {sidebarNavItems?.map((item, index) =>
                      item.href ? (
                        <MobileLink
                          key={index}
                          href={String(item.href)}
                          pathname={pathname}
                          setIsOpen={setIsOpen}
                        >
                          {item.title}
                        </MobileLink>
                      ) : (
                        <div
                          key={index}
                          className="text-foreground/70 transition-colors"
                        >
                          {item.title}
                        </div>
                      )
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button
              onClick={() => {
                localStorage.removeItem('accessToken');
                signOut({ callbackUrl: '/auth/login' });
              }}
              className="border-solid border-t-2 mt-2  gap-2"
            >
              <div className="">{AuthSvg.signIn()}</div>
              Logout
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps {
  children?: React.ReactNode;
  href: string;
  disabled?: boolean;
  pathname: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileLink({
  children,
  href,
  disabled,
  pathname,
  setIsOpen,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-foreground/70 transition-colors hover:text-foreground',
        pathname === href && 'text-foreground',
        disabled && 'pointer-events-none opacity-60'
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );
}
