# Compliance and security notes

Practical, low-cost steps that protect the organization, its donors, and its
visitors. Most of this is already handled in the site; the DNS items are the
piece that lives outside the repo and needs administrator approval and review
whenever email services change.

## Reduce domain email spoofing (proposed, not applied)

**Status:** No live DNS changes were made for this guidance. Mail use and access
to the authoritative DNS account remain unconfirmed. Do not publish deny-all
SPF, rejecting DMARC, or null MX until the inventory and approval steps below
are complete. Merging this document does not change DNS or authorize a change.

### DNS observations

On 2026-09-10, queries to both authoritative nameservers,
`ns23.domaincontrol.com` and `ns24.domaincontrol.com`, returned:

| Query | Result |
|---|---|
| `ncngmodelrailroad.org TXT` | `NOERROR`, no answer records, with an authoritative SOA in the authority section. No apex SPF record observed. |
| `_dmarc.ncngmodelrailroad.org TXT` | `NXDOMAIN`, with an authoritative SOA in the authority section. No DMARC record observed. |
| `ncngmodelrailroad.org MX` | `NOERROR`, no answer records, with an authoritative SOA in the authority section. No MX or null MX observed. |

The responses had the authoritative-answer (`aa`) flag. Google Public DNS
independently returned the same mail-record results. Direct SOA, A, and AAAA
queries from this environment returned `SERVFAIL`; Google Public DNS returned
a valid SOA. Those failures are not evidence that address records are absent.
Recheck DNS health from the administrator's network before making changes.

This delegation is not to Cloudflare nameservers. Confirm the account that
manages the authoritative zone; using Cloudflare Web Analytics does not mean
Cloudflare manages DNS. Do not move nameservers to implement these records.

Empty MX answers do not prove that the domain receives no mail: SMTP can fall
back to A/AAAA records. Empty apex TXT answers do not inventory senders,
subdomains, or DKIM keys.

### Required mail inventory and approval

The website's contact setting in `src/config/organization.ts` uses an external
mailbox. However, [contributor](../CONTRIBUTING.md),
[support](../SUPPORT.md), [conduct](../CODE_OF_CONDUCT.md), and
[getting-started](getting-started.md) guides list a domain-local mailbox.
These conflicting references establish neither active mail service nor its
absence. Confirm their status with the mail/domain administrator.

Before proposing a live change, the administrator must:

1. Confirm receiving and sending use separately for the apex and every used or
   delegated subdomain. Include mailboxes, aliases, catch-alls, forwarding,
   reply and bounce addresses, and account-recovery destinations.
2. Check all services that send mail, including transactional notifications,
   newsletters, donation services, and Groups.io or other mailing lists.
   Record each service's visible From domain, envelope sender/return-path
   domain, and DKIM signing domain and selectors. A service may use the
   domain without hosting its mailbox. Check infrequent and seasonal senders.
3. Review the authoritative zone and provider settings, including existing
   SPF, DKIM, DMARC, MX, wildcard records, and subdomain delegations. Use
   authorized read-only access and privately reviewed message headers or
   provider logs. Do not publish credentials, message contents, personal
   addresses, or the private inventory in this repository.
4. Confirm DNS administration access and save the affected record sets and
   TTLs privately. Obtain explicit approval for the exact names, values, TTLs,
   mail-delivery consequences, verification messages, and rollback procedure.
   A prepared record table or PR is not permission to execute it.

If any use or access remains unknown, leave live DNS unchanged and request the
administrator's inventory. Do not infer inactivity from absent records or a
quiet reporting period.

### Exact records only for a confirmed no-mail domain

This proposal applies only after confirming that neither the apex nor its
subdomains send or receive mail and after approving the consequences.
Re-read DNS immediately before execution. If records or mail use differ from
the approved snapshot, stop and revise the proposal.

Add these three records to the existing authoritative zone with TTL **3600
seconds** each. Here `@` means `ncngmodelrailroad.org`; `_dmarc` means
`_dmarc.ncngmodelrailroad.org`.

| Type | Name | Value | Consequence |
|---|---|---|---|
| TXT | `@` | `v=spf1 -all` | SPF fails for every server using the apex as its SPF identity. |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject` | Requests rejection of mail whose visible From domain is the apex or a covered subdomain and which fails DMARC. |
| MX | `@` | `.` with priority `0` | Null MX explicitly declares that the apex accepts no mail. It can also cause outgoing mail using the apex in From or return-path to be rejected. |

Keep unrelated TXT, website A/AAAA/CNAME, verification, and delegation records
unchanged. Publish only one SPF policy per name and one DMARC policy at its
policy name. A null MX must be the only MX record at that name.

SPF and null MX do not inherit to subdomains. DMARC's `sp=reject` covers
subdomains subject to the parent's policy, but a subdomain's own DMARC policy
can override it. Inventory these exceptions rather than adding blanket wildcard
records. DMARC passes when either SPF or DKIM passes with alignment to the
visible From domain; `-all` alone does not force a DMARC failure if aligned
DKIM passes. Review any old sending authorizations, but do not remove keys or
provider settings without separate approval.

No report destination is proposed because none has been approved. These records
therefore do not provide aggregate DMARC reports.

### If legitimate mail exists

Do not apply the three-record no-mail proposal. Preserve receiving services and
forwarding. Null MX is inappropriate for domains used in From or return-path,
even if nobody reads mail at those domains.

Obtain the actual providers' SPF and DKIM requirements. Maintain a single
consolidated SPF policy at each sending identity, respect SPF's ten DNS-lookup
limit, and configure DKIM with alignment to the visible From domain. Do not add
guessed provider includes or impose strict alignment without testing each
sender, forwarding path, and mailing list.

A candidate starting record is TXT at `_dmarc` with value
`v=DMARC1; p=none; sp=none` and TTL 3600, subject to its own approval and review
of existing subdomain policies. This requests no DMARC enforcement and does not
block spoofing. Without a separately approved reporting destination it also
provides no aggregate visibility. Approve a reporting recipient and any required
external reporting authorization before adding `rua`; do not invent a report
mailbox or send reports to an unapproved service. Review representative traffic,
including infrequent sends, before separately approving quarantine or reject.
Exact provider records depend on the inventory and cannot yet be specified.

### Verification and rollback for an approved change

1. Before editing, recheck the delegation and save the exact existing affected
   TXT and MX records, TTLs, and absence of records where applicable. Also save
   the website's current DNS records for comparison. The dated observations
   above are not a substitute for this rollback snapshot.
2. After an approved change, query each current authoritative nameserver for
   the affected names. Require successful authoritative answers, the exact
   approved values, no duplicate policies, and only `0 .` for the no-mail MX
   proposal. Check unrelated website records against the snapshot as well.
3. Recheck through independent recursive resolvers after the previous positive
   and negative cache lifetimes and the new TTL have elapsed. Account for
   cached absence of records, not only the new TTL. If results disagree or
   return `SERVFAIL`, investigate before claiming protection is active.
4. With approval, use designated test recipients to exercise every legitimate
   sender, forwarder, and mailing-list path. Review the receiving system's
   Authentication-Results for aligned SPF or DKIM and DMARC success. For the
   no-mail configuration, test expected rejection only with approved accounts
   and recipients. DNS publication alone does not prove receiver enforcement.
5. If legitimate mail breaks or records differ from the approval, follow the
   approved rollback: restore only the affected record sets and TTLs from the
   snapshot, preserving unrelated changes. If concurrent edits affect the same
   records, stop and reconcile with the administrator. If the snapshot confirms
   the three records were absent, remove only those newly added records.
   Do not combine null MX with restored receiving MX records.
   Repeat authoritative, recursive, and approved delivery checks.

Example read-only queries for the delegation observed above:

```sh
dig ncngmodelrailroad.org NS +noall +comments +answer
for ns in ns23.domaincontrol.com ns24.domaincontrol.com; do
  dig @"$ns" ncngmodelrailroad.org TXT +norecurse +noall +comments +answer +authority
  dig @"$ns" _dmarc.ncngmodelrailroad.org TXT +norecurse +noall +comments +answer +authority
  dig @"$ns" ncngmodelrailroad.org MX +norecurse +noall +comments +answer +authority
done
```

Rollback is not immediate because DNS caches retain prior values. Rejected
messages may need to be resent; reverting DNS cannot recover them. Restoring
the observed absence of policies also restores the spoofing exposure.

DMARC reduces exact-domain spoofing at receivers that enforce it. It does not
prevent lookalike-domain scams, display-name impersonation, or misuse of a
compromised legitimate mailbox. Independently verify unusual payment or account
change requests through an established contact channel.

Protocol references: [SPF (RFC 7208)](https://www.rfc-editor.org/rfc/rfc7208.html),
[DMARC (RFC 7489)](https://www.rfc-editor.org/rfc/rfc7489.html), and
[null MX (RFC 7505)](https://www.rfc-editor.org/rfc/rfc7505.html).

## Images and fonts: only use what we have the right to

Stock-image and font "license enforcement" letters are a real cottage industry.
Avoid them entirely by only publishing media we can prove we may use:

- **Images:** use the museum's own photographs, public-domain images, or images
  with a clear license that permits website use. Do not paste images found
  through a search engine. Keep a note of where each image came from.
- **Fonts:** the site self-hosts open-license fonts (Libre Franklin and Archivo
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
