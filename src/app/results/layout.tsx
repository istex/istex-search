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
            <Link
              key={result.id}
              style={{ display: 'block' }}
              href={`/results/${result.id}`}
            >
              {result.name}
            </Link>
          ))}
        </section>

        <section>{children}</section>
      </div>
    </main>
  );
};

export default ResultsLayout;
