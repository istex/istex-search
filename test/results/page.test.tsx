import ResultsPage from "@/app/[locale]/results/_page";
import { redirect } from "@/i18n/navigation";
import routing from "@/i18n/routing";
import { renderAsync, screen } from "../test-utils";

describe("Results page", () => {
  it("redirects to home page when no query string is found", async () => {
    await renderAsync(ResultsPage, {
      params: Promise.resolve({ locale: routing.defaultLocale }),
      searchParams: Promise.resolve({}),
    });

    expect(redirect).toHaveBeenCalledWith({
      href: "/",
      locale: routing.defaultLocale,
    });
  });

  it("renders an alert when a syntax error is the query string", async () => {
    await renderAsync(ResultsPage, {
      params: Promise.resolve({ locale: routing.defaultLocale }),
      searchParams: Promise.resolve({ q: "hello:" }),
    });

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });
});
