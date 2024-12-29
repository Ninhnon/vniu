import Chatbot from '@/components/Chatbot';
import { getSession } from '@/lib/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="w-full h-full">
      {/* <Header session={session} /> */}
      {children}
      <Chatbot />

      {/* <Footer /> */}
    </div>
  );
}
