# Email checks

Tests for HTML emails. Put exported emails in [`/emails`](../emails); every push runs [the workflow](../.github/workflows/email-check.yml).

| Check | What it catches | Fails the run? |
|---|---|---|
| **caniemail** | HTML/CSS not supported in the chosen clients ([Can I Email](https://www.caniemail.com) data) | Yes, on "not supported" |
| **doiuse-email** | Same data, second opinion with its own rules | No, reported as warnings |
| **Gmail clipping** | HTML over ~102 KB, which Gmail cuts off | Yes |
| **Accessibility** | Missing `lang`, images without `alt`, layout tables without `role="presentation"` | Yes, on `lang` / `alt` |

Settings live in [`config.json`](config.json):

- `clients`: which clients to test. `["*"]` = every client in the Can I Email database (~50).
- `failClients`: which of them can fail the run (Apple Mail, Gmail, Outlook, Yahoo by default). Issues in the others are warnings.
- Size limits, and which checks fail the run.

The run's Summary includes a **By client** table: every client × every email, with ✅ / ⚠️ / ❌.

`warnOnly` lists features some clients strip without breaking the email (`<body>`, `role`). They're still reported, as warnings: for example, styles on `<body>` are lost in those clients, so put backgrounds on a wrapper table too.

Results appear in the run's **Summary** tab, and as annotations on the files.

## Run locally

```bash
cd email-check
npm install
node check.mjs ../emails
```
