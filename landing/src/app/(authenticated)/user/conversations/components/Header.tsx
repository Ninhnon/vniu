'use client';

import { HiChevronLeft } from 'react-icons/hi';
import { useMemo } from 'react';
import Link from 'next/link';
import useOtherUser from '@hooks/useOtherUser';
import useActiveList from '@hooks/useActiveList';

import Avatar1 from '@components/Avatar';

const Header: React.FC = () => {
  return (
    <div className="bg-white w-full flex h-[10%]border-b-[1px] sm:px-4 py-3 px-4 overflow-hidden lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          href="/"
          className="block text-sky-500 hover:text-sky-600 transition cursor-pointer"
        >
          <HiChevronLeft size={32} />
        </Link>

        <Avatar1 />
        <div className="flex flex-col">
          <div>Admin</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
