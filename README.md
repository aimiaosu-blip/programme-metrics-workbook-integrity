# Programme Metrics Workbook Integrity

A Google Sheets portfolio demonstrating how to replace positional formulas with header-based references while preserving programme reporting figures. Independent synthetic demonstration created with Codex assistance; no UNDP data, engagement or endorsement.

## Open the working example

[Google Sheets workbook](https://docs.google.com/spreadsheets/d/1BDadQgodM5v1ctIjPesJtFg1NCn4vs8drsSSq_Mhhb0/edit). Access depends on the owner's sharing settings. A downloadable copy is included at [artifacts/programme-metrics.xlsx](artifacts/programme-metrics.xlsx).

Five tabs separate the refactored results, positional baseline, synthetic source records, reconciliation and maintenance guidance. Six fictional projects produce eight metrics: project count, requested/approved/disbursed funding, participants, two funding ratios and undisbursed funding.

## Reproduce

1. Import the `.xlsx` into Google Sheets and make a working copy.
2. Open **Extensions → Apps Script** and paste [Code.js](apps-script/Code.js). Save, then run `runIntegrityAudit` on that copy. Review the normal Google authorization request.
3. Run `inventoryDependencies` to create a formula inventory. Dynamic references and undiscoverable external consumers require manual review.
4. Run local tests with **Node.js 22+**: `node --test tests/*.test.cjs`. No API key, packages or network needed.

For a controlled robustness exercise, copy Source!A1:F7 into a separate scratch copy with both headers and values reversed. Refactored formulas retain the same results; positional baseline formulas break. Restore the original source before reporting. Never reorder values without their matching headers.

## Evidence

- Eight golden metrics are independently specified in [local-validation.json](artifacts/local-validation.json).
- Formula evaluation, baseline reconciliation, actual header/data permutation and source mutation were tested in the local spreadsheet engine.
- Eleven local Node tests cover input and dependency parsing failures. This is not coverage of the full Google Apps Script service API.
- Native Google Sheets and Apps Script execution status are recorded separately in [validation.md](docs/validation.md).

## Review pack

- [Formula examples and metric definitions](docs/method.md)
- [Dependency map, change decisions and handover](docs/handover.md)
- [Generated formula inventory](docs/formula-inventory.md), reproducible with `node inventory.cjs`
- [AI assistance record](docs/ai-assistance.md)

This intentionally bounded example uses six rows, not the employer's unavailable 32-tab workbook. Extend all source bounds when adding records. Totals measure fictional activity, not development impact. Participants are summed project counts and may not represent unique people across projects.
