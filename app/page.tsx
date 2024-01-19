'use client'
import DrumMachine from '@/components/DrumMachine/DrumMachine';
import { useLoaded } from '@/components/useLoaded';

export default function Home() {
  const loaded = useLoaded();

  return (
    <main className='mainPage'>
      {loaded && <DrumMachine />}
    </main>
  );
}
