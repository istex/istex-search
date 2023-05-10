import { type Result, results } from '../results';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function generateMetadata ({ params }: RouteParams): Promise<{
  title: string;
  description: string;
}> {
  const result = results.find(result => result.id === params.id) as Result;

  return {
    title: `Istex-DL - ${result.name}`,
    description: result.description,
  };
}

export default function Page ({ params }: RouteParams): React.ReactNode {
  const result = results.find(result => result.id === params.id) as Result;

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
