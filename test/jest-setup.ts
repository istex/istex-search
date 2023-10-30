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

mock("next-intl/client", {
  useRouter: () => routerMock,
  usePathname: () => "/",
});

mock("next-intl/server", {
  redirect: jest.fn(),
  getTranslator: jest.fn(),
});

mock("next/navigation", {
  useSelectedLayoutSegment: jest.fn(),
  useSearchParams: jest.fn(),
});

function mock(moduleName: string, mockedValue: Record<string, unknown>) {
  jest.mock(moduleName, () => {
    const actual = jest.requireActual(moduleName);
    return {
      ...actual,
      ...mockedValue,
    };
  });
}
