import { Masthead } from '@/components/Masthead';
import { Hero } from '@/components/Hero';
import { DeckSection } from '@/components/DeckSection';
import { Exhibit } from '@/components/Exhibit';
import { Rhyme, Closing, Colophon } from '@/components/Essay';
import { EXHIBITS } from '@/data/exhibits';

export default function Page() {
  return (
    <>
      <Masthead />
      <main>
        <Hero />
        <DeckSection />
        {EXHIBITS.map((e, i) => (
          <Exhibit key={e.id} data={e} ordinal={i + 1} of={EXHIBITS.length} />
        ))}
        <Rhyme />
        <Closing />
      </main>
      <Colophon />
    </>
  );
}
