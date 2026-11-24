# Method and metric dictionary

The snapshot is cumulative for six fictional projects. USD values are whole-dollar amounts. All required values must be populated; zero approved funding is valid, missing funding is not. Project IDs are unique. Disbursed ≤ approved ≤ requested. Participants are nonnegative integer project counts.

| Metric | Definition | Golden result |
|---|---|---:|
| Projects | Number of nonblank unique project IDs | 6 |
| Requested USD | Sum requested_usd | 85,000 |
| Approved USD | Sum approved_usd | 65,000 |
| Disbursed USD | Sum disbursed_usd | 45,000 |
| Participants | Sum project-level participants | 620 |
| Approval ratio | Total approved / total requested | 76.4705882353% |
| Disbursement ratio | Total disbursed / total approved | 69.2307692308% |
| Undisbursed USD | Total approved minus total disbursed | 20,000 |

Baseline requested funding: `=SUM(Source!C2:C7)`.

Refactored requested funding: `=SUM(INDEX(Source!$A$2:$F$7,0,MATCH("requested_usd",Source!$A$1:$F$1,0)))`.

`MATCH(...,0)` requests an exact header. Duplicate headers must be rejected before calculation. Ratios use the total numerator and denominator, not an average of project ratios. Zero denominators return `n.a.`; the numeric comparison marks these for review instead of treating them as zero or PASS.

The golden control is manually specified separately from formula construction. Reconciliation uses a floating-point tolerance of 1e-10; this is numeric equivalence within tolerance, not bit-for-bit equality or a substitute for a business rounding policy. All integer totals match exactly in this fixture.

References: [Google INDEX](https://support.google.com/docs/answer/3098242), [Google MATCH](https://support.google.com/docs/answer/3093378), [Apps Script Spreadsheet service](https://developers.google.com/apps-script/reference/spreadsheet).
