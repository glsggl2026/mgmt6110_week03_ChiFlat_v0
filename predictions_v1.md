# predictions_v1.md

> **Note:** This is an updated version to the prediction.md which was submitted in a rush.

## 1. My product
- Live address: https://week3chiflat.vercel.app/
- Who it is for, and the one job it does for them: The users are the potential HDB flat buyers in Singapore. This app helps them to find out the historic price within last 3 years in maximum in a targeted area/town for their purchase decision.
- Health check from Step 1, on 27 Sep: 
{
  "keyConfigured": false,
  "credentialRequired": false,
  "upstreamAnswered": true,
  "upstreamStatus": 200,
  "durationMs": 1224,
  "recordCount": 1
}
- Devices and browsers I used for this evaluation: On Macbook Safari(50%) and Chrome (50%). Chrome on Pixel phone.

## 2. My findings

### Finding 1
- Where: https://week3chiflat.vercel.app/, the price box chart after choosing a town
- What I did, what I saw: I chose a town and waited; the transactions and chart took a long time to appear, with only a loading message on screen.
- Which heuristic: 1, Visibility of System Status (also 7, Flexibility and Efficiency of Use: "too slow")
- Screen or system: System. The wait happens while data is fetched from data.gov.sg; the screen can only say "loading".
- Severity, and why: 3. Every user meets it on every town change.
- The repair: one town's transactions appear within a few seconds.

### Finding 2
- Where: https://week3chiflat.vercel.app/, first load
- What I did, what I saw: I opened the page; it loaded Ang Mo Kio for "last 12 months" by default, without me choosing. Unselecting the filters works. Did this design intentionally in order to reduce the payload. But in second thought, users might wonder why AMK was chosen.
- Which heuristic: 3, User Control and Freedom
- Screen or system: Screen. The default is set in the front end.
- Severity, and why: 3. Every new visitor starts on a town they may not want.
- The repair: the user starts from a choice they make, or can clearly see and change the default, on the condition that Finding 1 can be solved. That means, I can leave the town unselected and let the transactions be refreshed in one go. (but later I'm informed the slow response time has less to do with payload...)

### Finding 3
- Where: https://week3chiflat.vercel.app/, the filters
- What I did, what I saw: I set several filters, left the page and came back; my selection was gone, and there is no way to save it.
- Which heuristic: 6, Recognition Rather than Recall ("lacks a bookmark function")
- Screen or system: Screen. The selection is not kept or saved.
- Severity, and why: 3. Returning users must redo every filter.
- The repair: a user can save a selection and return to it.

### Finding 4
- Where: https://week3chiflat.vercel.app/, the whole page
- What I did, what I saw: I looked for help on what the chart and terms mean; there is none.
- Which heuristic: 10, Help and Documentation
- Screen or system: Screen.
- Severity, and why: 3. Buyers without a stats background may misread the chart.
- The repair: short plain-language help is available where the chart and terms appear.

### Finding 5 
- Where: https://week3chiflat.vercel.app/, the stat cards and the "Blink" interaction
- What I did, what I saw: clicking a card makes the matching part of the chart blink.
- Which heuristic: 6, Recognition Rather than Recall. I noted it as a strength: "the blinking function enhances recognition". But also a double sword -- for those who read the chart, it is redundant. In the end, I'd rather it to be redundant than losing users of minimal knowledge.
- Screen or system: Screen.
- Severity, and why: not rated. I expected it to help users without stats knowledge, and more than being redundant for those with it.
- The repair: none planned.

## 3. My predictions
1. The three findings I expect my groupmates to raise, and the severity I expect them to give each: not stated at commit. My notes listed Findings 1–4, each of which I rated 3.
2. The heuristic I think my product breaks worst: not stated at commit. My notes flagged several problems under 6 and 7 (too slow, no bookmark).
3. The finding that would show my own evaluation was wrong: not stated at commit.

## 4. Findings I had already heard in the studio
[NONE]
