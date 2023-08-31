/* eslint-disable cypress/no-unnecessary-waiting */

describe("The Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Valid search", () => {
    const queryString = "hello";

    cy.get("input#regular-search-input").type(queryString);
    cy.get("form").submit();
    cy.wait(500);
    cy.url().should("include", `/results?q=${queryString}`);
  });

  it("Search with empty input", () => {
    cy.get("button[type=submit]").click();
    cy.url().should("not.include", "/results");
    cy.get("p#regular-search-input-helper-text").should("exist");
  });
});
