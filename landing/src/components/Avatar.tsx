'use client';

import { AvatarImage, Avatar } from '@/components/ui/avatar';

const Avatar1: React.FC = ({ avatarUrl }: { avatarUrl?: string }) => {
  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
        <Avatar>
          <AvatarImage
            src={
              avatarUrl ||
              'https://res.cloudinary.com/dldksrtdf/image/upload/v1735279420/16.vniu_logo_mwstvq.png'
            }
          />
        </Avatar>
      </div>
    </div>
  );
};

export default Avatar1;
