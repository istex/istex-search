import Link from 'next/link';
import { type Result, results } from './results';

export const metadata = {
  title: 'Istex-DL - results',
};

export default function Layout ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <>
      <h1>Results</h1>
      <main style={{ display: 'flex' }}>
        <section style={{ paddingRight: '2rem' }}>
          {results.map((result: Result) => (
            <div key={result.id}>
              <Link href={`/results/${result.id}`}>
                {result.name}
              </Link>
            </div>
          ))}
        </section>

        <section>{children}</section>
      </main>
    </>
  );
}
