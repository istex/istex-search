/* eslint-disable cypress/no-unnecessary-waiting */

describe("The Download Page", () => {
  describe("Valid", () => {
    const queryString = "hello";
    const size = 2;

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

    it("Size set to 0", () => {
      cy.visit("/download", { qs: { q: "hello", size: 0 } });

      // A NEXT_REDIRECT error is expected when the size is 0
      cy.on("uncaught:exception", () => false);

      cy.url().should("not.include", "/download");
    });

    it("No size", () => {
      cy.visit("/download", { qs: { q: "hello" } });

      // A NEXT_REDIRECT error is expected when there is no size
      cy.on("uncaught:exception", () => false);

      cy.url().should("not.include", "/download");
    });
  });
});
