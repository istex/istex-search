import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { results } from '../results';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function generateMetadata ({ params }: RouteParams): Promise<Metadata> {
  const result = results.find(result => result.id === params.id);

  if (result == null) {
    return {};
  }

  return {
    title: `Istex-DL - ${result.name}`,
    description: result.description,
  };
}

export default function Page ({ params }: RouteParams): React.ReactNode {
  const result = results.find(result => result.id === params.id);

  if (result == null) {
    notFound();
  }

  return (
    <>
      <h1>{result.name}</h1>
      <main>
        <div>id: {result.id}</div>
        <div>description: {result.description}</div>
      </main>
    </>
  );
}
