import type { AbstractIntlMessages } from "next-intl";
import { useSearchParams } from "next/navigation";
import { render } from "@testing-library/react";
import type { UsageName } from "./config";
import { DEFAULT_LOCALE } from "./i18n/constants";
import NextIntlProvider from "./i18n/provider";
import messages from "./i18n/translations/fr-FR.json";
import MuiSetup from "./mui/setup";
import type { ClientComponent, ServerComponent } from "./types/next";

export function customRender(ui: Parameters<typeof render>[0]) {
  const wrapper: ClientComponent<{}, true> = ({ children }) => (
    <NextIntlProvider
      messages={messages as unknown as AbstractIntlMessages}
      locale={DEFAULT_LOCALE}
    >
      <MuiSetup>{children}</MuiSetup>
    </NextIntlProvider>
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
  extract?: string;
  size?: string;
  usage?: UsageName;
}) {
  (useSearchParams as jest.Mock).mockReturnValue(searchParams);
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
