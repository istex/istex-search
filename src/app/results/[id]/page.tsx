import { notFound } from 'next/navigation';
import { results } from '../results';
import type { DynamicRoutePage, GenerateMetadata } from '@/lib/helperTypes';

interface RouteParams {
  id: string;
}

export const generateMetadata: GenerateMetadata<RouteParams> = async ({ params }) => {
  const result = results.find(result => result.id === params.id);

  if (result == null) {
    return {};
  }

  return {
    title: `Istex-DL - ${result.name}`,
    description: result.description,
  };
};

const Page: DynamicRoutePage<RouteParams> = ({ params }) => {
  const result = results.find(result => result.id === params.id);

  if (result == null) {
    notFound();
  }

  return (
    <main>
      <h1>{result.name}</h1>
      <div>id: {result.id}</div>
      <div>description: {result.description}</div>
    </main>
  );
};

export default Page;
