# Email checks

Tests for HTML emails. Put exported emails in [`/emails`](../emails); every push runs [the workflow](../.github/workflows/email-check.yml).

| Check | What it catches | Fails the run? |
|---|---|---|
| **caniemail** | HTML/CSS not supported in the chosen clients ([Can I Email](https://www.caniemail.com) data) | Yes, on "not supported" |
| **doiuse-email** | Same data, second opinion with its own rules | No, reported as warnings |
| **Gmail clipping** | HTML over ~102 KB, which Gmail cuts off | Yes |
| **Accessibility** | Missing `lang`, images without `alt`, layout tables without `role="presentation"` | Yes, on `lang` / `alt` |

Settings live in [`config.json`](config.json): clients to test (Apple Mail, Gmail, Outlook, Yahoo by default), size limits, and which checks fail the run.

Results appear in the run's **Summary** tab, and as annotations on the files.

## Run locally

```bash
cd email-check
npm install
node check.mjs ../emails
```
