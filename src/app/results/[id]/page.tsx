import { notFound } from 'next/navigation';
import { Card, CardContent, Typography } from '@/components/@mui/material';
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
    <Card>
      <CardContent>
        <Typography variant='h5'>{result.name}</Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>{result.id}</Typography>
        <Typography>{result.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default Page;
