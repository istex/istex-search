import * as React from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { useSearchParams } from "next/navigation";
import { render } from "@testing-library/react";
import type {
  ArchiveType,
  SearchMode,
  SortBy,
  SortDir,
  UsageName,
} from "@/config";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { QueryProvider, type QueryContextProps } from "@/contexts/QueryContext";
import TanStackQueryProvider from "@/contexts/TanStackQueryProvider";
import { routing, usePathname } from "@/i18n/routing";
import messages from "@/i18n/translations/fr-FR.json";
import type { IstexApiResponse } from "@/lib/istexApi";
import MuiSetup from "@/mui/setup";

export function customRender(
  ui: Parameters<typeof render>[0],
  context?: Partial<QueryContextProps & { results?: IstexApiResponse }>,
) {
  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <TanStackQueryProvider>
      <NextIntlClientProvider
        locale={routing.defaultLocale}
        messages={messages as unknown as AbstractIntlMessages}
      >
        <MuiSetup>
          <HistoryProvider>
            <DocumentProvider results={context?.results}>
              <QueryProvider
                queryString={context?.queryString ?? ""}
                resultsCount={context?.resultsCount ?? 0}
                loading={context?.loading}
                randomSeed={context?.randomSeed}
              >
                {children}
              </QueryProvider>
            </DocumentProvider>
          </HistoryProvider>
        </MuiSetup>
      </NextIntlClientProvider>
    </TanStackQueryProvider>
  );

  return render(ui, { wrapper });
}

// Weird hack to render async components, taken from here:
// https://github.com/vercel/next.js/issues/47131#issuecomment-1481289418
export async function renderAsync<T>(
  component: (props: T) => Promise<React.ReactNode>,
  props: T,
) {
  const resolvedComponent = await component(props);
  const TmpComponent = () => resolvedComponent;

  return customRender(<TmpComponent />);
}

export function mockSearchParams(searchParams: {
  q?: string;
  ast?: string;
  extract?: string;
  size?: string;
  page?: string;
  perPage?: string;
  usage?: UsageName;
  filters?: string;
  searchMode?: SearchMode;
  sortBy?: SortBy;
  sortDirection?: SortDir;
  archiveType?: ArchiveType;
  compressionLevel?: string;
}) {
  (useSearchParams as jest.Mock).mockReturnValue(searchParams);
}

export function mockPathname(pathname: string) {
  (usePathname as jest.Mock).mockReturnValue(pathname);
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
