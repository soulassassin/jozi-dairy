# Jozi Dairy CRM

A lead and contact manager for the sales team, served from the same Next.js app
as the public site at **`/crm`**.

## Setup (once)

1. Create `.env.local` in the project root — copy `.env.local.example`:

   ```
   CRM_PASSCODE=pick-a-team-passcode
   CRM_SESSION_SECRET=a-long-random-string-at-least-32-characters
   ```

   Generate a secret with:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. Restart the dev server (`npm run dev`) and open <http://localhost:3000/crm>.

Everyone shares the passcode and types **their own name** when signing in, so
every call and note is attributed on the lead's timeline. Sessions last 12
hours. Changing `CRM_SESSION_SECRET` signs everyone out.

## Where leads come from

| Source | How it arrives |
| --- | --- |
| **Website Quote Request** | The wholesale quote modal now posts to `/api/inquiries` before offering WhatsApp — the lead is captured even if the visitor never sends the message. |
| **Website Contact Form** | The department contact form does the same, and records which mailbox it was routed to. |
| **Phone Call** | Captured by hand with **New lead** — built to be filled in while on the call. Name plus a phone number is enough. |
| Email / WhatsApp / Walk-in / Referral | Captured by hand, tagged with the matching source. |

The visitor's enquiry text becomes the first entry on the lead's timeline, so
nothing is paraphrased away.

## Working a lead

Leads move through **New → Contacted → Qualified → Quote Sent → Won / Lost**.

Open any row to get the lead drawer, which gives you:

- One-tap **Call**, **WhatsApp** (pre-filled follow-up message) and **Email**.
- **Log a call or note** — pick the kind (called out, inbound call, WhatsApp,
  email, meeting, quote sent, note), write what was said, and set the next
  follow-up date.
- Status, owner, priority and estimated monthly value.
- The full history, newest first, with who logged each entry and when.

Two rules save manual status fiddling:

- Logging real contact on a **New** lead moves it to **Contacted**.
- Logging **Quote sent** moves an open lead to **Quote Sent**.

Closing a lead (Won or Lost) clears its follow-up date so it drops off the chase
list. Marking one **Lost** asks for a reason.

## Dashboard

The four tiles are clickable and filter the list below: **Open leads**,
**Follow-ups due** (today or overdue), **Unassigned**, and **Won**. The navy
strip shows open pipeline value and the count at each stage.

Filter by status, source, owner, or "Follow-ups due", and search across name,
business, phone, email, suburb and enquiry text.

## Contacts

The **Contacts** tab is a contact book built automatically from the leads:
one card per person, deduplicated on email address, otherwise phone number. It
shows how many enquiries they have made, whether any are open, and whether they
have become a customer.

## Duplicate handling

A repeat enquiry from the same email or phone number is appended to that
person's existing **open** lead rather than creating a second one, and the lead
is bumped to **High** priority — someone asking twice is worth chasing. A new
enquiry after a lead was Won or Lost starts a fresh lead, since that is genuinely
new business.

Phone numbers are compared digits-only, so `065 234 2460`, `0652342460` and
`+27 65 234 2460` are recognised as the same person.

## Export

**Export CSV** downloads every lead with its contact details, pipeline state,
owner, follow-up date and estimated value. It opens cleanly in Excel.

## Where the data lives

Leads are stored as JSON in **`data/crm.json`** (gitignored — it holds real
customer details). Writes are serialised and go through a temp file and rename,
so a crash mid-write cannot truncate the file.

Back it up by copying that file. Point `CRM_DATA_DIR` elsewhere to move it.

### Moving to Postgres later

The repo already has a Prisma schema (`prisma/schema.prisma`) with `Client` and
`CrmNote` models for the invoicing side. When you provision that database, only
`src/lib/crm/store.ts` needs rewriting — its `read()` and `mutate()` functions
are the only code that touches the filesystem. Everything above it (the service
layer, API routes and UI) is unchanged.

The file-backed store assumes a single server process. It suits one dairy office
on one deployment; it is not safe across multiple instances or serverless
functions, which is the point at which the Postgres swap becomes necessary.

## Security notes

- `/crm` and `/api/crm/*` reject anyone without a valid session cookie
  (HttpOnly, SameSite=Lax, Secure in production).
- `/crm` is excluded from `robots.txt` and marked `noindex`.
- The public `/api/inquiries` endpoint is rate-limited to 5 submissions per
  minute per IP and carries a honeypot field; it never returns internal lead
  data, only a reference number.
- The shared passcode is compared in constant time.

One shared passcode is the known limitation: it identifies the team, not the
individual, and attribution relies on people typing their own name honestly.
Per-user logins mean swapping `verifyPasscode` in `src/lib/crm/auth.ts` for a
lookup against the Prisma `User` table, which already has `passwordHash` and
`role` columns.
