describe("The Results Page", () => {
  describe("Valid", () => {
    const queryString = "hello";

    beforeEach(() => {
      cy.visit("/results", { qs: { q: queryString } });
    });

    it("Search", () => {
      cy.get("button#download-button").should("exist");
      cy.get("input#regular-search-input").should("have.value", queryString);
      cy.get("#results-grid").children().should("have.length.gt", 0);
    });

    it("Going to download page", () => {
      cy.get("button#download-button").click();
      cy.url().should("include", "/download");
    });

    it("Going back to home page", () => {
      cy.get("a#home-link").click();
      cy.url().should("not.include", "/results");
    });
  });

  describe("Invalid", () => {
    it("Syntax error", () => {
      cy.visit("/results", { qs: { q: "hello:" } });

      cy.get("[role=alert]").should("exist");
    });

    it("Empty query string", () => {
      cy.visit("/results", { qs: { q: "" } });

      // A NEXT_REDIRECT error is expected when the query string is empty
      cy.on("uncaught:exception", () => false);

      cy.url().should("not.include", "/results");
    });

    it("No query string", () => {
      cy.visit("/results");

      // A NEXT_REDIRECT error is expected when there is no query string
      cy.on("uncaught:exception", () => false);

      cy.url().should("not.include", "/results");
    });
  });
});
