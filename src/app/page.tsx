import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <main>
      <h1>Hello, Istex-DL!</h1>
      <Link href='/results'>Go to results</Link>
    </main>
  );
};

export default Home;
