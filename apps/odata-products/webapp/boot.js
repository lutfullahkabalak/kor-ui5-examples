// Stands in for a backend: answers OData requests in the browser
sap.ui.define(["sap/ui/core/util/MockServer"], (MockServer) => {
  const server = new MockServer({ rootUri: "/mock/products/" });
  const path = (file) => sap.ui.require.toUrl("kor/example/odataproducts/mock/" + file);
  server.simulate(path("metadata.xml"), { sMockdataBaseUrl: path(""), bGenerateMissingMockData: false });
  server.start();
  sap.ui.require(["sap/ui/core/ComponentSupport"]);
});
