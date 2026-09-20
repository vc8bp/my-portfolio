# ApplyCove

**Job application automation, built solo, end to end.**

ApplyCove applies to jobs on a candidate's behalf. It connects to the job boards
the candidate already uses, finds roles worth applying to, fills out the
application forms including the freeform screening questions, and submits. The
candidate watches it happen live and can take over the browser mid-run.

I built all of it: product, design, backend, frontend, browser extension,
scraping pipeline, infrastructure, and growth. 523 commits between 2 March and
2 September 2026, roughly 90,000 lines across seven applications, five shared
packages and one internal CLI in a pnpm monorepo.

---

## Headline

| | |
|---|---|
| Applications submitted through the platform | **100,158** |
| Screening questions auto-answered | **329,677** |
| Automation sessions run | 13,641 |
| Registered users | 1,702 |
| Free to paid conversion | **11.6%** |
| Paid acquisition spend | **Zero.** All organic and word of mouth. |

*(Production figures as of 16 August 2026.)*

---

## Resume-ready summary

- Designed and shipped a two-engine automation architecture: a server-side
  Puppeteer worker on ECS Fargate for authenticated job boards, and an in-browser
  Manifest V3 extension for five ATS platforms, chosen because running the apply
  loop in the candidate's own browser removes the anti-detection problem entirely.
- Built a three-tier answer resolution pipeline (deterministic regex matcher,
  pgvector semantic cache at 0.15 cosine distance, then a four-provider LLM
  cascade) so that the majority of the 329,677 questions answered never reached a
  model at all.
- Pushed concurrency control into Postgres rather than application locks: partial
  unique indexes, `SELECT ... FOR UPDATE SKIP LOCKED` job claiming, compare-and-swap
  idempotency on every payment settle path, and a PL/pgSQL trigger that settles
  runtime quota against a FIFO credit wallet.
- Wrote a job recommendation engine from scratch: Postgres full-text retrieval,
  two in-memory IDF passes over the candidate pool, a declarative scoring table
  with capped bands, company diversity with overflow backfill, and an asymmetric
  geography bar for auto-apply, all executed in a Piscina worker pool.
- Built six ATS scrapers covering 16,597 vendored tenant company lists, including
  a facet-subdivision strategy that works around Workday's hard 2,000-row query
  cap, feeding hash-gated bulk upserts that write only genuinely changed rows.
- Shipped live session streaming: the worker's X display is captured with ffmpeg
  x11grab into one-second HLS segments pushed to Cloudflare R2, progress events
  travel over MQTT on AWS IoT Core, and the user can seize the browser through a
  KasmVNC session tunnelled over cloudflared.
- Provisioned the infrastructure from scratch: a cloud-init template that turns a
  bare Debian box into an app host and registers it as its own GitHub Actions
  runner, blue-green deploys performed by rewriting the nginx upstream, and a
  self-hosted Redis with the plaintext port disabled entirely.
- Owned growth as an engineering surface: RFC 9110 content negotiation at the
  edge serving Markdown twins to AI crawlers, a generated `llms.txt`, 30 distinct
  schema.org entity types, and a 40-assertion conformance suite that gates deploys.

---

## Architecture

```
  Browser extension (MV3)          Dashboard (React 19)        Landing (Astro 7)
   - portal session sync            - live session view          Cloudflare Pages
   - in-browser ATS apply           - resume builder             static + edge fn
   - side panel orchestration       - kanban pipeline
          |                                |
          |  HTTPS                         |  HTTPS + WSS
          v                                v
   +--------------------------------------------------+
   |  API  (Express, Node cluster, VPS behind nginx)   |
   |  107 handlers, layered routes/controllers/services|
   +--------------------------------------------------+
        |            |              |            |
        |            |              |            +--> Redis (TLS only, self-hosted)
        |            |              +-----------------> Postgres (Prisma, pgvector,
        |            |                                   tsvector FTS, pg_trgm)
        |            +--> S3 (encrypted portal sessions, resumes)
        |
        +--> ECS Fargate RunTask  (primary)
             Cloud Run Jobs       (fallback)
                   |
                   v
          +---------------------------+
          |  Job worker (Puppeteer)   |----> MQTT / AWS IoT Core ----> Dashboard
          |  headed Chrome on Xvnc    |----> HLS segments -> R2 -----> Dashboard
          |                           |----> KasmVNC + cloudflared --> Dashboard
          +---------------------------+

  Scrapers (CLI, 6 ATS)  ---------------------------------------> Postgres
```

| App | LOC | What it is |
|---|---|---|
| `apps/frontend` | 39,020 | React 19 dashboard: live sessions, recommendations, resume builder, kanban, admin analytics |
| `apps/landingPage` | 23,605 | Astro 7 marketing site, blog, programmatic SEO pages, free ATS checker tools |
| `apps/api` | 12,419 | Express API, 107 handlers, 21 route mounts, all business logic |
| `apps/job-worker` | 8,983 | Puppeteer automation for authenticated job boards, runs one session per container |
| `apps/newExtention` | 3,879 | WXT + Preact Manifest V3 extension: session sync and in-browser ATS apply |
| `apps/jobScrappers` | 2,529 | Six ATS scrapers with normalisation and hash-gated upserts |
| `packages/*` | 2,590 | `database`, `qna`, `session-store`, `usage`, `email` |
| `tools/lead-mailer` | 385 | Crash-safe campaign mailer with per-campaign send ledgers |

The monorepo shares backend code only. Both frontends talk to the API purely over
HTTP and declare no workspace dependency, which is why they can sit on different
React majors and different deploy targets without coordination.

---

# Technical deep dive

## 1. API

`apps/api/src`, 120 files, 12,419 LOC, 107 HTTP handlers across 21 route mounts.
Layered as `routes -> middleware (validate / auth / rate limit) -> controllers ->
services -> @naukri/database`.

**The boot split is the part worth explaining.** `index.js` runs Node `cluster`
with one worker per CPU, but the primary process serves no HTTP at all. It only
forks workers and owns the four background cron loops, so a four-core box runs
the scheduler exactly once rather than four times. Workers gate `app.listen`
behind a raw `SELECT 1` probe and exit 1 on failure, so the load
balancer never routes to a worker that cannot reach the database.

Middleware ordering carries several deliberate decisions:

- `app.set('trust proxy', 2)`, a fixed hop count rather than `true`. Trusting all
  hops lets a client spoof `X-Forwarded-For` and walk straight past IP rate
  limiting. Two hops is exactly Cloudflare then nginx.
- Raw body carve-outs registered *before* `express.json` for both payment webhook
  paths, because HMAC is computed over the exact bytes and `JSON.parse` would
  mutate decimals.
- The Prometheus timing middleware labels by `req.route?.path || 'unmatched'`.
  The fallback is what stops a 404 scan from blowing up label cardinality.
- Rejected CORS origins return `cb(null, false)` rather than an error, because
  PayU's return is a cross-site form POST that CORS does not govern, and erroring
  would turn a successful payment into a 500.

`ApiError` carries an `isOperational` flag and a machine-readable `errorCode`
(`PHONE_REQUIRED`, `PAYMENTS_DISABLED`, `TERMS_REQUIRED`) so the frontend can
swap a toast for a modal without string-matching error messages. The error
handler unwraps `err.cause` before reporting to Sentry, so issues group by the
real stack rather than by the friendly wrapper.

## 2. Auth and security

**Hybrid token strategy.** The access token is a 30-minute HS256 JWT carrying an
`rtid` claim that binds it to the refresh-token row that minted it. The refresh
token is deliberately *not* a JWT: it is `crypto.randomBytes(32)` stored
SHA-256-hashed, in a cookie scoped to `path: '/v1/auth'` so it is never sent on
ordinary API calls.

Rotation is a single-use atomic claim, which is the fix for the concurrent
refresh race:

```js
const claimed = await prisma.refreshToken.deleteMany({
  where: { id: tokenRecord.id, revokedAt: null },
});
if (claimed.count === 0) throw new ApiError(401, 'Refresh token already consumed');
```

Two concurrent refreshes cannot both rotate, and it avoids a Prisma `P2025` from
deleting a row that just vanished. Live refresh tokens are capped at five per
user with oldest-evicted. `resetPassword` revokes all of them in one transaction;
`changePassword` revokes all except the session performing the change.

**Rate limiting** (`middlewares/rateLimiter.js`) is the most considered security
file in the repo. A custom `HybridStore` wraps `rate-limit-redis` with an
in-process failover: Redis is primary and shared across cluster workers, and on a
Redis error it trips a ten-second circuit, serves from memory, and half-opens
afterwards. It also pre-swallows the store's eager `SCRIPT LOAD` promises so a
boot-time Redis outage cannot trip the process-level `unhandledRejection` guard.
An outage degrades to per-worker limiting rather than 500-ing every route.

Key generation is per-limiter, not one size:

| Limiter | Window | Max | Key |
|---|---|---|---|
| `authLimiter` | 15 min | 10 | `ip|email` |
| `signupIpLimiter` | 24 h | 5 | IP |
| `sessionCreateLimiter` | 1 h | 10 | userId |
| `atsCheckLimiter` | 24 h | 8 | IP (each check costs one LLM parse) |
| `qnaBatchLimiter` | 1 h | async fn of plan | userId |

The composite `ip|email` key on auth is the interesting one: it bounds per-account
brute force from rotating IPs, and simultaneously stops a single IP from locking
out arbitrary accounts. `qnaBatchLimiter`'s max is an async function of the user's
plan, aligned with the IST-midnight daily cap so a legitimate full day's work done
in one sitting never trips the hourly burst limit.

**Anti-abuse at signup.** `canonicalizeEmail` collapses `+tag` for everyone, and
applies dot-stripping and the `googlemail.com` alias only for Gmail, because other
providers treat dots as significant. The canonical form has a unique constraint.
Beyond that, an extension install fingerprint and a `LockedAccount` claim on the
portal account identity (derived by decoding the portal's own JWT cookie) prevent
free-credit farming across throwaway signups.

RBAC re-reads role and `isActive` from the database on every admin request rather
than trusting a JWT claim, so demotion or deactivation takes effect immediately.
Admin impersonation mints real tokens for a target user but refuses to target
another admin and logs the actor-to-target pair.

Portal passwords are not stored at all. A migration explicitly dropped the column.
The product replays a browser session instead, which is covered in section 5.

## 3. Data layer

`packages/database`: Prisma 7.6 on PostgreSQL through the `@prisma/adapter-pg`
driver adapter rather than the Rust query engine's own pool. **27 models, 12 enums,
48 indexes, 53 migrations.**

**Index engineering with measured evidence.** The migration that added
`@@index([postedAt(sort: Desc)])` on `jobs` records the win in its own header: the
failing Sentry request went from 50,287 ms to 958 ms. It also documents why the
migration uses plain `CREATE INDEX IF NOT EXISTS` rather than `CONCURRENTLY`
(Prisma wraps migrations in a transaction), and why the row cost was so high in
the first place: `search_vector` averages 2.6 KB and is TOASTed for roughly 67% of
rows, so `ts_rank_cd` costs about 0.2 ms per row.

Other index work that Prisma alone cannot express:

- A **partial unique index** enforcing one active session per user, written as raw
  SQL because the predicate is not modelable:
  ```sql
  CREATE UNIQUE INDEX "sessions_one_active_per_user_idx"
    ON "sessions" ("userId")
    WHERE status IN ('PENDING', 'RUNNING') AND "executionType" <> 'EXTENSION';
  ```
  The application does not read-then-write to check. It creates the row and
  catches `P2002`. That is the entire concurrency control.
- A partial index on a pgvector column, restricted to rows where the embedding is
  not null.
- Operator-class indexes declared in Prisma: `text_pattern_ops` BTree on skills,
  and both a `gin_trgm_ops` GIN and a `text_pattern_ops` BTree on job titles.

**Raw SQL is first class.** `packages/database/{functions,triggers,indexes}/` are
applied by a dedicated script in dependency order and then verified by dumping
`pg_proc`, `pg_trigger` and `pg_indexes`. Two PL/pgSQL triggers live there:

1. `trg_jobs_search_vector` builds a weighted tsvector (title A, company and
   skills B, location C, description D) `BEFORE INSERT OR UPDATE`. It short
   circuits with `IS NOT DISTINCT FROM` across five columns when nothing indexed
   changed, so daily job re-lists do not recompute, and it HTML-strips and caps
   the description at 4,000 characters before indexing.
2. `trg_session_finalize_quota` settles runtime quota on the terminal status edge.
   The trigger's `WHEN` clause fires exactly once on the PENDING/RUNNING to
   terminal transition, which is why the function needs no double-charge guard.

**Autocomplete over real-world data volumes.** The lookup tables hold 156,603
skills and 73,906 job titles, seeded in 5,000-row batched multi-VALUES inserts.
The query itself documents a quality bug and its fix: bare trigram matching at the
0.3 default answered "react developer" with "rpg developer", so it became
substring OR similarity at 0.6, ranked by a four-tier CASE (exact, prefix,
substring, fuzzy) then by frequency, then similarity, then length.

## 4. Job orchestration and dispatch

A run is dispatched by launching a container, not by queueing a message.

`POST /v1/application/session` passes through
`verifyToken -> sessionCreateLimiter -> requireSessionAccess -> checkQuota -> validate`,
then the session row insert acts as the concurrency gate (catch `P2002`, return
409). Launch is **ECS Fargate `RunTask` as primary with Google Cloud Run Jobs as
fallback**, both injecting `SESSION_ID` as a container env override. `RunTask`
returns failures without throwing, so the response's `failures` array is logged
explicitly. If both providers fail, the session is flipped to `ABORTED` and both
errors go to Sentry with distinguishing `source` tags. In development the same
code path runs `docker compose run --rm` locally instead.

**Scheduled automations** use the standard Postgres queue idiom, correctly:

```sql
UPDATE automations SET locked_until = now() + interval '5 minutes'
WHERE id = (SELECT id FROM automations WHERE ... FOR UPDATE SKIP LOCKED LIMIT 1)
RETURNING *;
```

Safe across replicas, with a five-minute lease and a `running` boolean guarding
overlapping ticks. The `fire()` path handles four distinct outcomes, each written
as an `AutomationRun` audit row: subscription lapsed (auto-pause the automation),
a worker session already running (skip, reschedule, email the user), a `P2002`
race with a manual start (recorded as exactly that), and an exception (five-minute
backoff so a poison automation cannot hot-loop). Both notification emails are
fire-and-forget specifically so SMTP latency does not hold the automation lock.
Next-run computation iterates up to eight days in the user's own timezone via
luxon and returns UTC.

**Four background loops**, all confined to the cluster primary, all wrapped in
`Sentry.withMonitor` with explicit miss and overrun thresholds:

| Loop | Interval | Job |
|---|---|---|
| Pending session recovery | 60 s | `PENDING` older than 5 min becomes `FAILED` |
| Orphan session reaper | 5 min | `RUNNING` older than 2 h becomes `ABORTED` |
| Automation scheduler | 60 s | Claim and fire due automations |
| Recommendation reaper | 1 h | Delete expired recommendation rows |

Cron traces sample at 100% while regular requests sample at 10%, expressed as a
`tracesSampler` reading a custom span attribute. That is a deliberate cost and
visibility trade: the loops are rare and high-consequence, the requests are not.

**Piscina worker pool** for recommendation scoring, tuned to avoid the usual
failure modes: `minThreads: 0` so an idle API spawns no threads,
`maxThreads: cpus - 1` so a core is left for the event loop, and `maxQueue: 200`
so the pool sheds load rather than queueing unboundedly. The worker entry is three
lines and imports only a pure scoring module whose header contract forbids
side-effectful imports, so a spawned thread never opens a Prisma or Redis
connection. On pool failure the caller runs the identical function inline.

## 5. Browser automation engine

`apps/job-worker`, 8,983 LOC. One container per session, headed Chrome on an Xvnc
display at a hard-pinned 1920x1080.

**The stack, and what each piece is actually for:**

- `rebrowser-puppeteer-core` as the base driver rather than stock `puppeteer-core`,
  activated by `REBROWSER_PATCHES_RUNTIME_FIX_MODE=addBinding` set in the
  Dockerfile. It patches the `Runtime.enable` CDP leak by lazily re-creating
  contexts via `addBinding`, so `page.evaluate` keeps working without the eager,
  detectable call.
- `puppeteer-extra` via `addExtra()`, which exists precisely so a third-party core
  can be plugged into the plugin system.
- The stealth evasion bundle, removed once and deliberately re-added. The commit
  message is the record: re-enable stealth evasions so LinkedIn stops revoking
  synced sessions.
- 30 Chrome launch flags, each with a reason. Including a removed one documented
  in place: `--memory-pressure-off` was taken out because on a memory-capped
  container it stops Chrome responding to pressure, so caches never get trimmed
  and RSS climbs until the cgroup OOM killer reaps the renderer.

**The anti-detection strategy is identity replay, not IP rotation.** There is no
proxy rotation anywhere in the worker, and the viewport and user agent are not
randomised. They are replayed. The extension captures the candidate's real browser
identity inside their live portal tab, including high-entropy user agent client
hints, timezone, locale, localStorage and sessionStorage, and the worker applies
that identity before the first navigation, seeding storage via
`evaluateOnNewDocument` so it exists before the site's own scripts boot. The
reasoning is written where it belongs, in the extension: cookies alone arrive on
the worker attached to a different user agent and empty storage, and the portal
scores that mismatch and revokes the session.

Human-behaviour modelling sits on top: bezier cursor paths with hesitation,
character-by-character typing with jitter and a 10% chance of a 200 to 600 ms
micro-pause, mouse keep-alive during long waits, a shuffled hover pass over page
elements, a 12 to 20 second dwell with scroll bursts before clicking Apply, and a
global `delay()` that multiplies every timeout in the codebase by `0.85 + rand*0.3`
so nothing in the system ever fires on a round number.

**Captcha handling** covers seven challenge families across 28 selectors, ordered
so that reCAPTCHA v3 is checked first, because its loader script query string is
the only marker distinguishing v3 from v2-invisible: both render the same anchor
iframe. Arkose FunCaptcha is implemented from scratch because the plugin does not
support it, including walking same-origin iframes to find the token, and parsing
the pipe-delimited `fc-token` with `indexOf('=')` rather than `split('=')` so
base64 blobs containing `=` survive. There is a dedicated smoke test that drives
six live demo pages and prints a detection-versus-expected table.

**The live-user rescue path** is my favourite piece of the worker. If a stored
session turns out to be dead, the worker publishes an MQTT ping and waits six
seconds for a pong. If the user is actually watching the live stream, it navigates
to the login page, hands them control of the real browser for up to five minutes,
waits for them to finish, re-verifies, and on success persists the fresh cookies
back to S3 and clears the expiry flag. Only if they are offline does it expire the
session and send the reconnect email.

**Reliability.** Every loop is bounded, and the bounds are written down: 30 wizard
steps on LinkedIn, two validation retries per step, three navigation attempts with
a fresh tab each, three crash reloads with 2s/5s/10s backoff, a
`MAX_SAME_QUESTION = 3` guard that catches a chatbot silently rejecting an answer.
Crash recovery solves a genuinely subtle problem, stated in its own header: the
renderer can die in two ways, either Chrome emits `page.on('error')`, or an
in-flight `page.evaluate` rejects with a crash-symptom error that never reaches
the error listener and unwinds to the top-level catch, aborting the session before
the async reload finishes. A single shared recovery promise dedupes both surfaces.

Memory telemetry reads **cgroup** memory rather than `process.memoryUsage()`,
because the OOM killer watches cgroup memory, not Node's RSS, and that is the
number that matters on Fargate. It handles cgroup v2's `"max"` string and v1's
`~9.2e18` no-limit sentinel.

Graceful shutdown funnels `SIGTERM`, `SIGINT`, `uncaughtException` and
`unhandledRejection` into one handler that ends the session as `ABORTED` before
teardown, and teardown is ordered deliberately: stop the tunnel, stop ffmpeg so it
flushes and appends `#EXT-X-ENDLIST`, run a final chunk sync so the last segment
and terminated playlist reach R2, close the browser, disconnect Prisma. The
Docker healthcheck probes the X display rather than the Node process, because the
whole stack depends on it.

## 6. In-browser ATS engine

`apps/newExtention`: WXT, Manifest V3, Preact, 3,879 LOC.

The architectural decision here is the interesting one. Rather than extending the
server-side worker to cover ATS forms, the apply loop moved into the candidate's
own browser. The orchestrator header states it plainly: real browser, real IP,
real cookies, so no anti-detection is needed at all. The extension holds the API
auth in the background service worker and streams progress to a side panel.

**Five ATS appliers**, each a runtime-injected content script (not auto-injected)
exporting the same five-function interface onto `window.__applycove`:
`{ enumerate, fill, clickSubmit, outcome, blocked }`.

| ATS | LOC | Apply URL rule |
|---|---|---|
| Greenhouse | 352 | posting page as-is |
| Lever | 155 | append `/apply` |
| Ashby | 171 | append `/application` |
| Rippling | 398 | append `/apply` |
| iCIMS | 404 | strip query string |

**The orchestration model is thin-orchestrator, fat-adapter.** The background
worker knows nothing ATS-specific except the URL rule and which platforms need
all-frames injection. Per job it runs a bounded eight-page walk: inject, check
`blocked()`, `enumerate()`, filter to unanswered non-file fields, make **one
batched API call** for the entire page's questions, `fill()`, then submit and
confirm. Multi-frame results collapse in one line: with `allFrames: true`, take
the first non-null result, because only the frame that owns the page returns one.

Three mechanics worth naming:

- **The pending-select second pass.** Some selects are taxonomy-bound (Greenhouse
  School, Degree, Discipline) where a typed answer dead-ends. The filler trims the
  query until live options surface, returns them as pending, and the orchestrator
  asks the same model route to pick from that live option list. Greenhouse matches
  a prefix of the official name, so the trimming drops one trailing *word* at a
  time rather than one character, which is fewer round trips and stops before
  matching unrelated two-character junk.
- **Two rounds of error repair.** On a failed submit, the per-field error map is
  scraped and each failing field is re-asked with the form's own validation
  message fed back in as context.
- **Confirmation polls sixteen times at one-second intervals and re-injects the
  applier on every single poll**, because Greenhouse and Lever navigate to a
  confirmation page, which is a new document with no content script. That is the
  kind of detail that only comes out of live debugging.

**The hardest adapter is iCIMS**, which nests cross-origin iframes behind a forced
account gate. The applier is injected into every frame and each instance
self-assigns one of four roles: `shell` (inert), `content` (drives the flow),
`iform` (a cross-origin self-identification form), and `auth` (signs back in).
Step detection reads iCIMS' own `dataLayer` literal out of the document HTML with
a regex, and a page signature stashed in `sessionStorage` is what lets the frame
report "this is a new page of the same application" so the outer loop advances
without knowing anything about iCIMS. The Auth0 handling includes a decoy-input
defence: Auth0's identifier screen carries a hidden password input for password
managers, and typing into it filled nothing visible and submitted the form with an
empty username, so only visible boxes count.

**Rippling** has the best cost decision in the codebase. Rippling parses the CV
server-side and autofills what it finds, so the resume is uploaded during
`enumerate` rather than during `fill`. Those answers are then already in the DOM
when the scan runs, and the scan flags them as prefilled and never pays a model to
reproduce what the parser just supplied.

**Lever's** hard problem is a single function whose comment is a complete debugging
log: setting `.value` directly gets cleared by Lever's handler, a plain character
loop loses characters, and what actually works is native insertion via
`execCommand insertText` plus per-character keydown/keyup to fire the geocode,
after priming a throwaway character and absorbing Lever's one-time field reset.

MV3 service worker survival is handled on both ends: the panel pings every 20
seconds (under the 30-second idle timeout), the orchestrator's ping handler is a
documented no-op whose only purpose is resetting that timer, and conversely a
panel disconnect cancels the run, because with no panel there is no way to drive
manual steps and the run would keep opening tabs headlessly.

## 7. The AI layer

The design goal was to answer 329,677 screening questions without paying for
329,677 model calls.

**Tier 1, deterministic.** A pure regex matcher covering roughly 30 context-free
facts: name, contact, links, location, current role and company, experience,
compensation, education, notice period. It returns `null` and defers to the model
for anything requiring judgment, and it hard-refuses questions about other people
(emergency contact, referrer, manager, spouse, guardian, beneficiary, recruiter)
as the very first thing it does. Rule ordering matters and is documented: the
`serving notice` test sits before the generic `notice` test so the period number
does not shadow the yes/no question. It returns `null` immediately when options
are present, because dropdowns always go to the model.

**Tier 2, semantic cache on pgvector.** Questions are embedded with
`text-embedding-3-small` (three retries, 1s/2s/4s backoff) and matched against the
user's own prior answers at a cosine distance under 0.15, scoped per user. So
"What is your notice period?" hits the entry saved for "Notice period (in days)?".
Answers are upserted on `(userId, question)` with the vector written by a separate
raw query, because Prisma cannot type a `vector` column.

**Tier 3, a four-provider cascade**, trying the next provider on a throw *or* on
empty output, and skipping providers with no configured key:

| Order | Provider | Model |
|---|---|---|
| 1 | OpenAI | `gpt-5-nano`, `reasoning_effort: 'minimal'` |
| 2 | Gemini | `gemini-flash-lite-latest` |
| 3 | Groq | `llama-3.1-8b-instant` |
| 4 | OpenRouter | `meta-llama/llama-3.3-70b-instruct:free` |

`gpt-5-nano` needs its own call shape, and the code says why: it rejects
`temperature` and `max_tokens` and takes `max_completion_tokens` plus
`reasoning_effort` instead.

**Structured output with a validation predicate.** `completeJson()` sets the
provider-appropriate JSON mode, extracts the object (stripping fences, slicing
first `{` to last `}`), and then runs a **caller-supplied `validate(parsed)`
predicate**. A provider that returns valid-but-incomplete JSON is rejected and the
next provider is tried. That single hook is what makes a multi-provider cascade
safe for structured output rather than just for text.

**Prompt engineering against reasoning leakage.** The system prompt opens with an
`OUTPUT FORMAT (HIGHEST PRIORITY, OVERRIDES EVERYTHING BELOW)` block that names the
exact tokens to avoid ("However", "Reason", "Note", "Answer:"), then encodes domain
rules the platforms actually need: LPA versus rupees versus monthly salary
conversion with an explicit do-not-multiply-twice guard, a date-direction rule
(start year is always less than or equal to end year, never reverse this), and a
rule that "Resume Attached" is only ever valid for an actual file upload prompt.

Option-bound questions never trust the model blindly: the answer is validated
against the real option list and falls back to the first option if invalid, and
multi-select output is parsed from JSON array, comma list, or bare string forms.
Date questions bypass the cache entirely, because a date is relative to today and
a stored value goes stale.

**Cost metering as a product feature.** AI credits are weighted per endpoint by
relative token cost (`bullets: 1, summary: 1, tailor: 3, parse: 5`), calibrated so
one credit is roughly $0.0004 of Gemini Flash-Lite. The daily budget resets on read
inside a transaction, with no cron and no TTL key, and the code explicitly accepts
the race: under heavy concurrency the read-modify-write can overspend by about one
call, which is fine for click-paced AI, so no row lock. Credits are charged before
the call, so a failed call still costs, which is the correct incentive.

The public ATS resume checker makes exactly **one** LLM call, for the resume-to-
structured parse. Everything after that is deterministic: seven weighted categories
summing to 100, each check scored pass/warn/fail, and each emitting the number of
points recoverable by fixing it. The job-description match score is kept as a
separate number because the overall score stays JD-blind on purpose.

## 8. Recommendation engine

Two files: a 536-line service holding all I/O, and a 583-line pure scoring module
with a 310-line `node:test` suite that asserts *relative ordering* rather than
point values, so the scoring knobs can be tuned without rewriting tests.

**Stage 1, retrieval.** Up to 25 role terms are OR-joined into a
`websearch_to_tsquery` and ranked with `ts_rank_cd` against the GIN-indexed
tsvector, pulling a 300-row candidate pool. Skills are deliberately excluded from
retrieval, with the reason stated: a marketing job that names AWS and Python should
not be retrieved as a software role. Skills are only used as a fallback when a
profile has no role terms at all.

The SQL pre-filters carry an explicit stated invariant: every inclusion predicate
in the query is a superset of, or at least as permissive as, its code-level gate.
Hard exclusions are safe to be stricter in either layer. That invariant is what
makes it safe to have both a recall filter and a scoring gate without them
silently disagreeing. Geography matching uses Postgres word boundaries with regex
metacharacters escaped, so "Indianapolis, USA" cannot match a preferred location
of "india".

**Stage 2, scoring in a worker thread.** Two IDF passes are computed over the
300-row pool in memory, with no schema, no extra query and no cache:

```js
idf.set(t, Math.log(1 + n / (df + 1)));  // +1 smoothing: a token in every title still weighs > 0
```

The rationale is concrete. A profile built from "Application Support Engineer"
should not reward every job whose title ends in "Engineer", because "engineer"
appears in nearly every title. "Support" is the discriminating token, and IDF over
the live pool is what finds that automatically rather than by a hand-maintained
stop word list. A second pass does the same over title, description and skills,
pre-lowercasing each candidate once rather than once per skill.

Scoring is a declarative array of `{points, signal}` rules, where each rule can
also emit a human-readable explanation stored on the recommendation row:

| Band | Cap |
|---|---|
| Required skills, IDF weighted by proficiency | +55 |
| Secondary resume-parsed skills | +15 |
| Title match, IDF weighted | +35 |
| Experience range overlap | +8 |
| Recency, graded decay rather than a flat window | +5 |
| Place fit | +8 / -40 |
| Seniority gap | up to -40 |
| Blacklisted keywords / skills / company | -120 / -75 / -1000 |

The caps are ordered deliberately so the skill band always outranks the title
band. User tuning applies multipliers to the two bands rather than exposing raw
weights.

Penalties are **soft sinks, not filters**, and the reason is written down: an
over-narrow keyword set never empties the feed, the non-matching jobs just
resurface at the bottom. Salary comparison happens in a common base via a static
FX table and a period-to-annual table, with a plausibility band of 100,000 to 1e9
so a mislabeled unit (an annual figure stored in lakhs) is treated as unknown
rather than used to gate a job out. Whole-word matching uses lookbehind and
lookahead with a substring fallback, specifically so "react" does not match
"reactor" and "go" does not match "google".

**Stage 3, gating and diversity.** Company diversity caps three roles per employer
while filling the target count, but holds the over-cap remainder in an overflow
array and backfills from it if the pool is too company-thin, so diversity never
shrinks the feed. Blank company names bucket under a sentinel so unknown employers
are capped too.

The auto-apply bar is **asymmetric on purpose**:

```js
const geoStore  = localGeo || remoteOk || !hasGeo;  // browsing: unknown geography allowed
const geoAutoOk = localGeo || remoteOk;             // auto-apply: unknown geography NOT allowed
```

Auto-apply is irreversible, so it requires certain geography and positive net
evidence, while browsing stays permissive. The service stores twice the tier limit
and pre-selects only those that clear the auto-apply bar, with a comment that
fewer than the limit pre-selected is the correct outcome and selection must never
be padded by rank alone.

Recommendation sets expire at the **next IST midnight**, not at now plus 24 hours,
so a set generated at 11pm dies at midnight and regenerates the next day, matching
what the word "daily" means to the user. Generation is guarded by a Redis lock
that re-checks freshness inside the lock, and Redis being down sets the lock as
held, because the lock is an optimisation and not a correctness requirement.

## 9. Scraping pipeline

Six ATS scrapers over **16,597 vendored tenant company lists**: Greenhouse 5,002,
Ashby 3,573, Workday 2,605, Lever 2,129, Rippling 1,924, iCIMS 1,364.

**The hard problem is Workday's 2,000-row cap**, and the file states it precisely:
the API caps `limit` at 20 per page, caps the reported total at 2,000 per query,
and past offset 2,000 it silently loops back to page one, so a naive scraper can
never collect more than 2,000 from a single query. The solution subdivides by the
`jobFamilyGroup` facet, then `timeType`, then `locations`, then `workerSubType`.
Each filtered query has its own 2,000 cap and the union covers the full set, and
because every response's `facets` field carries each value's true count, the
subdivision can be planned without probe requests. Recursion is capped at depth 4,
noted as sufficient to cover Accenture.

**Change detection** is hash-gated bulk upsert, one statement per 1,000-row chunk:

```sql
INSERT INTO jobs (...) VALUES (...)
ON CONFLICT ("portalJobId", "platformId") DO UPDATE SET ..., "updatedAt" = now()
WHERE jobs."contentHash" IS DISTINCT FROM EXCLUDED."contentHash"
   OR (jobs.metadata->>'expired') = 'true'
RETURNING (xmax = 0) AS inserted;
```

`xmax = 0` distinguishes insert from update in a single round trip. The chunk size
keeps the statement under Postgres' 65,535 parameter limit. The `expired` clause is
a subtle correctness fix: a posting that reappears with byte-identical content must
still lose its expired flag.

The content hash deliberately excludes `posted_at`, and the reason is worth
quoting in substance: `posted_at` is posting identity rather than editable content,
and Workday derives it from a relative label that drifts about a day per run, which
would otherwise flag every Workday job as changed every single day.

The expiry sweep soft-flags jobs not seen in a run rather than deleting them, so
application foreign keys and user history survive, and it is guarded so that a
broken fetch cannot mass-expire an entire company.

**Country resolution with zero network calls**, using GeoNames city data and ISO
country codes. The disambiguation order is the design: structured hint, then city
(disambiguated by population), then country name, then US state, then null. Bare
two-letter tokens are only trusted from structured hints, because free text "CA"
could be California or Canada and "IN" could be India or Indiana. A small alias
table patches GeoNames' official-name-only coverage (bangalore, bombay, calcutta,
madras, gurgaon) and explicitly fills gaps without overriding the dataset.

The batch runner uses **two-level concurrency chosen by host topology**: iCIMS and
Workday process several companies at once because each tenant is its own host, and
the shared-API providers stay sequential because they all hit one host. Runs are
resumable through a per-day ledger that is appended to only *after* rows are
committed, so a mid-run crash never marks a company done with its jobs unwritten.

## 10. Dashboard

`apps/frontend`: React 19, Vite 7, Tailwind 4, 308 files, 39,020 LOC, 38 routes.

**React Compiler is enabled**, so most memoisation is automatic rather than
hand-written. Code splitting is by dependency weight with the reasoning in the
file: the resume builder pulls in react-pdf, pdfjs, tiptap and dnd-kit, and the
admin area pulls in recharts and tanstack table, so both are lazy and stay out of
the main bundle. Eleven lazy boundaries in total.

**Stale-chunk recovery**, a problem every deployed SPA has and most ignore. A
deploy invalidates hashed chunks and an open tab then fails to load one on
navigation:

```js
window.addEventListener('vite:preloadError', () => {
  if (Date.now() - Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0) < 60_000) return;
  sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  window.location.reload();
});
```

The 60-second guard is what prevents a reload loop when the chunk is genuinely
gone. Paired with a per-build id emitted as a `version.json` asset, which drives an
in-app "new version available" prompt.

**Single-flight token refresh** in the axios layer: an `isRefreshing` flag plus a
pending queue, a `_retry` marker to prevent loops, and queue resolve/reject on
completion, so ten concurrent 401s produce one refresh call rather than ten.

**Fractional indexing for the kanban pipeline.** Reordering a card writes one row,
not N. `generateKeyBetween(prev, next)` produces a sortable string between the
neighbours, so reordering in an 80-card column costs a single PATCH. It degrades
carefully too: the key generation has a triple fallback because it throws on
malformed or equal keys, and neighbours are scanned outward so cards with no key
yet do not break the interpolation. Every mutation is optimistic with a snapshot
taken on drag start and restored on rejection.

**Resume builder.** Five PDF archetypes combined into ten named templates across
fourteen sections, with the document rendered to a Blob once and shared by both the
live preview and the export button so they are byte-identical by construction. The
hard-won detail is font registration: react-pdf cannot resolve weights when only
`fontFamily` is set, so each face is registered under its own family name, and
every registration is individually wrapped so one failed CDN fetch degrades to
Helvetica rather than killing PDF generation. The editor's undo stack lives in a
Redux slice with keystroke coalescing: a continuous burst of edits to the same
field within 600 ms collapses into one undo entry, while still bumping the
timestamp so the live preview keeps re-rendering as you type.

**Live session view.** The MQTT hook connects to AWS IoT Core over WSS with a
presigned URL fetched fresh on every connect, and mqtt.js's built-in reconnect is
disabled on purpose, because reconnecting would reuse the now-expired signed URL.
On connect it immediately requests current state so a mid-session page refresh
rehydrates. The worker pings and the browser pongs, which is how the backend
detects an abandoned session. The video is HLS with two configs: live mode tunes
for latency, replay mode uses defaults, with exponential backoff over eight
retries and a native Safari fallback. Application rows stream in and are rendered
through `react-window`, because an unvirtualised live feed of hundreds of rows
janks the whole page.

**Analytics with intent.** One `sendEvent` API fans out to GA4 and PostHog, with
20 distinct event names across 42 call sites. PostHog is configured as
explicit-events-only, with every web-analytics default turned off and a reason on
each line, so it serves as session replay and funnels while GA4 owns pageviews.
Attribution is captured before the router mounts, because React Router rewrites
the location as soon as it takes over. The refresh call on app open doubles as the
daily-active signal, with the comment explaining why: 30-day sessions mean login
events are rare, so app open is the real signal.

Two error boundaries exist deliberately. The classic class boundary wraps the
router, and a second route-level one exists because React Router v7 catches errors
thrown while rendering a route element and renders the nearest `errorElement`
instead of re-throwing, so the app-level boundary outside the provider never sees
them. Both render inline-styled fallbacks, so a broken CSS bundle cannot break the
error page.

## 11. Landing page and growth engineering

`apps/landingPage`: Astro 7, static output, 91 built routes (32 hand-written pages,
20 programmatic, 40 blog posts), 23,605 LOC, deployed to Cloudflare Pages.

**The standout piece is AI-crawler content negotiation at the edge.** The site
implements acceptmarkdown.com negotiation with an RFC 9110 section 12.5.1 Accept
parser written from scratch: media-range specificity scoring, q-value clamping,
`q=0` meaning not-acceptable, and malformed q values ignored rather than treated as
rejection. Markdown wins only when *strictly* preferred, which is the key design
choice: a bare `*/*` (curl's default) scores both equally and therefore still gets
HTML, keeping browsers, Googlebot and every existing scraper on exactly the
response they already get. No positive quality for either produces a real 406.

The negotiated Markdown is served at the canonical URL with `Vary: Accept` so a CDN
cannot hand an agent the cached HTML variant, while the raw `.md` path carries
`X-Robots-Tag: noindex` so the twin cannot compete with the canonical URL in
search. HTML responses advertise the twin with a `Link: rel="alternate"` header.
404s are agent-aware: a request that names `text/html` itself gets the designed
404 page, a script gets a short Markdown page linking the sitemap, `llms.txt`,
home, pricing and blog. The whole middleware fails open, because a bug in
negotiation must never take the site down.

The Markdown twins are **generated at build time** from the built HTML rather than
hand-authored, with the reason stated: there are 84 pages and hand-written twins go
stale silently. `llms.txt` is generated rather than static for the same reason, and
the comment names the bug it fixed: the old static file listed three of eight posts.
It also injects live plan numbers from the API at build time and pulls
comparison-tagged posts into their own heading, so AI engines answering
"alternatives to X" queries find them under the heading they are looking for.

**Structured data**: 30 distinct schema.org `@type`s, with the entity graph
centralised and `@id` discipline enforced by comment ("One node only: pages must
not emit a second Organization with this @id"), and a rule that `sameAs` only
carries verified public profiles, because a `sameAs` pointing at a page that does
not exist is a broken entity claim rather than a weak one.

**A redirect fix with measured evidence.** Cloudflare Pages' automatic no-slash to
slash redirect is a 307, which tells Google to keep the no-slash URL indexed, so
two URLs rank and split link equity. Search Console confirmed it: the no-slash
variant of one page was indexed separately at 184 impressions. Replaced with an
explicit 301, gated behind an existence probe so a genuinely dead path returns a
clean 404 rather than a redirect that lands on a 404.

**Two opposite build-time failure policies, each justified.** The plans fetch
throws on failure so a bad deploy fails the build instead of shipping empty
pricing. The stats fetch never throws and falls back to hardcoded values, because
a missing counter should not block a deploy.

**A 40-assertion conformance suite** (`verify-agent-readiness.mjs`) runs real HTTP
requests against a local Pages dev server or production, covering agent-friendly
404s, content negotiation, redirects, machine-readable files, structured data,
security headers and asset caching. Its rationale: unit tests cover the decisions,
this covers the wiring, and only a real request can prove the wiring.

Build-time asset work removes third-party dependencies from the critical path: nine
avatar SVGs and fourteen emoji assets are downloaded at build rather than requested
at runtime, so they participate in the site's own one-year immutable cache headers
instead of costing 21 third-party requests per page load.

## 12. Infrastructure and delivery

**`infra/cloud-init/vps-init.yml.tpl`** takes a bare Debian box to a deployable app
host with no manual steps: installs Docker CE properly (keyring, deb822 sources,
runtime-interpolated codename and architecture), writes the nginx reverse proxy
vhost with WebSocket upgrade headers and a 50 MB body limit, clones the repo, and
**downloads and registers a self-hosted GitHub Actions runner**, architecture
detected, unattended, installed as a service. The machine registers itself as its
own CI runner at first boot, which is what makes the deploy workflow's
`runs-on: self-hosted` work without any separate provisioning step.

**Blue-green deploys on a single box**, performed by rewriting the nginx upstream:

1. Build the image, start `api-staging` on port 3001, poll `/health` 30 times at
   2-second intervals, dumping container logs and cleaning up on timeout.
2. `sed` the nginx `proxy_pass` to 3001, `nginx -t`, reload. Traffic is now on
   staging.
3. Kill `api-prod`, re-run the same image on 3000, health-poll 15 times.
4. Flip nginx back to 3000, verify, prune images older than 48 hours.

Plus an `if: failure()` rollback that removes staging and restores the original
upstream. Concurrency is set to queue deploys rather than cancel in-progress ones,
because cancelling mid-flip would leave nginx pointing at a dead container.

**Self-hosted Redis, TLS only.** The compose file sets `--port 0`, which disables
the plaintext port entirely, leaving only `--tls-port 6380`. AOF persistence,
password auth, a TLS-aware healthcheck, and UFW allowing only 22, 80 and 6380. The
design constraint is that the API runs on a VPS while job workers run on Fargate,
so Redis has to be reachable over the public internet: TLS-only with AUTH behind a
pinholed port is the answer, rather than a Docker network that cannot span them.
The self-signed certificate is the acknowledged trade-off, documented in the README
rather than hidden, along with cert rotation and password rotation runbooks and a
six-row troubleshooting table encoding every failure actually hit, including the
one-line fix for a restart loop caused by the container's UID 999 being unable to
read the key file.

**Encrypted portal session storage** (`packages/session-store`). AES-256-GCM,
authenticated rather than merely confidential, with fail-fast key validation at
module load, a random IV per encryption, and a three-part format that `decrypt`
rejects if it is not exactly three parts. The auth tag is verified on read, so a
tampered blob throws rather than decrypting to garbage.

The non-obvious engineering there is cookie normalisation at write time. Cookies
arrive from two incompatible sources: Puppeteer's `page.cookies()` (PascalCase
sameSite, numeric `expires`) and Chrome's extension API (lowercase sameSite,
`expirationDate`). A mapping table and a coalesce convert both into the exact shape
`page.setCookie` expects, once, at save time, so the worker needs no adapter at
all. Error posture differs per operation on purpose: a load failure returns null
because a missing session is a normal state rather than an incident, while a delete
failure throws, because S3 delete is idempotent so a thrown error means a genuine
auth or network problem that must surface.

---

## Cross-cutting engineering themes

**Concurrency lives in Postgres.** One active session per user is a partial unique
index. Automation claiming is `FOR UPDATE SKIP LOCKED`. Payment settling is a
compare-and-swap `updateMany` on `status: 'PENDING'` where only the winner performs
the side effect. Refresh rotation is a conditional `deleteMany`. One-time free
credit grants are a conditional `updateMany`. Double review-invite prevention is a
unique constraint. The one application-level lock in the system, a Redis lock
around recommendation generation, is explicitly documented as an optimisation that
is safe to lose.

**Every Redis dependency fails open, in a named way.** Rate limiting falls back to
a per-worker memory store through a circuit breaker. The plan cache falls back to
the database. The response cache skips. The recommendation lock proceeds. The regen
cooldown does not block. The public stats cache computes directly, with the
reasoning written down: uncached is acceptable, a 500 is not. Redis going down
degrades the product, it does not stop it.

**Cost is treated as a design constraint, not an afterthought.** Sentry samples
cron at 100% and requests at 10%. Cron work is confined to the cluster primary.
The Piscina pool idles at zero threads. Descriptions are truncated before tsvector
indexing. Two LLM prompts were merged into one because they sent the same resume
and job description twice. Every LLM input has a character cap, and the utility
that enforces it argues for character limits over word counts, because one long
no-space token counts as a single word but is an unbounded payload. The candidate
pool is 300 rows. The provider cascade starts cheap and ends on a free model.

**Comments record the bug, not the code.** The codebase's most valuable
documentation is the set of comments that name a specific failure and why the
current shape prevents it: why `--memory-pressure-off` was removed, why the pierce
selector prefix is required, why a react-select menu query must be scoped to its
own container, why stripping all non-digits turns a range like "3-5" into "35", why
the first virtualised menu render is the window around the current selection rather
than the top of the list. That style also produced the design contracts described
below, where twelve hard rules are each introduced as a bug that actually shipped.

---

## The product and the non-technical work

**What it does and who it is for.** ApplyCove serves candidates applying at volume,
primarily in India. It connects to the job boards and ATS platforms they already
use, surfaces a daily set of ranked matches, and applies on their behalf while
they watch. The free tier gives a small daily recommendation allowance; paid tiers
raise that allowance and unlock scheduled automation.

**Scale reached without paid acquisition.** 100,158 applications submitted,
329,677 screening questions answered, 13,641 sessions run, 1,702 registered users,
and an 11.6% free-to-paid conversion rate on a consumer product with zero paid
marketing spend. Growth came from organic search and word of mouth.

**Growth was built, not bought.** Because there was no ad budget, distribution had
to be an engineering surface:

- Search: programmatic city and role pages backed by genuinely written market
  context rather than templated filler, a hub-and-spoke internal linking structure
  with a built reference implementation, and a documented rule about which keyword
  clusters are already at their ceiling and should not be expanded.
- AI search: the Markdown negotiation layer, generated `llms.txt`, named
  allowances for GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot in robots.txt,
  and IndexNow submission because Bing's index is what several AI search products
  read.
- Free tools as acquisition: a public ATS resume checker and a
  job-description match scorer, deliberately built to make exactly one model call
  each so they stay cheap to give away, with an embeddable variant behind its own
  relaxed CSP and a documented threat model for why that is safe.
- Lifecycle: a crash-safe campaign mailer with per-campaign send ledgers so a rerun
  after a crash never emails anyone twice, and a Trustpilot review invite service
  budgeted at 50 per month, gated on real usage, using a unique constraint as the
  concurrency control and a tiered backoff table so the expensive qualifying query
  is skipped on most logins.

**Instrumenting honestly.** Two utilities exist purely because the naive metric was
wrong. One classifies session outcomes from the freeform reason text, because raw
status conflates user-stop, quota exhaustion and genuine crash, and reports about
39% aborted when the real hard-failure rate is under 5%. It deliberately returns
UNKNOWN rather than TECHNICAL_FAILURE for unrecognised text, with the note that a
climbing UNKNOWN share is the signal to add a pattern. The other classifies
acquisition channel from stored attribution, ranking a click id above `utm_medium`,
because ad platforms append the click id themselves whereas the medium is whatever
the person building the link happened to type.

**Two design systems, and why.** The product UI and the marketing site have
separate written contracts, and the root contract opens by stating the boundary as
its most important rule, recording a real and expensive mistake: the settings area
was once rebuilt to the marketing lattice, which stripped every container and left
a flat wall of labels over bare inputs with nothing separating one section from the
next. A marketing page is scanned once, a settings page is worked in. The two share
tokens and typography and share no layout rules. Twelve hard rules follow, each
described as a bug that actually shipped, and a "known gaps" section lists five
unfixed issues by name.

**Scope.** Product decisions, visual design, backend, frontend, browser extension,
scraping infrastructure, deployment, payments across three gateways with
region-based routing, transactional email, SEO, analytics and lifecycle marketing.
One person, six months.

---

## Known gaps

Stated deliberately, because a portfolio that only lists wins is less useful than
one that shows what its author tracks.

- Three of the six scrapers are written and their company lists vendored, but
  currently switched off at an enum, so only Greenhouse, Lever and Ashby run.
- Indeed automation is implemented in full but disabled at the router. Its
  reCAPTCHA v3 score-farming approach worked but was not reliable enough to ship.
- Extension test coverage is one file. The shared matching engine is tested across
  eleven assertions; the five ATS appliers and the orchestrator are not.
- Failure screenshots are a single hardcoded local file in one platform path
  rather than a pipeline. The HLS recording is the de facto forensic artifact.
- ECS task definitions are managed by hand. There is no Terraform, and the repo's
  own TODO names auto-revisioning task definitions as outstanding work.
- The API has continuous deployment; the job worker does not.
