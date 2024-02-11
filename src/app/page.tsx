import HomeHere from '@/components/HomeHero';
import SignoutButton from '@/components/signoutButton';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/options';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="h-full">
      <HomeHere />
      <div className="container">
        <div className="px-10 lg:px-80">
          <h1 className="text-4xl">Hi Bro</h1>
          {JSON.stringify(session?.user)}
        </div>
      </div>
      <SignoutButton />
    </main>
  );
}
