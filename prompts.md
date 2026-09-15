# prompts.md — FlatRadar

**Student:** Zhengyan Lu 
**Live URL:** https://week3chiflat.vercel.app/
**Repository:** https://github.com/glsggl2026/mgmt6110_week03_ChiFlat_v0
**Health endpoint:** …/api/health

---

## Part 1 — Problem Set 1 (the front end)

### 1 — The master prompt

```
**ROLE:** You are a senior front-end developer building a React web app.

GOAL: Build ChiFlat, a two-screen React app that lets an HDB resale buyer
narrow down past resale transactions and read what those flats actually sold for.
All data is invented for now and lives in one file; a later version will replace
it with the real government dataset, so the field names below must be used exactly.

[Screen 1] — Search and results. This is the screen the product exists for.

Header: the name "ChiFlat", one line under it reading "What HDB flats actually
sold for", and a visible notice: "Sample data — not real transactions."

Five filters, each a dropdown, each defaulting to "Any", stacked vertically on a
phone and in two columns on a laptop:
1. Flat type — from the field flat_type
2. Town — from the field town
3. Flat model — from the field flat_model
4. Remaining lease — banded, NOT raw. Four bands, computed from the field
   remaining_lease: "More than 80 years", "70 to 79 years",
   "60 to 69 years", "Less than 60 years"
5. Storey — banded, NOT raw. Three bands, computed from the field
   storey_range: "Low (1 to 6)", "Mid (7 to 15)",
   "High (16 and above)"

Build the options for filters 1, 2 and 3 from the values actually present in the
data file, not from a hardcoded list. A dropdown must never offer an option that
no row can satisfy.

Results update immediately when any filter changes. No search button.

Above the results, one line of plain English stating what is being shown, for
example: "18 transactions — 4 ROOM in TAMPINES". Update it as filters change.

Each result is a card showing: the town and street name, the flat type, the
resale price formatted as "S$540,000", the month of sale, the storey range,
the floor area in sqm, and the remaining lease. Tapping a card opens Screen 2.

Sort newest first by default. Offer one alternative sort, "Price, low to high".
IMPORTANT: resale_price and floor_area_sqm arrive as TEXT, not numbers, so
convert them with Number() the moment they are read. Sorting text puts "99000"
above "1000000" and the list is then silently wrong.

When no rows match, show no empty space. Show a message naming the filters that
produced nothing and offering a way back, for example: "No 5 ROOM flats in
BUKIT TIMAH with less than 60 years lease. Try clearing the lease filter."
Include a "Clear all filters" button in that message.

[Screen 2] — Transaction detail. Opens when a result card is tapped, with a back
button returning to Screen 1 with every filter still set as it was.

Show the full record for that one transaction: town, street name, block, flat
type, flat model, storey range, floor area in sqm, lease commence date,
remaining lease, month of sale, and resale price.

Below that, one short plain-English note about the lease, chosen by which band
the flat falls into. For a flat under 60 years remaining, say that CPF use may
be reduced depending on the youngest buyer's age, and that loan tenure may be
shorter. Keep it to two sentences and do not give financial advice.

The invented data file must use these exact field names, because the real dataset
uses them and I will be swapping the file out later:
month, town, flat_type, block, street_name, storey_range, floor_area_sqm,
flat_model, lease_commence_date, remaining_lease, resale_price

Every value in that file must be a STRING, including resale_price and
floor_area_sqm, because that is how the real source returns them.

**OUTPUT:** A running app. Keep every invented value in ONE data file of its own,
with at least 3 rows, so the screen looks real. One component per screen or
section. Move between screens without reloading the page. Readable on a phone at
arm's length. When you are done, list the files you created and what each one holds.

**GUARDRAILS:** Screens and invented data only. Do NOT call the Gemini API or any
other model. Do NOT call any outside service or fetch from any URL. No database,
no login, no user accounts, no analytics. No features I did not list. No real
company's name, logo, or trademark. Invented names and numbers only, nothin
confidential.

**CONTEXT:** Individual Problem Set 1 for MGMT 6110 Human-AI Collaboration at SMU.
Built in Google AI Studio, shared as a link, and opened on a phone by classmates
in Week 3. I am not a programmer: when you make a choice I did not specify, say
so in one line rather than burying it.
```

**What came back:** A running two-screen app with all five filters working off the
invented file.

**What I did:** Nothing. Matched my expectation for the FE

---

## Part 2 — Problem Set 2 (the back end)

### 2 — First back-end prompt

```
ROLE: You are a senior full-stack developer working in my existing project. Do not
rewrite what is already there; add to it.

GOAL: My screen currently shows every transaction as a hard-coded value. Replace it
with real data from the Singapore government dataset [# Resale flat prices based on
registration date from Jan-2017 onwards], fetched through a serverless function of
my own. my filters, cards and detail screen should keep working with minimal change.

api/resale.js—calls
https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=1000&sort=_id%20desc
(full URL end point), returns only the fields my screen needs, and nothing else.

api/health.js—always returns 200. It reports: credentialRequired (false, since this
source needs no key), the HTTP status the upstream returned, how long it took in
milliseconds, and how many records came back. It must never print a credential or
any part of one.

On the screen, replace the hard-coded value with the live one, and decide what the
user sees in each of these four cases:
- loading: "Loading recent transactions…"
- empty: "No flats matched those filters. Try clearing the lease or storey filter."
- refused: "data.gov.sg is limiting requests right now. This is on our side, not
  yours — try again in about a minute."
- unreachable: "We can't reach data.gov.sg at the moment. Nothing you did caused
  this. Please try again shortly."
Remove the "Sample data — not real transactions" notice and put the source credit
in its place.

OUTPUT: Both functions at api/ in the PROJECT ROOT, siblings of package.json, never
inside src/. If this project has a server entry file, register the same two routes
there too, because that is the shape the preview can answer. If it has no server
file, skip that and tell me so rather than inventing one.
Make sure package.json contains "type": "module".

This source requires NO credential and NO API key. Do not add a credential check,
do not create an environment variable, and do not add a 503 guard for a missing key.

AFTER the fetch, check response.ok before reading the body. A refusal often has an
empty body, so calling .json() on it throws and my function dies with a 500 instead
of telling me what happened. On a non-2xx reply, return the upstream status and a
one-line reason in your own JSON.

A 200 reply with an empty records array is NOT an error. Pass it through as an empty
list so my screen can show its own empty-state sentence.

Cache the response with Cache-Control: s-maxage=21600,
stale-while-revalidate=43200, matching how often the source actually changes.
In the footer, credit the source in the exact form the provider's licence asks for.

GUARDRAILS: This source needs no credential, so there is none to protect. Never
create a variable whose name starts with VITE_. Never call the upstream from browser
code; every call happens inside api/. No new npm packages. No database, no login.
Leave all of my existing work exactly as it is: all five filters, the four
remaining-lease bands, the three storey bands, the sort order, the result cards and
the detail screen.

CONTEXT: Deployed on Vercel from GitHub. No credential is required. A real response
from the endpoint, called by hand just now, looks like this:

{"success":true,"result":{
"resource_id":"d_8b84c4ee58e3cfc0ece0d773c8ca6abc",
"fields":[
{"type":"text","id":"month"},
{"type":"text","id":"town"},
{"type":"text","id":"flat_type"},
{"type":"text","id":"block"},
{"type":"text","id":"street_name"},
{"type":"text","id":"storey_range"},
{"type":"text","id":"floor_area_sqm"},
{"type":"text","id":"flat_model"},
{"type":"text","id":"lease_commence_date"},
{"type":"text","id":"remaining_lease"},
{"type":"numeric","id":"resale_price"},
{"type":"int4","id":"_id"}
],
"records":[
{"_id":1,"month":"2017-01","town":"ANG MO KIO","flat_type":"2 ROOM","block":"406","street_name":"ANG MO KIO AVE 10","storey_range":"10 TO 12","floor_area_sqm":"44","flat_model":"Improved","lease_commence_date":"1979","remaining_lease":"61 years 04 months","resale_price":"232000"},
{"_id":2,"month":"2017-01","town":"ANG MO KIO","flat_type":"3 ROOM","block":"108","street_name":"ANG MO KIO AVE 4","storey_range":"01 TO 03","floor_area_sqm":"67","flat_model":"New Generation","lease_commence_date":"1978","remaining_lease":"60 years 07 months","resale_price":"250000"}
],
"total":240345,"limit":1000
}}

Note: the records live at result.records, not at data or records. Also, resale_price
declares itself "numeric" in the fields list but arrives inside each record as a
quoted string, and floor_area_sqm is the same. Convert both with Number() the moment
they are read, before any sorting or comparison.
```

**What came back:** Both functions, at api/ in the root. Real data on the screen. But
the Town dropdown had only one option in it: YISHUN.

**What I did:** Asked why instead of changing anything. I could not tell from looking
whether the fetch was broken, the dropdown was broken, or the data really was all
one town. That is prompt 3.

---

### 3 — Why is only YISHUN in the town filter?

```
why is only Yishun available under town/filter?
```

**What came back:** It said the dataset is inserted alphabetically by town, so
`sort=_id desc&limit=1000` pulls the highest 1,000 row ids, and those all belong to
Yishun because Yishun is last alphabetically. It said that Yishun has over 1,000 transactions in the latest batch. 

**What I did:** Accepted the explanation and stopped asking. 

---

### 4 — Second back-end prompt, filter by month

```
ROLE: You are a senior full-stack developer working in my existing project. Do not
rewrite what is already there; add to it.

GOAL: My screen currently shows every transaction as a hard-coded value. Replace it
with real data from the Singapore government dataset [# Resale flat prices based on
registration date from Jan-2017 onwards], fetched through a serverless function of
my own. my filters, cards and detail screen should keep working with minimal change.

api/resale.js— calls the endpoint URL to:
https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&filters={"month":"2026-08"}&limit=10000

Do not type the braces and quotes literally into the string. Build the filters
value with encodeURIComponent(JSON.stringify({ month: "2026-08" })) so it encodes
correctly.

Also add, above the results, one line reading:
"Showing transactions registered in August 2026."

Change nothing else. Do not touch any of the five filters, the lease bands, the
storey bands, the sort order, the cards or the detail screen. Returns only the
fields my screen needs, and nothing else.

api/health.js—always returns 200. It reports: credentialRequired (false, since this
source needs no key), the HTTP status the upstream returned, how long it took in
milliseconds, and how many records came back. It must never print a credential or
any part of one.

[rest of the prompt identical to prompt 2 — OUTPUT, GUARDRAILS and the pasted
response were unchanged]
```

**What came back:** It took the month filter. All 26 towns now appeared in the
dropdown.

**What I did:** Fixed the wrong thing. Filtering by one hard-coded month gets every
town, but it also means the app can only ever show August 2026, which is not what the
product is for. A buyer wants a town, not a month. I rewrote it in prompt 5.

---

### 5 — Second back-end prompt, rewritten to filter by town

```
pls. forget about back end prmopts before and use this instead

ROLE: You are a senior full-stack developer working in my existing project. Do not
rewrite what is already there; add to it.

GOAL: My screen currently shows every resale transaction as a hard-coded value.
Replace it with real data from the data.gov.sg dataset "Resale flat prices based on
registration date from Jan 2017 onwards", fetched through a serverless function of
my own.

api/resale.js—calls
https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&filters={"town":"TAMPINES"}&limit=10000
returns only the fields my screen needs, and nothing else.

api/health.js—reports whether the credential is configured (keyConfigured) and
whether the upstream answered, including the HTTP status it returned. It must
never print the credential or any part of it.

On the screen, replace the hard-coded value with the live one, and decide what
the user sees in each of these four cases: the data is loading, the data is
empty, the upstream refused, and the upstream is unreachable. I want four
different sentences, not one spinner.

OUTPUT: Both functions at api/ in the PROJECT ROOT, siblings of package.json, never
inside src/. If this project has a server entry file, register the same two routes
there too, because that is the shape the preview can answer. If it has no server
file, skip that and tell me so rather than inventing one.
Make sure package.json contains "type": "module".
This source requires no credential, so there is no credential check to make and no
environment variable to read.
AFTER the fetch, check response.ok before reading the body. A refusal often has an
empty body, so calling .json() on it throws and my function dies with a 500 instead
of telling me what happened. On a non-2xx reply, return the upstream status and a
one-line reason in your own JSON.
Cache the response for six hours with Cache-Control: s-maxage=21600,
stale-while-revalidate=43200, matching how often the source actually changes.
In the footer, credit the source in the exact form the provider's licence asks for.

GUARDRAILS: Never create a variable whose name starts with VITE_. Never call the
upstream from browser code; every call happens inside api/. No new npm packages.
No database, no login. Leave every screen I already have working exactly as it is.

CONTEXT: Deployed on Vercel from GitHub. No credential is required by this source.
A real response from the endpoint, called by hand just now, looks like this:

{"success":true,"result":{
"resource_id":"d_8b84c4ee58e3cfc0ece0d773c8ca6abc",
"fields":[
{"type":"text","id":"month"},
{"type":"text","id":"town"},
{"type":"text","id":"flat_type"},
{"type":"text","id":"block"},
{"type":"text","id":"street_name"},
{"type":"text","id":"storey_range"},
{"type":"text","id":"floor_area_sqm"},
{"type":"text","id":"flat_model"},
{"type":"text","id":"lease_commence_date"},
{"type":"text","id":"remaining_lease"},
{"type":"numeric","id":"resale_price"},
{"type":"int4","id":"_id"}
],
"records":[
PASTE TWO REAL RECORDS FROM YOUR OWN CALL HERE, THEN DELETE THIS LINE
],
"total":240345,"limit":10000
}}

Every value comes back as text, including resale_price, whose own declared type in
the same response is numeric. Convert with Number(row.resale_price) the moment the
data arrives, before anything else touches it. Do not filter with q; use filters
with the field named explicitly. The records live at result.records.
```

**What came back:** It worked, but slowly. 10,000 records took a few seconds to load.

**What I did:** just observed.

---

### 6 — Cut it to 5 records to see what is going on

```
change this api/resale.js—calls to https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5
```

**What came back:** Done. 

**What I did:** This was me testing, just observed.

---

### 7 — Why only ANG MO KIO this time?

```
why only Ang Mo Kio shows in the dropdown now?
```

**What came back:** It showed me my own code — the dropdown is built with
`Array.from(new Set(transactions.map((d) => d.town)))` — and said that because
api/resale.js fetches only 5 records and all 5 are in Ang Mo Kio, the app only knows
about Ang Mo Kio. Then it offered two options:

- A: fetch a whole month in the back end so all towns appear
- B: pass the selected town from the app to the back end, keep the limit small

And it asked which I preferred.

**What I did:** Neither and went on with prompt 8
prompt 8.

---

### 8 — Pick the trade-off myself

```
need to balance : if i choose limit = 1000, then too slow. if I choose limit = 5
then only AMK transactions.
can I keep AMK as selection and limit = 100, but users can select other towns as well?
```

**What came back:**  It said 10,000 records takes 3–4 seconds and 100 records
for one town takes about 0.1 seconds, and that the town list should be a fixed list
of all Singapore towns so the dropdown is never restricted to one option. Then it
asked whether to implement.

**What I did:** kept prompting

---

### 9 — Are those 100 the latest, or just the first 100?

```
are those 100 transcactions random or sorted by certain way? by default I'd like it
to select the latest 100 transactions (under month of sales) . Pls share changes
first. And then implement
```

**What came back:** It said that without a sort parameter the API returns records in
ascending insertion order starting with the oldest records from January 2017, and
that adding `&sort=_id desc` returns the most recent, because _id increments with
every new monthly batch of registered transactions. Then it gave me the exact plan —
back-end changes, front-end changes — and asked before touching anything.

**What I did:** Read the plan, then let it go ahead.

---

### 10 — Ask it to rewrite my own prompts

```
can u pls. pass me the updated front end and back end prompt by using the latest
round of changes only and rest stays the same?
```

**What came back:** Two clean prompts, back end and front end, with limit=100,
default ANG MO KIO, the full 26-town list, `sort=_id desc`, and the four screen
states written out.

**What I did:** Took them and used them as the base for prompts 11 and 12. 

---

### 11 — Front-end prompt, rebuilt in another chat 

```
**ROLE:** You are a senior front-end developer building a React web app.

GOAL:
Build ChiFlat, a two-screen React app that lets an HDB resale buyer
narrow down past resale transactions and read what those flats actually sold for.
All data is invented for now and lives in one file; a later version will replace
it with the real government dataset, so the field names below must be used exactly.
Connect the Town filter dropdown to fetch the latest 100 transactions per town,
while keeping all existing filters and detail views working.

Town Selection & Default: - Set the initial/default town filter to "ANG MO KIO" and
Transaction Year to "2026" - Populate the Town dropdown with the request in screen 1.
Show transaction by month of sale descending way, meaning latest deals first.

Live Data Fetching: - When the app loads or when the user selects a different town
in the dropdown, call: /api/resale?town=${encodeURIComponent(selectedTown)} -
Convert resale_price and floor_area_sqm with Number() immediately upon reading.

[Screen 1] — Search and results. This is the screen the product exists for.

Header: the name "ChiFlat", one line under it reading "What HDB flats actually
sold for", and a visible notice: "Sample data — not real transactions."

Five filters, each a dropdown, each defaulting to "Any", stacked vertically on a
phone and in two columns on a laptop:
1. Flat type — from the field flat_type
2. Town — from the field town
3. Flat model — from the field flat_model
4. Remaining lease — banded, NOT raw. Four bands, computed from the field
   remaining_lease: "More than 80 years", "70 to 79 years",
   "60 to 69 years", "Less than 60 years"
5. Storey — banded, NOT raw. Three bands, computed from the field
   storey_range: "Low (1 to 6)", "Mid (7 to 15)",
   "High (16 and above)"
6. Transation year — it'd show from 2016 onwards

[rest of Screen 1 and Screen 2 identical to prompt 1, and OUTPUT, GUARDRAILS
and CONTEXT unchanged from prompt 1]
```

**What came back:** "I have built ChiFlat, a two-screen React application for
exploring past Singapore HDB resale transactions with live town fetching, adaptive
filtering, and lease tenure insights."

**What I did:** Accepted it and moved on to the back end.

---

### 12 — Back-end prompt, rebuilt

```
For backend prompt:

ROLE: You are a senior full-stack developer working in my existing project. Do not
rewrite what is already there; add to it.

GOAL:
My screen currently shows every transaction as a hard-coded value. Replace it with
real data from the Singapore government dataset [# Resale flat prices based on
registration date from Jan-2017 onwards], fetched through a serverless function of
my own. my filters, cards and detail screen should keep working with minimal change.

Update api/resale.js to dynamically fetch the 500 latest transactions for a given town.

api/resale.js: - Read the optional town query parameter from the request URL (e.g.,
req.query.town or from URL search params). - If town is omitted or empty, default to
"ANG MO KIO". - Call the data.gov.sg endpoint using:
https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&filters={"town":"<TOWN>"}&sort=_id desc&limit=500
(Build the filters string using encodeURIComponent(JSON.stringify({ town: selectedTown }))).
- Check response.ok before reading the body. On non-2xx, return upstream status and
error reason. - Return only the fields needed by the screen: month, town, flat_type,
block, street_name, storey_range, floor_area_sqm, flat_model, lease_commence_date,
remaining_lease, and resale_price. - Cache the response with Cache-Control:
s-maxage=21600, stale-while-revalidate=43200.

api/health.js: - Keep reporting keyConfigured (false), credentialRequired (false),
upstreamAnswered, upstreamStatus, durationMs, and recordCount. Never expose credentials.

Change nothing else. Do not touch any of the filters, the lease bands, the storey
bands, the sort order, the cards or the detail screen. Returns only the fields my
screen needs, and nothing else.

[four screen states, OUTPUT, no-credential note, response.ok note, empty-is-not-an-
error note, cache line, GUARDRAILS — all unchanged from prompt 2]

CONTEXT: Deployed on Vercel from GitHub. No credential is required. A real response
from the endpoint, called by hand just now, looks like this:

{"success":true,"result":{
...
{"type":"numeric","id":"resale_price"},
{"type":"numeric","id":"Transaction Year"},
{"type":"int4","id":"_id"}
],
"records":[
{"_id":1,"month":"2026-09","town":"ANG MO KIO",...,"resale_price":"232000"},
{"_id":2,"month":"2026-09","town":"ANG MO KIO",...,"resale_price":"250000"}
],
"total":240345,"limit":500
}}

Note: the records live at result.records, not at data or records. Also, resale_price
declares itself "numeric" in the fields list but arrives inside each record as a
quoted string, and floor_area_sqm is the same. Convert both with Number() the moment
they are read, before any sorting or comparison.
```

**What came back:** "I have implemented the live data integration for ChiFlat."

**What I did:** Accepted it
---
### 12.1 - Validated the highest row count for a town in past 36 months is 5800 in Rstudio. Hence decide to limit the rows to 10k

Change limit from 500 to 10000. and sort transactions from the latest transaction month.

**What came back:** I have implemented.
**What I did:** Accepted it

### 13 — Does this project have a server entry file?

```
does this project have a server entry file, yes or no?
```

**What came back:** No. It said the project is a React SPA built on Vite with
standalone serverless functions in /api/, and no server.ts or server.js.

**What I did:** accepted.

---

### 14 — Push to GitHub

```
git push https://[pat]@github.com/glsggl2026/mgmt6110_week03_ChiFlat_v0.git
```

**What came back:** 403. `remote: Permission to
glsggl2026/mgmt6110_week03_ChiFlat_v0.git denied to glsggl2026.` It said the
fine-grained personal access token does not have Contents (read and write)
permission on the repo, and told me how to fix the permissions.

**What I did:** Went to GitHub, edited the token's permissions, came back and tried
again with the same command.

---

### 15 — Push again

```
git push https://[pat]@github.com/glsggl2026/mgmt6110_week03_ChiFlat_v0.git
```

**What came back:** Same 403. This time it told me why editing the permissions had
not helped: changing a fine-grained token's permissions on GitHub creates a new token
string rather than updating the old one, so the string in my prompt was still being
evaluated with the old permissions. It also told me the code was already on GitHub at
commit 9994996 and the only thing still pending was bun.lock. It recommended a
classic token with the repo scope.

**What I did:** followed instruction, with the same string. See prompt 16.

---

### 16 — Push a third time

```
git push https://[pat]@github.com/glsggl2026/mgmt6110_week03_ChiFlat_v0.git
```

**What came back:** looks thru
**What I did:** validated in Github


---

### 17 — Screens only: drop the year filter, add a period filter and a summary

```
Change the screens only. Do not touch api/resale.js or api/health.js.

Remove the Transaction Year filter entirely — the dropdown, its label, and
any code that derives a year from anything. I do not want it in the app.

Add a Period filter, a single-select dropdown with three options:
"Last 12 months" (default), "Last 24 months", "Last 36 months". It filters
the loaded records by month, relative to the newest month in the data.

Above the results, add a summary strip for the transactions matching every
filter currently set:

  Median S$685,000 · Average S$702,400 · n = 47 · Range S$430k – S$1.10m

Colour the n value green when it is 10 or more and red when it is under 10.
Recompute it whenever any filter changes.

Under that strip, one line stating the real coverage, computed from the data
and the count and total the function returns:

  "Showing 1,284 of 12,430 transactions in ANG MO KIO, Oct 2023 – Sep 2026."

Beside the summary strip, show how long the last refresh took, measured in
the browser with performance.now() around the fetch: "refreshed in 412 ms".

On Screen 2, remove the yellow note about CPF use and loan tenure. It is a
claim about financing rules that does not come from my data source, and I am
not citing it. Keep the rest of the transaction detail view exactly as it is.

Keep everything else unchanged: the Town, Flat Type, Flat Model, Remaining Lease
and Storey filters, the lease bands, the storey bands, both sort options, the
result cards, the empty-state message, and the four loading / empty / refused /
unreachable sentences.
```

**What came back:** Gemini 3.8 Flash, ran for 137 seconds, edited 7 files
(src/types.ts, src/utils/hdb.ts, DetailScreen.tsx, FilterSection.tsx,
ResultsSummary.tsx, EmptyState.tsx, App.tsx) and built. It confirmed each item, and
in its summary it quoted the numbers back to me: "Median S$685,000 · Average
S$702,400 · n = 47 · Range S$430k – S$1.10m", "Showing 1,284 of 12,430 transactions
in ANG MO KIO, Oct 2023 – Sep 2026", and "refreshed in 412 ms".

**What I did:** 

Removing the CPF note. 
Removing the Transaction Year filter. 


### 18: ask to change the app's name to FlatRadar 
**What came back:** : renamed
**What I did:**: validated.
---


