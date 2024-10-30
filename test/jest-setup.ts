import "@testing-library/jest-dom";
import "cross-fetch/polyfill";

const routerMock = {
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn(),
  prefetch: jest.fn(),
  replace: jest.fn(),
};

mock("@/i18n/routing", {
  redirect: jest.fn(),
  useRouter: () => routerMock,
  usePathname: jest.fn(() => "/"),
});

mock("next-intl/server", {
  getTranslations: jest.fn(),
});

mock("next/navigation", {
  useSearchParams: jest.fn(),
});

mock("@/lib/istexApi", {
  getPossibleValues: jest.fn(() => []),
});

const shareMock = jest.fn();
const downloadMock = jest.fn();
mock("@/lib/hooks", {
  useDownload: () => downloadMock,
  useShare: () => shareMock,
});

const historyMock = {
  get: jest.fn(),
  push: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
  getCurrentRequest: jest.fn(),
  populateCurrentRequest: jest.fn(),
  isEmpty: jest.fn(),
};
mock("@/contexts/HistoryContext", {
  useHistoryContext: () => historyMock,
});

function mock(moduleName: string, mockedValue: Record<string, unknown>) {
  jest.mock(moduleName, () => {
    const actual = jest.requireActual(moduleName);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...actual,
      ...mockedValue,
    };
  });
}
