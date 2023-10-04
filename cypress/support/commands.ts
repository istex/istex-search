Cypress.Commands.add("openDownloadModal", (searchParams: object) => {
  cy.visit("/results", { qs: searchParams });
  cy.get("button#download-button").click();
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      openDownloadModal: (
        searchParams: object,
      ) => Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
