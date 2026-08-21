import routing from "@/i18n/routing";
import "@testing-library/jest-dom";

const routerMock = {
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn(),
  prefetch: jest.fn(),
  replace: jest.fn(),
};
mock("@/i18n/navigation", {
  redirect: jest.fn(),
  useRouter: () => routerMock,
  usePathname: jest.fn(() => "/"),
});

mock("next-intl/server", {
  getLocale: jest.fn(() => Promise.resolve(routing.defaultLocale)),
  getTranslations: jest.fn(),
});

mock("next/navigation", {
  useSearchParams: jest.fn(() => ({})),
});

mock("@/lib/istexApi", {
  getPossibleValues: jest.fn(() => []),
  getAggregation: jest.fn(() => []),
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

// We don't use the mock helper here because next/cache has side effects that
// use the TextEncoder API, which is not implemented in jsdom, so we can't
// afford to import the actual next/cache.
jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
}));

function mock(moduleName: string, mockedValue: Record<string, unknown>) {
  jest.mock(moduleName, () => {
    const actual = jest.requireActual<Record<string, unknown>>(moduleName);

    return {
      ...actual,
      ...mockedValue,
    };
  });
}
