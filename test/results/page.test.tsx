import ResultsPage from "@/app/[locale]/results/_page";
import { redirect, routing } from "@/i18n/routing";
import { renderAsync, screen } from "../test-utils";

describe("Results page", () => {
  it("redirects to home page when no query string is found", async () => {
    await renderAsync(ResultsPage, {
      params: { locale: routing.defaultLocale },
      searchParams: {},
    });

    expect(redirect).toHaveBeenCalledWith({
      href: "/",
      locale: routing.defaultLocale,
    });
  });

  it("renders an alert when a syntax error is the query string", async () => {
    await renderAsync(ResultsPage, {
      params: { locale: routing.defaultLocale },
      searchParams: { q: "hello:" },
    });

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });
});
