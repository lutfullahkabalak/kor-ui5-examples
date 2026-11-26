# Kor examples

[Türkçe](README.tr.md) · [Live](https://lutfullahkabalak.github.io/kor-ui5-examples/) · [Kor documentation](https://lutfullahkabalak.github.io/kor-ui5/)

Small, complete OpenUI5 applications built with the published [kor-ui5](https://github.com/lutfullahkabalak/kor-ui5) package. Every app runs on UI5 1.108 and speaks English and Turkish (`?lang=tr`). All data is made up.

| App | Shows |
| --- | --- |
| [typescript-starter](apps/typescript-starter) | Shell, routing, deep links, command palette, typed controllers |
| [odata-products](apps/odata-products) | OData V2: filter, inline edit, batch save, create, value help, saved views |
| [approvals](apps/approvals) | Request list, history, hold to approve, reject with a reason |
| [production-plan](apps/production-plan) | Schedule and Board over the same data |
| [cash-dashboard](apps/cash-dashboard) | Stat, PieChart, BarChart, Trend, Flow filtering a list, runtime theming |
| [no-build](apps/no-build) | One HTML file, everything from a CDN |

## Take one

Each folder stands on its own:

```bash
npx degit lutfullahkabalak/kor-ui5-examples/apps/typescript-starter my-app
cd my-app && npm install && npm start
```

## Work on all of them

```bash
npm ci
npm run build   # dist/: every app and the gallery
npm run check   # opens them in Chrome (en, tr, desktop, phone) and clicks through
npm run shots   # the same, and refreshes the gallery pictures
```

The OData example answers requests with UI5's MockServer; it has not been tested against a real SAP Gateway.

Apache-2.0. Not affiliated with SAP. SAP, SAP Fiori and SAPUI5 are trademarks of SAP SE.
