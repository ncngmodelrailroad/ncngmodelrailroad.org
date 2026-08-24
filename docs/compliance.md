# Compliance and security notes

Practical, low-cost steps that protect the organization, its donors, and its
visitors. Most of this is already handled in the site; the DNS items are the
one piece that lives outside the repo and needs to be set once.

## Stop email spoofing of the domain (do this)

The domain sends no email (we use a separate mailbox), but right now it has no
SPF or DMARC record, so anyone can forge mail that looks like it comes from
`@ncngmodelrailroad.org` and use it to solicit fake "donations." Publish these
three DNS records in Cloudflare to stop most of it. They tell mail receivers that
the domain sends and receives no mail, so compliant receivers reject forgeries.

| Type | Name | Value | Notes |
|---|---|---|---|
| TXT | `@` | `v=spf1 -all` | No server is allowed to send mail as this domain. |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` | Reject anything that fails (it all will). |
| MX | `@` | `.` (priority `0`) | Null MX: the domain accepts no mail (RFC 7505). |

In the Cloudflare dashboard: **DNS → Records → Add record** for each row. For the
null MX, choose type `MX`, name `@`, mail server `.`, priority `0`.

If the organization ever sends email from this domain (for example a real
`@ncngmodelrailroad.org` mailbox), replace these with a real SPF record, DKIM
keys from the mail provider, and a DMARC policy that allows that provider.

## Images and fonts: only use what we have the right to

Stock-image and font "license enforcement" letters are a real cottage industry.
Avoid them entirely by only publishing media we can prove we may use:

- **Images:** use the museum's own photographs, public-domain images, or images
  with a clear license that permits website use. Do not paste images found
  through a search engine. Keep a note of where each image came from.
- **Fonts:** the site self-hosts open-license fonts (Montserrat and Archivo
  Black, both SIL Open Font License) through `@fontsource`. It does not load
  fonts from Google's CDN, so no visitor IP is sent to a font network. Keep it
  that way.

## Accessibility

The site targets WCAG 2.1 AA. The public statement is at
[`/accessibility`](https://ncngmodelrailroad.org/accessibility). An automated
WCAG 2.1 AA audit (axe-core) runs on every pull request via
`.github/workflows/a11y.yml`, alongside manual review. Treat a failing
accessibility check like a failing build. The audit covers light and dark color
schemes.

## If we solicit donations: register the charity

California requires most charities that solicit donations to register with the
**Attorney General's Registry of Charitable Trusts** and to renew yearly. Many
other states have similar rules for online solicitation. This is a filing the
board handles, not a code change. Start at the California Attorney General's
Registry of Charitable Trusts. Keep the registration current if the site asks
for money.

This is operational guidance, not legal or tax advice. The board should confirm
its obligations with counsel or an accountant, or through the California Attorney
General's resources.

## Already handled

- Cookie-free analytics (Cloudflare Web Analytics), so no consent banner is
  needed. Do not add a second analytics tool or any tracking cookies.
- No accounts, no on-site data collection (contact buttons open the visitor's
  own email client), no on-site payment processing.
- Branch protection on `main` with a required build check. Every change goes
  through a pull request, and force pushes and branch deletion are blocked.
- A privacy policy at [`/privacy`](https://ncngmodelrailroad.org/privacy).
