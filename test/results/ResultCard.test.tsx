import { customRender as render, screen, userEvent } from "../test-utils";
import ResultCard from "@/app/[locale]/results/components/ResultCard";
import type { Result } from "@/lib/istexApi";

describe("ResultCard", () => {
  const document: Result = {
    id: "123",
    title: "Document title",
    host: {
      title: "Host title",
    },
    author: [
      {
        name: "Author name",
      },
    ],
    abstract: "Abstract",
  };

  it("should render correctly", () => {
    render(<ResultCard info={document} />);
    expect(screen.getByText("Document title")).toBeInTheDocument();
    expect(screen.getByText("Host title")).toBeInTheDocument();
    expect(screen.getByText("Author name")).toBeInTheDocument();
    expect(screen.getByText("Abstract")).toBeInTheDocument();
  });

  it("should handle selection correctly", async () => {
    render(<ResultCard info={document} />);
    const selectButton = screen.getByRole("button", { name: "Sélectionner" });
    const excludeButton = screen.getByRole("button", { name: "Exclure" });
    expect(selectButton).toBeInTheDocument();
    expect(excludeButton).toBeInTheDocument();
    expect(selectButton).toHaveTextContent("Sélectionner");

    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Dé-sélectionner");
    expect(excludeButton).not.toBeInTheDocument();

    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Sélectionner");
    const newExcludeButton = screen.getByRole("button", { name: "Exclure" });
    expect(newExcludeButton).toBeInTheDocument();
  });

  it("should handle exclusion correctly", async () => {
    render(<ResultCard info={document} />);
    const selectButton = screen.getByRole("button", { name: "Sélectionner" });
    const excludeButton = screen.getByRole("button", { name: "Exclure" });
    expect(selectButton).toBeInTheDocument();
    expect(excludeButton).toBeInTheDocument();
    expect(excludeButton).toHaveTextContent("Exclure");

    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Inclure");
    expect(selectButton).not.toBeInTheDocument();

    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Exclure");
    const newSelectButton = screen.getByRole("button", {
      name: "Sélectionner",
    });
    expect(newSelectButton).toBeInTheDocument();
  });
});
