# Give, volunteer, and stay connected

Status: nonprofit identity, donation discovery, and a shorter email-inquiry page are implemented in this branch. Hosted checkout and new signup flows remain proposed. No service setup is authorized.

## Goal

Help someone support the layout, start volunteering, or join the appropriate
email group without guessing what to do next.

Keep the existing pages and visual style. Use plain links, the shared contact
card, and existing services where suitable. Add a payment provider only if
needed and approved. No new website accounts, forms, database, or tracking.

## The paths

| Intent | Website action | What happens next | Complete when |
| --- | --- | --- | --- |
| Give money | `/donate`: **Donate securely**, linking to hosted checkout once approved and ready. Until then, retain **Email about a contribution**. | The donor chooses an amount and pays without a required account. The provider confirms payment and emails a receipt. Keep email as a fallback, not a prerequisite. | Payment succeeds and is acknowledged. Reconcile payouts separately. An inquiry or button click is not a donation. |
| Volunteer | `/volunteer`: **Email about volunteering**. | A volunteer replies and arranges a first work session. Explain any confirmed membership requirements before attendance. | A first session is agreed. Count attendance separately. |
| Join the email group | `/donate`: **Join the email group**, only if the existing group accepts public requests. | Groups.io handles confirmation and any approval. For a members-only group, explain on `/volunteer` that access is arranged after approval; do not publish a public signup offer. | Subscription is confirmed and any required approval is complete. |
| Offer equipment | `/donate`: **Email about equipment**. | Ask for item type, scale, condition, photos, and collection/delivery needs. A volunteer confirms whether it can be accepted. | Acceptance and handoff are agreed. No unannounced drop-offs. |

There is no universal "Sign up" button. Email-group subscription, volunteer
interest, and club membership are separate. Never automatically subscribe
donors or people who contact the organization.

## Donor identity and tax status

The IRS California Exempt Organizations Business Master File, posted September 8,
2026 and consulted September 10, 2026, contains this matching record:

| Field | IRS record |
| --- | --- |
| Organization | NEVADA COUNTY NARROW GAUGE PROJECT, Nevada City, California |
| EIN | 68-0327319 |
| Federal exemption | Subsection 03: 501(c)(3); status 01: unconditional exemption |
| Contributions | Deductibility code 1: contributions are deductible, subject to applicable tax rules |
| Ruling date | April 2019. This is the recorded determination date, not the incorporation date. |

Sources: [IRS extract and posting date](https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf),
[California data](https://www.irs.gov/pub/irs-soi/eo_ca.csv), and
[IRS code definitions](https://www.irs.gov/pub/foia/ig/tege/eo-info.pdf).

Donation-page identity block, implemented from shared organization config:

> All-volunteer 501(c)(3) nonprofit. EIN: 68-0327319.
>
> IRS-listed name: Nevada County Narrow Gauge Project.
>
> Contributions are tax-deductible to the extent permitted by law.

The site footer shows the classification and EIN, linking to these details.
Organization metadata includes the EIN and the Schema.org 501(c)(3) status.
The public source link points to the IRS extract information page, not private
paperwork. Contributions start with an email inquiry; there is no online checkout.

`/llms.txt` and `/data/catalog.json` also expose the IRS identity, source date,
canonical donation page, and current email-inquiry method. The page, guide, and
catalog share their instructions and prefilled email link. These discovery aids
do not guarantee search rankings or AI recommendations. Crawler permissions
remain unchanged; no working payment endpoint is implied.

The donation page replaces seven cards and the generic closing pitch with a short
impact summary and plain volunteer/equipment links. Financial inquiries remain the
primary action, repeated at the end. The shared email link includes an editable
subject and message asking for current donation instructions, without a response-time
promise. The visible address remains available for people using webmail.

The volunteer page groups roles once and uses a three-line draft for name,
interests, and availability. Work-session confirmation, junior-member requirements,
school-visit guidance, and the existing photographs remain. The shared footer keeps
contact and policy links plus the EIN; full addresses live on Contact and event
listings stay on the homepage and Events page.

Contact keeps its email action and alternate contact methods together, followed by
addresses, directions, and visit/access guidance. The homepage links to donations
and volunteering from one short support section; event promotion remains unchanged.

Keep the IRS-listed name separate from the site's public-facing brand name. Before payment
onboarding, reconcile the exact legal spelling with the current California
record: the supplied original articles use "Narrow Guage," while the IRS uses
"Narrow Gauge." The articles identify entity 1548497 and carry a December 9,
1986 filing stamp; March 14, 2006 is the date certifying the copy, not incorporation.

California charity number CT066794 was supplied but has not been independently
checked against the current state registry. Historical state exemption paperwork
does not establish current registration or filing compliance. Keep private
document links, signatures, personal addresses, and account records out of the
website and repository. Do not turn historical filing instructions into a
current compliance claim.

## Donation checkout: recommended design

**Donate -> choose amount -> pay -> confirmation and emailed receipt.**

Proposed default: one Stripe Payment Link using **Customers choose what to pay**.
Existing payment-account availability is unknown. Reuse an organization-controlled
provider instead if it offers a suitable guest checkout and reduces setup work.
No provider selection or account creation is authorized by this specification.

- One-time contributions in USD. Proposed suggested amount: $25, freely editable.
  No recurring giving, campaign choices, or extra contribution prompts at launch.
- Accept cards, with Apple Pay and Google Pay where supported. Wallets and saved
  payment accounts are optional; ordinary card entry must remain available.
- Collect receipt email and provider-required payment details only. Do not add
  phone, shipping, membership, or mailing-list fields.
- Match the payment recipient to the EIN and reconciled legal name above.
  Enable automatic payment receipts and the provider's confirmation page.
  Use the approved charitable purpose and tax wording; do not promise a
  particular donor's tax outcome.
- Keep checkout hosted by the provider. Store only the public payment URL in
  site config: no API keys, embedded payment form, webhooks, or custom success page.

Stripe's published US standard domestic-card rate is **2.9% + $0.30** per
successful transaction, with no standard setup or monthly fee. Other payment
types and circumstances can cost more; confirm pricing before activation.
PayPal is an alternative if already operational, but its documentation says
guest checkout is not always offered.

**Ready to launch:** an authorized officer confirms eligibility, account control,
bank destination, receipts, refunds, and payout handling. Keep identity and bank
documents outside this repository. The checkout passes desktop and mobile test-mode
payments, confirmation, receipt, and cancel/retry checks without requiring a donor
account. Proposed usability target: a prepared donor completes checkout within
90 seconds, excluding bank-required authentication. No real charge for testing
without separate approval.

**Ongoing work:** review successful payments, fees, net payouts, and any refunds
or disputes in the provider dashboard. No manual thank-you is required to complete
the payment path. Website visits and link clicks are not donation counts.

Provider references: [Stripe setup and supported methods](https://docs.stripe.com/payment-links/create),
[confirmation and receipts](https://docs.stripe.com/payment-links/post-payment),
[pricing](https://stripe.com/pricing),
[donation requirements](https://support.stripe.com/questions/requirements-for-accepting-tips-or-donations),
and [PayPal guest-checkout limitations](https://www.paypal.com/us/cshelp/article/how-do-i-accept-cards-with-checkout-using-the-guest-checkout-option--help307).

## Small website changes

- Make the relevant action reachable within two link selections from the
  homepage. Keep the existing direct volunteer link.
- Show the email address and a prefilled volunteer template: name, interests,
  and availability. Explain that the visitor must send the email.
- Explain the volunteer sequence beside the action: email, reply, arranged
  first visit. Preserve the instruction to confirm work sessions before attending.
- State the email group's audience, whether approval is needed, and where to
  manage delivery or unsubscribe. Do not describe member discussion as a newsletter.
- Keep verified service URLs in shared config. Update privacy wording when a
  service is introduced. Correct documentation that still promises a signup form.
- Remove "temporarily unavailable" unless a restoration plan is confirmed.
  Describe the contribution method actually available.

## Launch conditions

| Need | Required decision |
| --- | --- |
| Follow-through | Confirm an inbox owner and backup. Use existing mailbox labels and saved replies, not a new CRM. |
| Groups.io | Confirm the exact group, audience, owner, joining settings, archive visibility, and approval process. Until then, publish no group link. |
| Payments | Use the IRS identity evidence above. Reconcile the legal spelling and confirm current state compliance, authorized recipient, account control, payment method, and receipt wording. Until ready, retain the email route. |
| Membership | Confirm requirements and who approves first visits. Do not invent dues, eligibility rules, or response promises. Preserve existing junior-member safeguards. |

## Measure only what matters

**Before release:** three people unfamiliar with the site can each find the
money, volunteer, and email-group path within 30 seconds and explain what
happens next. Where a service is unavailable, they can identify the stated
alternative. Email instructions remain usable without a configured mail app.

**Monthly:** use existing inbox, attendance, payment, and Groups.io records for
one private tally:

- Inquiries received; inquiries still awaiting a first reply after seven days.
- First volunteer visits arranged; first visits attended.
- Contributions received: count and total amount.
- Confirmed email-group joins; requests awaiting approval after seven days.

Proposed service target: no inquiry or join request waits more than seven days
for a first response. Owners must accept that target before it becomes a public
promise. The first month establishes a baseline; compare subsequent months
without treating page visits or clicks as completed actions.

Keep personal details out of the repository. No extra analytics provider,
subscription sync, custom checkout, member portal, or scheduling system.

## Delivery order

1. Clarify the existing email paths, volunteer next steps, and documentation.
2. Connect the existing Groups.io group after its settings and ownership are confirmed.
3. Add hosted donations after financial administration is ready. This can ship
   independently of Groups.io.
