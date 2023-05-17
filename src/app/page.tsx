import Link from 'next/link';
import type { Page } from '@/lib/helperTypes';

const HomePage: Page = () => {
  return (
    <main>
      <h1>Hello, Istex-DL!</h1>
      <Link href='/results'>Go to results</Link>
    </main>
  );
};

export default HomePage;
