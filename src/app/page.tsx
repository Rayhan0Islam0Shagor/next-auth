import HomeHere from '@/components/HomeHero';
import SignoutButton from '@/components/signoutButton';
import { getServerSession } from 'next-auth';

import { redirect } from 'next/navigation';

export default async function Home() {
  // if (!session) {
  //   redirect("/login");
  // }
  return (
    <main className="h-full">
      <HomeHere />

      <SignoutButton />
    </main>
  );
}
