import Link from 'next/link';
import { type Result, results } from './results';
import type { Layout } from '@/lib/helperTypes';

export const metadata = {
  title: 'Istex-DL - results',
};

const ResultsLayout: Layout = ({ children }) => {
  return (
    <main>
      <h1>Results</h1>
      <div style={{ display: 'flex' }}>
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
      </div>
    </main>
  );
};

export default ResultsLayout;
