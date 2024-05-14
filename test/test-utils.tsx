import type { AbstractIntlMessages } from "next-intl";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { render } from "@testing-library/react";
import TanStackQueryProvider from "@/app/[locale]/TanStackQueryProvider";
import type { SearchMode, SortBy, SortDir, UsageName } from "@/config";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { QueryProvider, type QueryContextProps } from "@/contexts/QueryContext";
import { DEFAULT_LOCALE, usePathname } from "@/i18n/navigation";
import NextIntlProvider from "@/i18n/provider";
import messages from "@/i18n/translations/fr-FR.json";
import type { IstexApiResponse } from "@/lib/istexApi";
import MuiSetup from "@/mui/setup";
import type { ClientComponent, ServerComponent } from "@/types/next";

export function customRender(
  ui: Parameters<typeof render>[0],
  context?: Partial<QueryContextProps & { results?: IstexApiResponse }>,
) {
  const wrapper: ClientComponent<{}, true> = ({ children }) => (
    <TanStackQueryProvider>
      <NextIntlProvider
        locale={DEFAULT_LOCALE}
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
      </NextIntlProvider>
    </TanStackQueryProvider>
  );

  return render(ui, { wrapper });
}

// Weird hack to render async components, taken from here:
// https://github.com/vercel/next.js/issues/47131#issuecomment-1481289418
export async function renderAsync<T extends object = {}>(
  component: ServerComponent<T>,
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
  filter?: string;
  searchMode?: SearchMode;
  sortBy?: SortBy;
  sortDirection?: SortDir;
}) {
  (useSearchParams as jest.Mock).mockReturnValue(searchParams);
}

export function mockSelectedLayoutSegment(segment: string) {
  (useSelectedLayoutSegment as jest.Mock).mockReturnValue(segment);
}

export function mockPathname(pathname: string) {
  (usePathname as jest.Mock).mockReturnValue(pathname);
}

// eslint-disable-next-line import/export
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
