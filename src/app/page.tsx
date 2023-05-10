import Link from 'next/link';

export default function Home (): React.ReactNode {
  return (
    <>
      <h1>Hello, Istex-DL!</h1>
      <Link href='/results'>Go to results</Link>
    </>
  );
}
