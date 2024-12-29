/* eslint-disable no-undef */
'use client';

import React, { useEffect, useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import './styles.css';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthSvg from '@/assets/AuthSvg';
import { MobileNav } from './MobileNavBar';
import { AiOutlineHeart } from 'react-icons/ai';
import { CartSheet } from '../CartSheet';
import { Badge } from '../ui/badge';
import Logo from '../logo';
import { useWishList } from '@/hooks/useWishList';
import { Camera, Upload, X } from 'lucide-react';

const NavigationMenuDemo = ({ session }) => {
  const [user] = useState(session?.user);
  const [show, setShow] = useState('translate-y-0');
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  });
  const controlNavbar = () => {
    if (window.scrollY > 100) {
      if (window.scrollY > lastScrollY) {
        setShow('-translate-y-[82px]');
      } else {
        setShow('shadow-sm');
      }
    } else {
      setShow('translate-y-0');
    }
    setLastScrollY(window.scrollY);
  };

  const { wishList } = useWishList();
  const [wishListCount, setWishListCount] = useState(0);
  useEffect(() => {
    setWishListCount(wishList?.length);
  }, [wishList]);

  return (
    <div
      className={`w-full h-[50px] md:h-[80px] 
    bg-white  items-center justify-between z-20
    sticky top-0 transition-transform duration-300 px-5 lg:px-20
    ${show}
    `}
    >
      <MobileNav session={session} />
      <div className="hidden lg:flex py-2  ">
        <Logo />
        <NavigationMenu.Root className="NavigationMenuRoot">
          <NavigationMenu.List className="NavigationMenuList">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href={'/products'}
              >
                All
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="NavigationMenuTrigger">
                Shirt <CaretDownIcon className="CaretDown" aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="NavigationMenuContent">
                <ul className="List one">
                  <li style={{ gridRow: 'span 4' }}>
                    <NavigationMenu.Link asChild>
                      <a className="Callout" href="/">
                        <svg
                          aria-hidden
                          width="58"
                          height="58"
                          viewBox="0 0 25 25"
                          fill="white"
                        >
                          <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
                          <path d="M12 0H4V8H12V0Z"></path>
                          <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
                        </svg>
                        <div className="CalloutHeading">All</div>
                      </a>
                    </NavigationMenu.Link>
                  </li>

                  <ListItem
                    href="/products?categoryIds=de3b7ec3-5d4d-4a74-b772-1a32b3fe8b64"
                    title="Hoodie"
                  ></ListItem>
                  <ListItem
                    href="/products?categoryIds=1ba3ff22-f0e4-4a69-9f56-f55fa9deeae8"
                    title="Polo"
                  ></ListItem>
                  <ListItem
                    href="/products?categoryIds=832c6153-0a8b-463b-b868-0c6666647ced"
                    title="Shirt"
                  ></ListItem>
                  <ListItem
                    href="/products?categoryIds=2843d48f-8274-413b-ba3d-2115cb57c366"
                    title="T-Shirt"
                  ></ListItem>
                  <ListItem
                    href="/products?categoryIds=eab1fd95-1fd0-4076-9e4f-939743f1f9b1"
                    title="Vest"
                  ></ListItem>
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="NavigationMenuTrigger">
                Trouser <CaretDownIcon className="CaretDown" aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="NavigationMenuContent">
                <ul className="List two">
                  <ListItem
                    title="Jeans"
                    href="/products?categoryIds=eab1fd95-1fd0-4076-9e4f-939743f1f9b1"
                  ></ListItem>
                  <ListItem
                    title="Tall"
                    href="/products?categoryIds=181ae735-fea6-4d5c-aca1-24265090d7f2"
                  ></ListItem>
                  <ListItem
                    title="Short"
                    href="/products?categoryIds=299099c6-223f-43dd-aeda-f3433494ad72"
                  ></ListItem>
                  <ListItem
                    title="Baggy"
                    href="/products?categoryIds=99f2d2c0-b5a2-4ec0-9f8c-5f8b92ed4d07"
                  ></ListItem>
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            {/* <NavigationMenu.Item>
              <NavigationMenu.Trigger className="NavigationMenuTrigger">
                Shoe <CaretDownIcon className="CaretDown" aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="NavigationMenuContent">
                <ul className="List two">
                  <ListItem title="Shoe"></ListItem>
                  <ListItem title="Shoe"></ListItem>
                  <ListItem title="Shoe"></ListItem>
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="NavigationMenuTrigger">
                Glass <CaretDownIcon className="CaretDown" aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="NavigationMenuContent">
                <ul className="List two">
                  <ListItem title="Glass"></ListItem>
                  <ListItem title="Glass"></ListItem>
                  <ListItem title="Glass"></ListItem>
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item> */}

            {/* <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="https://github.com/radix-ui"
              >
                Github
              </NavigationMenu.Link>
            </NavigationMenu.Item> */}

            <NavigationMenu.Indicator className="NavigationMenuIndicator">
              <div className="Arrow" />
            </NavigationMenu.Indicator>
          </NavigationMenu.List>

          <div className="ViewportPosition">
            <NavigationMenu.Viewport className="NavigationMenuViewport" />
          </div>
        </NavigationMenu.Root>
        {user ? (
          <div className="flex flex-row gap-5 items-center justify-center">
            <Link href={'/image/search'}>
              <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2">
                <Camera className="w-5 h-5" />
                <span className="text-sm flex ">Search</span>
              </label>
            </Link>
            <Link href={'/favorite'}>
              <Button variant="outline" size="icon" className="relative">
                {wishListCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -right-2 -top-2 h-6 w-6 justify-center rounded-full p-2.5"
                  >
                    {wishListCount}
                  </Badge>
                )}
                {
                  <AiOutlineHeart className="text-slate-600 stroke-zinc-950 w-4 h-4 " />
                }
              </Button>
            </Link>
            <CartSheet />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {' '}
                  <Link href={'/user/profile'}>Profile</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Link href={'/admin/add-product'}>Thêm sản phẩm</Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Link href={'/user/conversations'}>Chat</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem('accessToken');
                    signOut({ callbackUrl: '/auth/login' });
                  }}
                  className="border-solid border-t-2 mt-2  gap-2"
                >
                  <div className="">{AuthSvg.signIn()}</div>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex space-x-4 items-center">
            <Button className="w-[100px] h-8">
              <Link href={'/auth/login'}>Login</Link>
            </Button>
            <CartSheet />
          </div>
        )}
      </div>
    </div>
  );
};

const ListItem = React.forwardRef(
  ({ children, title, ...props }, forwardedRef) => (
    <li>
      <NavigationMenu.Link asChild>
        <a className={'ListItemLink'} {...props} ref={forwardedRef}>
          <div className="ListItemHeading">{title}</div>
          <p className="ListItemText">{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
);

export default NavigationMenuDemo;
