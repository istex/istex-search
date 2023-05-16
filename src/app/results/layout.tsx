import Link from 'next/link';
import { results } from './results';
import type { Layout } from '@/lib/helperTypes';

export const metadata = {
  title: 'Istex-DL - results',
};

const ResultsLayout: Layout = ({ children }) => {
  return (
    <main>
      <h1>Results</h1>
      <div style={{ display: 'flex' }}>
        <aside style={{ paddingRight: '2rem' }}>
          <ul>
            {results.map(result => (
              <li key={result.id}>
                <Link
                  style={{ display: 'block' }}
                  href={`/results/${result.id}`}
                >
                  {result.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        {children}
      </div>
    </main>
  );
};

export default ResultsLayout;
