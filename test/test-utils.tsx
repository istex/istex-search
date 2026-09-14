import { QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type * as React from "react";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { type QueryContextProps, QueryProvider } from "@/contexts/QueryContext";
import TanStackQueryProvider from "@/contexts/TanStackQueryProvider";
import { usePathname } from "@/i18n/navigation";
import routing from "@/i18n/routing";
import messages from "@/i18n/translations/fr-FR";
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
  nuqsAdapterProps?: Omit<
    React.ComponentProps<typeof NuqsTestingAdapter>,
    "children"
  >,
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
            <NuqsTestingAdapter {...nuqsAdapterProps}>
              <QueryProvider
                queryString={context?.queryString ?? ""}
                results={context?.results ?? emptyResults}
                loading={context?.loading}
                randomSeed={context?.randomSeed}
              >
                <DocumentProvider>{children}</DocumentProvider>
              </QueryProvider>
            </NuqsTestingAdapter>
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
