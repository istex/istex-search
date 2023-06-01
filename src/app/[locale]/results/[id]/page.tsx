import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { results, type Result } from '../results';
import ResultModal from './ResultModal';
import type { DynamicRoutePage, GenerateMetadata } from '@/types/next';

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
  const t = useTranslations('results');
  const result = results.find(result => result.id === params.id);

  if (result == null) {
    notFound();
  }

  const translatedResult: Result = {
    id: result.id,
    name: t(result.name),
    description: t(result.description),
  };

  return <ResultModal result={translatedResult} />;
};

export default Page;
