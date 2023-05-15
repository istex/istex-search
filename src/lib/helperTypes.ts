import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import type { URLSearchParams } from 'url';

interface GenerateMetadataProps<T> {
  params: T;
  searchParams: URLSearchParams;
}

export type GenerateMetadata<T> = (props: GenerateMetadataProps<T>) => Promise<Metadata>;

interface DynamicRoutePageProps<T> {
  params: T;
}

export type DynamicRoutePage<T> = React.FC<DynamicRoutePageProps<T>>;

export type Layout = React.FC<Required<PropsWithChildren>>;
