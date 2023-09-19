/* eslint-disable cypress/no-unnecessary-waiting */

describe("The Download Page", () => {
  describe("Valid", () => {
    const queryString = "hello";
    const size = 1000;

    it("Default state of the page", () => {
      cy.visit("/download", { qs: { q: queryString, size } });

      cy.get("button[data-testid=custom")
        .invoke("attr", "aria-selected")
        .should("equal", "true");

      cy.get("input[type=checkbox]").should("not.be.checked");
      cy.get("button#download-button").should("be.disabled");

      cy.get("p[data-testid=custom-usage-description]").should("exist");
      cy.get("p[data-testid=query-string]").should("have.text", queryString);
      cy.get("a[data-testid=raw-request]").should(
        "include.text",
        `q=${queryString}`
      );
    });

    it("Selecting formats", () => {
      // Adding arbitrary wait times to wait until the page is fully loaded is the only
      // way I found to make this test pass on all browsers. The initial page load is a
      // little bit long and each click on a checkbox re-renders the whole view and it
      // takes some time.

      cy.visit("/download", { qs: { q: queryString, size } });
      cy.wait(2000);

      cy.get('input[name="fulltext.pdf"]').check();
      cy.wait(1000);
      cy.get('input[name="metadata.json"]').check();
      cy.wait(1000);
      cy.get('input[name="metadata.xml"]').check();
      cy.wait(1000);
      cy.get('input[name="metadata.mods"]').check();
      cy.wait(1000);

      cy.get('input[name="fulltext.category"]')
        .invoke("attr", "data-indeterminate")
        .should("equal", "true");
      cy.get('input[name="metadata.category"]').should("be.checked");

      cy.get("button#download-button").should("be.enabled");
      cy.url().should("include", "extract=fulltext%5Bpdf%5D");
    });

    it("Custom usage", () => {
      const usage = "custom";
      const extract = "fulltext[pdf]";
      cy.visit("/download", { qs: { q: queryString, size, usage, extract } });

      cy.get(`button[data-testid=${usage}`)
        .invoke("attr", "aria-selected")
        .should("equal", "true");

      cy.get("input[type=checkbox]:disabled").should("not.exist");
      cy.get('input[name="fulltext.pdf"]').should("be.checked");
      cy.get(`p[data-testid=${usage}-usage-description]`).should("exist");
      cy.url().should("include", `extract=${encodeURIComponent(extract)}`);
    });

    it("Lodex usage", () => {
      const usage = "lodex";
      const extract = "metadata[json]";
      cy.visit("/download", { qs: { q: queryString, size, usage, extract } });

      cy.get(`button[data-testid=${usage}`)
        .invoke("attr", "aria-selected")
        .should("equal", "true");

      cy.get("input[type=checkbox]").should("be.disabled");
      cy.get('input[name="metadata.json"]').should("be.checked");
      cy.get(`p[data-testid=${usage}-usage-description]`).should("exist");
      cy.url().should("include", `extract=${encodeURIComponent(extract)}`);
    });

    it("CorTexT usage", () => {
      const usage = "cortext";
      const extract = "fulltext[tei,cleaned];enrichments[teeft]";
      cy.visit("/download", { qs: { q: queryString, size, usage, extract } });

      cy.get(`button[data-testid=${usage}`)
        .invoke("attr", "aria-selected")
        .should("equal", "true");

      cy.get("input[type=checkbox]").should("be.disabled");
      cy.get('input[name="fulltext.tei"]').should("be.checked");
      cy.get('input[name="fulltext.cleaned"]').should("be.checked");
      cy.get('input[name="enrichments.teeft"]').should("be.checked");
      cy.get(`p[data-testid=${usage}-usage-description]`).should("exist");
      cy.url().should("include", `extract=${encodeURIComponent(extract)}`);
    });

    it("GarganText usage", () => {
      const usage = "gargantext";
      const extract = "metadata[json]";
      cy.visit("/download", { qs: { q: queryString, size, usage, extract } });

      cy.get(`button[data-testid=${usage}`)
        .invoke("attr", "aria-selected")
        .should("equal", "true");

      cy.get("input[type=checkbox]").should("be.disabled");
      cy.get('input[name="metadata.json"]').should("be.checked");
      cy.get(`p[data-testid=${usage}-usage-description]`).should("exist");
      cy.url().should("include", `extract=${encodeURIComponent(extract)}`);
    });

    it("Changing the size", () => {
      cy.visit("/download", { qs: { q: queryString, size } });
      cy.wait(500);

      const inputSelector = "input#size-input";
      cy.get(inputSelector).type("3");
      cy.get(inputSelector).should("have.value", `${size}3`);
      cy.url().should("include", `size=${size}3`);

      cy.get("span[data-testid=max-size-label]")
        .invoke("text")
        .then((text) => {
          // Extract the size from the label by removing everything that is not a digit
          const maxSize = text.replace(/[^0-9]/g, "");
          cy.get(inputSelector).type("99");
          cy.get(inputSelector).should("have.value", maxSize);
          cy.url().should("include", `size=${maxSize}`);
          cy.get("button#all-button").should("be.disabled");
        });
    });
  });

  describe("Invalid", () => {
    it("Empty query string", () => {
      cy.visit("/download", { qs: { q: "", size: 2 } });

      // A NEXT_REDIRECT error is expected when the query string is empty
      cy.on("uncaught:exception", () => false);

      cy.url().should("not.include", "/download");
    });

    it("No query string", () => {
      cy.visit("/download", { qs: { size: 2 } });

      // A NEXT_REDIRECT error is expected when there is no query string
      cy.on("uncaught:exception", () => false);

      cy.url().should("not.include", "/download");
    });
  });
});
