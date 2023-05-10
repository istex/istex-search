import Link from 'next/link';
import { type Result, results } from './results';

export const metadata = {
  title: 'Istex-DL - results',
};

export default function Page (): React.ReactNode {
  return (
    <>
      <h1>Results</h1>
      <main>
        {results.map((result: Result) => (
          <div key={result.id}>
            <Link href={`/results/${result.id}`}>
              {result.name}
            </Link>
          </div>
        ))}
      </main>
    </>
  );
}
