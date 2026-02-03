import { QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import type * as React from "react";
import type {
  ArchiveType,
  SearchMode,
  SortBy,
  SortDir,
  UsageName,
} from "@/config";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { type QueryContextProps, QueryProvider } from "@/contexts/QueryContext";
import TanStackQueryProvider from "@/contexts/TanStackQueryProvider";
import { routing, usePathname } from "@/i18n/routing";
import messages from "@/i18n/translations/fr-FR.json";
import type { IstexApiResponse } from "@/lib/istexApi";
import MuiSetup from "@/mui/setup";

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function customRender(
  ui: Parameters<typeof render>[0],
  context?: Partial<QueryContextProps>,
) {
  const emptyResults: IstexApiResponse = {
    total: 0,
    hits: [],
    aggregations: {},
  };

  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <TanStackQueryProvider client={testQueryClient}>
      <MuiSetup locale={routing.defaultLocale}>
        <NextIntlClientProvider
          locale={routing.defaultLocale}
          messages={messages as unknown as AbstractIntlMessages}
        >
          <HistoryProvider>
            <QueryProvider
              queryString={context?.queryString ?? ""}
              results={context?.results ?? emptyResults}
              loading={context?.loading}
              randomSeed={context?.randomSeed}
            >
              <DocumentProvider>{children}</DocumentProvider>
            </QueryProvider>
          </HistoryProvider>
        </NextIntlClientProvider>
      </MuiSetup>
    </TanStackQueryProvider>
  );

  // Necessary to make navigator.clipboard available
  userEvent.setup();

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

const defaultIsSecureContext = window.isSecureContext;

export function mockIsSecureContext(isSecureContext: boolean) {
  window.isSecureContext = isSecureContext;
}

export function restoreIsSecureContext() {
  window.isSecureContext = defaultIsSecureContext;
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
