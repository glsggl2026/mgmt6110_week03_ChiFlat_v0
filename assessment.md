Zhengyan LU 
Problem Set 2
Product: FlatRadar


## **Section 8 — Assess the collaboration**
----

**Q1. Where did the agent make you faster, and by how much?**
The agent has made the work of writing front end and back end infinitely faster. I have never written any REACT or worked out frontend/backend apps. So the mission impossible became possible with agent working for me. 
The agent has also given the instructions to fix git push when it failed, so that I moved to Github to fix the classic token to push it successfully. The error was fixed within five minutes. I would have to asked GPT by sharing the context for a solution, which could be a detour. Assume I have saved 10 minutes here.

**Q2. Where did it cost you time, and whose fault was that?**
“Yishun” problem took almost 1 hour to fix as agent handed me something apparently right but factually not.
 In the first attempt, all the resale price in 2017 were loaded and it took more than 30 seconds. Hence I had the idea of sorting from the latest transaction and limit to certain number of rows. 5 transactions didn’t mean much for decision support. And 10000 lines make the app very clunky. Haved asked AI and AI told me to use  limit=1000 with sort=_id desc to extract the latest transactions. 
Only later I found sort=_id desc means the latest rows in the table , instead of latest transactions. In the end I resolved it in two ways: 
a)	Download the original dataset to inspect how many rows by year / month / town to optimize the default data load when one opens the app. In Rstudio with a filter of last 36 months, Tampines have the most transactions of around 5800 among all towns and it took 20 seconds to load. It’s a balanced solution between response time and relevance for decision of HDB resale
b)	Then I asked AI backend to limit transactions to latest 36 months (N ~ 78,000 for Singapore). In default filters of last 12 months and one town as preselected (N ~ 1,900 highest) it would take maximum 20 seconds. In the same time , I asked to add refresh time for reference. 

**Q3. Did it ever hand you something that looked right and was not?**
Transaction Year (=TY) was something apparently right but actually wrong. I wanted to set up a column of TY in order to let users to select time frame more efficiently than having to pick up multiple months (transaction month is available in HDB dataset but not transaction year).
 I pasted the change in the backend prompt with {"type":"numeric","id":"Transaction Year"}. The agent built a TY dropdown in filters. The build went green. It was only till the moment when I used Rstudio to check lines that I looked at the dropdown properly. I found the dropdown only offered 2026, but in fact there should be multiple years’ data in there. I couldn’t afford time to fix it. Hence dropped this idea and went ahead to ask AI studio to fetch the latest 36 months’ of transactions. 

**Q4. What did you have to know in order to supervise it?**
One would have to inspect transaction files first in order to supervise the result. Data analysis also adds to the assets to make sure data integrity.
1.	After I gave the backend prompt, the app felt clunky. Also the app showed only Yishun in the town dropdown list, due to that the line limit was set at a threshold by the agent. So I started to use Rstudio to monitor the maximum data load to the app. It’s a trade off between data completeness and relevance to decision versus response time , as mentioned in Q2. 
I’ve also run Rstudio only after encountering slowliness , in order to monitor the average, median, IQR and spread shown in the screen to cross data validity. Had I known these earlier, I would have spent less time in setting up the default filters.
Other things good to know include that a price in HDB API call will appear as text 
2.	Related to Q3, I have to know the code language better to trace the a value thru the code and understand where the error came from. 
3.	Other info that are good to know : Knowing the HDB source updates monthly told me that caching for 6 hours might be right. I do not know which day of the month HDB publishes. Had I chosen 1 month in caching, it could leave me nearly a month behind without noticing the outdated data.

**Q5. Which decisions did you keep, and should you have kept more or fewer?**
Decisions that were mine and they were mine to keep:
•	Whether I’d better to build a new product for this back-end exercise. The last week’s product wouldn’t need a backend prompt. Hence I decided to build another one. 
•	The three year window. 2017 transactions do not help with buying decision. Also it adds to the data load of this app. Hence I’ve limited to transactions to past 3 years. 
•	Agent has build a line of “CPF and lease” for the 2nd screen. It was a claim about financing rules. It did not come from my data source, and I was not citing it. So I took it out.
•	Six hours for the cache. The source updates monthly, so six hours is already much fresher than the data itself. It also protects me if the whole class open the site on the same network
The decision I should have kept and did not (at least once):
•	Point 1 under Q4 is another scenario where I should have kept my decision from earlier on. How many rows to limit in data scope depends on payload size and it should have been thru data analysis rather than a decision by agent.
•	The four sentences for loading, empty, refused and unreachable. I did not write them. An early version of my prompt still said "decide what the user sees in each of these four cases," which is asking the agent to choose what my user reads when the provider is down. I only replaced that after reading panel closely.
•	The banding of storey on the filter should have been my decision, but the agent has taken it at the moment. Nothing in the world changes at floor 6 or floor 15 and this decision by agent isn’t based on stats.
Should I have handed more over: not now.

**Q6. Now scale it up: what does this mean for a team of thirty?**
•	I’d imagine everyone would have the question of how updated the info on the app should be , where the info comes from and how soon they shall be refreshed on screen. They are constrained on the back-end refresh timing and the frequency of calls sometimes. But when the data service is static relatively, a team of 30 people will make their own decision.
o	E.g. with the Resale price, A might say she wants to load past 5 years data and B might say only past 3 years. Or A can wait for 10 seconds for a refreshed screen while B can only wait for 2 seconds before dropoff. Where the line is should be discussed and set up as a policy. 
o	would that bring additional value to customers and additional costs to us? In this case, does adding more years’ transaction help the customers to make better decisions as of 2026 ? If yes, how many more seconds refresh time should they bear with the app?
o	default setting: what should be treated as default as one opens the app? Should they see the latest transactions first , or the lowest prices first ?
•	Two things I would not let an agent settle: what the user sees when the system fails, and what the product claims on the screen. E.g. when the call results in no past transaction, users should get back a clear sentence.
•	Where would you put a review step, and at which point in the week? The review has to happen before the go-live. Someone will have to e.g. check the downloaded data of csv file against what’s shown on the app and find support for each claim on the app.
•	Would we know if it had been settled anyway? Not from the code. Only from the log, which shows where the decisions were made. E.g. how many year’s of transactions should be pulled upon opening apps
•	the thing I have to check even if nobody checks: whether the data on the screen is the data that HDB published, whether refresh time per call increases over time etc

-------
## Section 4 — Criteria

### **1. Criteria of Frontend (FE) **
### 1.1 Number is true on screen
Why it matters: Users look for decision support have to rely on these data so they’d better be reliable.
How to test:  One can validate the numbers with an independent tool connected to the same source.
Met/Partially met/not met: Met. Have used Rstudio to cross check and have validated numbers by town for last 12 and last 36 months.
### 1.2 Is the one job reachable without instruction?
Why it matters: Users might lose patience, when they have to figure out how to get info. This would give users up to competitors.
How to test:  ask classmates to find out her area’s HDB resales prices and watch how she operates on the app.
Met/Partially met/not met: Met
### 1.3 Does the likely mistake have a way back?
Why it matters: People make errors , on the app too.
How to test: The app offers filters as a way to undo them individually as well as to reset all at once
Met/Partially met/not met: Partially. Forgot to set up “reset all filters”
### 1.4 User interface on the web and phone
Why it matters: Users on desk and on phone are able to view without friction and this expands the usability.
How to test: Open the live URL on a phon. Scroll the whole screen. Change two filters without rotating the phone
Met/Partially met/not met: Met partially. The laptop interface is clean. On the phone it looks cluttered.
 

### **2. Criteria of Backend / BE**
### 2.1 Users can figure out whose error
Why it matters: when the screen is blank my buyer needs to know whether to retry, and I need to know whether the fault is mine, the network's, or data.gov.sg's. 
How to test:  by using the table below.
State	How to force it
Loading	Throttle the network in your browser’s dev tools to “Slow 3G”
Empty	Ask for a filter combination with no rows — a rare flat type in a small town
Refused (not applicable in my case)	Temporarily set a wrong key in Vercel and redeploy 
Unreachable	point the endpoint at a hostname that does not exist

Met/Partially met/not met: Partially met. As my endpoint doesn’t need any key, so didn’t witness “refused” state. Rest all witnessed.
### 2.2 Refresh time / latency
Why it matters: Users might lose patience, when they have to wait for too long. Also have to decide when to use Cache and when not.
How to test: Pick a town where no cache exists and read the refresh time on the screen.
Met/Partially met/not met: Met partially, in my own standards as in 20 seconds are bearable to me. Didn’t have time to collect feedback. But the refresh time on the screen would be a good reference to users.
### 2.3 if Somebody who is not me can check my numbers
Why it matters: If the only way to check my median is to trust my median, nobody can check it
How to test: open /api/resale on the live URL and read the JSON.
Met/Partially met/not met: Met. I only looked it up after the Yishun failure
### 2.4 Whether data loading is complete
Why it matters; Users look for decision support have to rely on these data so they’d better be reliable.
How to test: One can validate the numbers with an independent tool connected to the same source.
Met/Partially met/not met: Met. Have used Rstudio to cross check and have validated
