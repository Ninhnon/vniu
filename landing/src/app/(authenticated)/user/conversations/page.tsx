import Header from './components/Header';
import dynamic from 'next/dynamic';
import { getSession } from 'next-auth/react';
const Body = dynamic(() => import('./components/Body'));

const ChatId = async () => {
  const session = await getSession();
  // const conversation = await getConversationById(session?.data?.user?.id);

  // if (!conversation) {
  //   return (
  //     <div className="lg:pl-80 h-full">
  //       <div className="h-full flex flex-col">
  //         <EmptyState />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full">
      <div className="h-full flex flex-col">
        <Header />
        <Body session={session} />
      </div>
    </div>
  );
};

export default ChatId;
