# Validation status

- Local Node.js: 11 tests passed.
- Local spreadsheet engine: eight golden metrics, baseline equality, header permutation and changed-input checks passed.
- Native Google Sheets: imported successfully. Google-calculated values were read back for Baseline!B2:B9 and Refactored!B2:B9. All eight matched the golden values; Audit!D2:D9 returned zero and Audit!E2:E9 returned PASS. All five tabs were visually inspected in Google Sheets at 100% zoom.
- Bound Apps Script: runIntegrityAudit completed successfully on 2026-11-24 at 14:57:52 UTC (22:57:52 Asia/Shanghai). Native readback confirmed eight PASS results, zero differences, and the Google Apps Script engine stamp in Audit!A12:B13. The dependency inventory function has local parser tests but has not yet been run in Google.

The local automated tests exercise pure functions. Google-hosted execution separately verifies the audit entry point. The native Audit tab now contains a timestamped script snapshot; rerun the audit after editing inputs. The downloadable XLSX retains the original live reconciliation formulas.
