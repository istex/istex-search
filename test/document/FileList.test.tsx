import FileList from "@/app/[locale]/results/components/Document/FileList";
import { corpusWithExternalFulltextLink } from "@/config";
import type { Result } from "@/lib/istexApi";
import { customRender as render, screen } from "../test-utils";

describe("FileList", () => {
  const baseDocument: Result = {
    id: "123",
    corpusName: "Corpus name",
    arkIstex: "arkIstex",
  };

  it("displays the fulltext buttons when fulltext formats are available", () => {
    const documentWithFulltext: Result = {
      ...baseDocument,
      fulltext: [
        {
          extension: "pdf",
          uri: "https://example.com/pdf",
        },
      ],
    };
    render(<FileList document={documentWithFulltext} />);

    const pdfLink = screen.getByRole("link", { name: /PDF/ });

    expect(pdfLink).toBeInTheDocument();
  });

  it("doesn't display the fulltext buttons when fulltext formats are not available", () => {
    render(<FileList document={baseDocument} />);

    const fulltextHeading = screen.queryByRole("heading", {
      name: "Texte intégral",
    });

    expect(fulltextHeading).not.toBeInTheDocument();
  });

  it("displays the metadata buttons when metadata formats are available", () => {
    const documentWithMetadata: Result = {
      ...baseDocument,
      metadata: [
        {
          extension: "json",
          uri: "https://example.com/json",
        },
      ],
    };
    render(<FileList document={documentWithMetadata} />);

    const jsonLink = screen.getByRole("link", { name: /JSON/ });

    expect(jsonLink).toBeInTheDocument();
  });

  it("doesn't display the metadata buttons when metadata formats are not available", () => {
    render(<FileList document={baseDocument} />);

    const metadataHeading = screen.queryByRole("heading", {
      name: "Métadonnées",
    });

    expect(metadataHeading).not.toBeInTheDocument();
  });

  it("displays the annexes buttons when annexes formats are available", () => {
    const documentWithAnnexes: Result = {
      ...baseDocument,
      annexes: [
        {
          extension: "jpeg",
          uri: "https://example.com/jpeg",
        },
      ],
    };
    render(<FileList document={documentWithAnnexes} />);

    const jpegLink = screen.getByRole("link", { name: /JPEG/ });

    expect(jpegLink).toBeInTheDocument();
  });

  it("doesn't display the annexes buttons when annexes formats are not available", () => {
    render(<FileList document={baseDocument} />);

    const annexesHeading = screen.queryByRole("heading", { name: "Annexes" });

    expect(annexesHeading).not.toBeInTheDocument();
  });

  it("displays the enrichment buttons when enrichment formats are available", () => {
    const documentWithEnrichments: Result = {
      ...baseDocument,
      enrichments: {
        teeft: [
          {
            extension: "tei",
            uri: "https://example.com/teeft",
          },
        ],
      },
    };
    render(<FileList document={documentWithEnrichments} />);

    const teeftLink = screen.getByRole("link", { name: /Teeft/ });

    expect(teeftLink).toBeInTheDocument();
  });

  it("doesn't display the enrichment buttons when enrichment formats are not available", () => {
    render(<FileList document={baseDocument} />);

    const enrichmentHeading = screen.queryByRole("heading", {
      name: "Enrichissements",
    });

    expect(enrichmentHeading).not.toBeInTheDocument();
  });

  it("displays the open access button when an external PDF URL is available", () => {
    const documentWithExternalPdfUrl: Result = {
      ...baseDocument,
      corpusName: corpusWithExternalFulltextLink[0],
      fulltextUrl: "https://example.com/pdf",
    };
    render(<FileList document={documentWithExternalPdfUrl} />);

    const openAccessLink = screen.getByRole("link", {
      name: "Accéder à ce document sur sa plateforme d'origine",
    });

    expect(openAccessLink).toBeInTheDocument();
  });

  it("doesn't display the open access button when an external PDF URL is not available", () => {
    render(<FileList document={baseDocument} />);

    const openAccessHeading = screen.queryByRole("heading", {
      name: "Libre accès",
    });

    expect(openAccessHeading).not.toBeInTheDocument();
  });

  it("displays the Istex View button", () => {
    render(<FileList document={baseDocument} />);

    const istexViewLink = screen.getByRole("link", { name: /Istex\sView/ });

    expect(istexViewLink).toBeInTheDocument();
  });
});
