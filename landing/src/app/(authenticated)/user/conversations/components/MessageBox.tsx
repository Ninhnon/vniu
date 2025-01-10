'use client';

import clsx from 'clsx';
import Image from 'next/legacy/image';
import { useState } from 'react';
import { format, isToday } from 'date-fns';
import { useSession } from 'next-auth/react';

import Avatar1 from '@/components/Avatar';
import ImageModal from './ImageModal';

// interface MessageBoxProps {
//   data: DirectMessage;
//   isLast?: boolean;
// }

const MessageBox: React.FC = ({ data }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.id === data?.userId;
  // const seenList = (data.seen || [])
  //   .filter((user) => user.email !== data?.sender?.email)
  //   .map((user) => user.name)
  //   .join(', ');

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    data.imageUrl ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );
  const messageDate = new Date(data.createdAt);
  return (
    <div className={container}>
      {!isOwn && (
        <div className={avatar}>
          <Avatar1
            avatarUrl={
              data?.avatarUrl ||
              'https://res.cloudinary.com/dldksrtdf/image/upload/v1735279420/16.vniu_logo_mwstvq.png'
            }
          />
        </div>
      )}

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{isOwn ? 'You' : 'Admin'}</div>
          <div className="text-xs text-gray-400">
            {
              isToday(messageDate)
                ? format(messageDate, 'p') // Display time if today
                : format(messageDate, 'M/d/yy p') // Display day, month, and year otherwise
            }
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.imageUrl ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={data.imageUrl}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
              priority={true}
            />
          ) : (
            <div>{data.content}</div>
          )}
        </div>
        {/* {isLast && isOwn && seenList.length > 0 && (
          <div className=" text-xs  font-light  text-gray-500 ">
            {`Seen by ${seenList}`}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MessageBox;
