import { redirect } from "next-intl/server";
import ResultsPage from "./page";
import { DEFAULT_LOCALE } from "@/i18n/constants";
import { renderAsync, screen } from "@/test-utils";

describe("Results page", () => {
  it("redirects to home page when no query string is found", async () => {
    await renderAsync(ResultsPage, {
      params: { locale: DEFAULT_LOCALE },
      searchParams: {},
    });

    expect(redirect).toBeCalledWith("/");
  });

  it("renders an alert when a syntax error is the query string", async () => {
    await renderAsync(ResultsPage, {
      params: { locale: DEFAULT_LOCALE },
      searchParams: { q: "hello:" },
    });

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });
});
