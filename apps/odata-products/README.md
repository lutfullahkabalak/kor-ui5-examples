# Products with OData V2

Reads, filters, edits and creates products through an OData V2 model. `FilterBar` sends real `$filter`s, `Variants` stores the layout in the browser, `LookupField` is the value help, and edits are collected until `submitChanges`. The backend is UI5's `MockServer` (`webapp/boot.js`); delete that file, point `data-sap-ui-onInit` back to `module:sap/ui/core/ComponentSupport` and change the data source URI to use your own service. Not tested against a real SAP Gateway.

```bash
npm install
npm start
```

Add `?lang=tr` to the address for Turkish. All data is made up and kept in memory.
