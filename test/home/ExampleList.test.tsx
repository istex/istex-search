import ExampleList from "@/app/[locale]/components/SearchSection/ExampleList";
import { examples } from "@/config";
import { useRouter } from "@/i18n/routing";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("ExampleList", () => {
  it("goes to the results page when clicking on an example", async () => {
    const router = useRouter();
    render(<ExampleList setError={jest.fn()} />);

    const firstExample = screen.getAllByRole("button")[0];
    const firstExampleQuery = examples[0];
    await userEvent.click(firstExample);

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ q: firstExampleQuery }).toString()}`,
    );
  });
});
