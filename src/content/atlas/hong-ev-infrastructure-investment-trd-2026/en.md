---
tldr: >-
  We built a planning model that compares spending a fixed public budget on government-owned EV
  chargers with using it to subsidize chargers at private businesses, and found in Kansas City that
  the same $500,000 builds 41 subsidized private stations instead of 22 public ones, at the price of
  higher fees for drivers and thinner coverage of some lower-income neighbourhoods.
hero:
  image: /media/hong-ev-infrastructure-investment-trd-2026/public-vs-private-chargers.jpg
  alt: "Left: a single charging post beside a municipal building parking lot. Right: a row of EVgo fast chargers in a shopping mall parking lot"
  caption: >-
    Two ways to spend public money on EV charging. Left: a free public charger in front of a
    municipal building. Right: a privately operated charger in front of a shopping mall, where the
    host business also earns from shoppers.
  credit: From the paper
abstract: |-
  Utilizing taxpayer dollars for electric vehicle (EV) charger deployments has sparked ongoing debate over the efficiency and fairness of public spending. Public agencies aim to maximize utilization and accessibility, whereas private investors prioritize profitability. This study develops a unified modeling framework that represents public-led and private-led charging station deployment as heterogeneous decision processes and solves it using a bilevel demand-supply coupling approach. The upper level compares public-led, private-led, and coexistence scenarios under a fixed government budget, while the lower level predicts station-level utilization. The two levels are iteratively coupled: supply-side siting decisions shape demand forecasts, while demand feedback updates supply through a gradient-informed spatial expansion algorithm. Results show that private-led deployment can leverage matching capital to improve utilization and profit, but may increase user charging costs and bypass some lower-income minority areas. Sensitivity analyses indicate that private-led profitability is robust to EV adoption growth but depends strongly on charging-to-purchase conversion.
key_numbers:
  - { value: "41 vs 22", label: "charging stations the same $500,000 builds as private subsidies vs. as public chargers" }
  - { value: "19 → 28", label: "ZIP codes served when the budget subsidizes private chargers instead" }
  - { value: "$193–484", label: "extra charging cost per year for a frequent user of private-led chargers" }
  - { value: "18%", label: "of ZIP codes served by private-led chargers are low-income, vs. 32% under public-led" }
updated: 2026-10-25
---

## What problem does this research solve?

Public money for EV charging is under scrutiny. Programs such as the National Electric Vehicle Infrastructure (NEVI) initiative have drawn criticism over how efficiently and fairly taxpayer dollars are spent, yet a lack of chargers still holds back EV adoption: one study cited in the paper finds that a 1% increase in charging accessibility goes with a 5.75% rise in EV uptake. Chargers are expensive and cannot be moved, so a badly placed charger stays a costly, underused asset.

An agency with a charging budget has two basic options. It can **build and run public chargers itself**, usually offering cheap or free charging. Or it can **subsidize private businesses** (restaurants, convenience stores, supermarkets, shopping centers, hotels) to install chargers that bring customers to their door; such businesses earn roughly $1 to $50 in profit per customer visit with a purchase, depending on the type of business. Programs like Pennsylvania's Driving PA Forward grants and the federal Charging and Fueling Infrastructure grants already work this way.

The two owners want different things. A public agency wants chargers that are used a lot and reach everyone; a private investor wants profit. So the agency's real question is: **with a fixed budget, how much should go to public chargers and how much to private subsidies, and what does each choice mean for drivers and neighbourhoods?** Existing charger-siting models assume one planner with one goal and cannot answer it.

## What did we do?

We built one model in which public agencies and private investors each choose charger sites by their own rules, and in which both can compete for the same candidate sites. A public agency picks sites that maximize hours of charger use within its budget. A private investor picks sites that maximize profit, counting charging fees, overstay parking fees and the extra in-store purchases charging customers make, and only builds where it can cover its share of the construction cost and expects the profit to pay it back. In a mixed scenario, when both want the same site, it goes to whichever side gains more from it.

<figure>
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/bilevel-framework.png" alt="Flow diagram: a fixed funding F feeds an upper level with three options (public-led maximizing occupancy, coexistence, private-led maximizing profit) that chooses locations; arrows labelled supply and demand link it to a lower level that forecasts charging occupancy at every charger and candidate site" loading="lazy" />
  <figcaption>The two-level framework. The upper level chooses sites under one of three ways of spending the fund; the lower level predicts how much every charger, new or existing, will be used. The two pass results back and forth until the plan stops changing. From the paper.</figcaption>
</figure>

We tested it on Kansas City, Missouri, with 416,647 charging sessions recorded at 435 existing public chargers between 2017 and 2023, plus traffic volumes from the Mid-America Regional Council and weather records. We identified 355 candidate sites across the city, each attached to an existing business, so any of them could host either a public or a private charger.

<figure class="figure-row">
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/existing-chargers-map.png" alt="Map of Kansas City ZIP code areas with orange dots for existing chargers, clustered in the urban core" loading="lazy" />
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/candidate-sites-map.png" alt="Map of Kansas City ZIP code areas with blue dots for candidate sites, spread much more evenly across the city" loading="lazy" />
  <figcaption>Left: the 435 existing public chargers, concentrated in the urban core. Right: the 355 candidate sites for new chargers, spread far more evenly. Gray outlines are ZIP code areas. From the paper.</figcaption>
</figure>

The base case gives the agency $500,000 to spend over five years. A Level 2 charger costs $15,000 to build. A private investor must put up 20% of the construction cost, and one in ten charging customers is assumed to buy something at the host business. Public chargers sell electricity at cost; private chargers add a service fee and an overstay parking fee.

## What is the key methodological contribution?

**Demand responds to supply.** A new charger does not just add its own users; it can pull drivers away from chargers nearby. The lower level of the model is a gradient-boosted tree model that predicts monthly use of every charger from its surroundings: traffic, land use, weather, charger type, and how many other chargers share its ZIP code. On held-out data it explained 70% of the variation (R² = 0.70), ahead of random forest (0.68), nearest-neighbour (0.55), neural-network (0.47) and linear regression (0.05) models fitted to the same data.

<figure>
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/shap-features.png" alt="Horizontal bar chart of mean SHAP values; nearby traffic volume (AADT) is by far the longest bar; charger density D ranks third" loading="lazy" />
  <figcaption>What drives charger use in the model. Nearby traffic volume (AADT) matters most; the density of chargers in the same ZIP code (D) ranks third, which is why siting and demand have to be solved together. From the paper.</figcaption>
</figure>

**A solver built for several actors.** We extended the lab's earlier demand–supply coupled siting method, which assumed a single planner, to public and private actors with different goals. The new gradient-informed spatial expansion (GISE) algorithm adds sites one at a time by their net benefit, counting both the new charger's use and what it takes from neighbouring stations, mixes nearby and distant candidates so the search does not get stuck, and settles contested sites between public and private plans. In the public-only case it raised total use from 130,354 hours for the starting plan to 382,464 hours within six iterations, slightly ahead of a greedy method (373,531) and a local search (377,680). In the private-only case it found a plan earning $692,000, 7.9% more than the greedy method.

## What are the key findings?

**Subsidizing private chargers stretches the budget.** Because private investors add their own money, $500,000 spent entirely on subsidies supports **41 private stations**, together with about $125,000 of private co-investment, while the same money spent directly builds **22 public stations**. As more of the budget shifts from public chargers to private subsidies, total hours of charging across the city and total profit both rise; profit rises much faster.

<figure>
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/funding-allocation-results.png" alt="Combined bar and line chart across six splits of $500,000 from all-public to all-private; the blue total occupancy line rises gently, the orange total profit line rises steeply from about minus $481,000 to $692,000, and the green additional charging cost line rises steadily; the row under the axis reads p:22 and b:0 up to p:0 and b:41" loading="lazy" />
  <figcaption>Moving the $500,000 step by step from public chargers (left) to private subsidies (right). Watch the three dashed lines: total use (blue) rises gently, total profit (orange) climbs steeply, and so does the extra cost drivers pay (green). The bottom row gives the number of new public (p) and private (b) chargers. From the paper.</figcaption>
</figure>

**Drivers pay for it.** Private chargers charge more for electricity and parking. Compared with public-led deployment, they add about **$1.40 per hour** plugged in, or about $4.03 per session. For frequent users of public-access chargers in Kansas City (4 to 10 sessions a month), that is **$193 to $484 a year**, which wipes out 24% to 37% of the $800 to $1,300 a year an EV typically saves on fuel compared with a gasoline car.

**Coverage grows, but not evenly.** The two plans overlap heavily: 16 of the 19 ZIP codes served by the public plan are also served by the private plan, which reaches 28 ZIP codes in total and puts two or more stations in 11 of them. But the extra coverage goes mostly to better-off areas. Low-income ZIP codes are 17.9% of those the private plan serves, against 31.6% for the public plan. Of the three ZIP codes the public plan serves and the private plan skips, two are predominantly African American communities with median household incomes of $51,310 and $40,770, below Kansas City's median of $67,449. Their chargers would be well used, but other sites earn more.

<figure class="figure-row">
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/public-led-solution-map.png" alt="Map of the public-led solution with purple to orange dots for 22 new public chargers; two ZIP codes in the center are highlighted yellow and one further north blue" loading="lazy" />
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/private-led-solution-map.png" alt="Map of the private-led solution with green dots for 41 new private chargers, denser in the center; the same three ZIP codes are highlighted and contain no new private chargers" loading="lazy" />
  <figcaption>Where the $500,000 puts new chargers: all public (left) or all private (right). The highlighted ZIP codes get chargers only under the public plan; yellow marks the two lower-income areas, blue a higher-income one. From the paper.</figcaption>
</figure>

**Private profits depend on shoppers.** Private-led profit held up across every EV growth rate tested; even at the most conservative rate, about $127,000 was left after subtracting the subsidy. What it does depend on is whether charging customers buy something. With no in-store purchases, private investors cannot recover their $123,000 contribution. If one charging customer in twenty buys something, about $172,000 remains after the subsidy; at one in ten, $348,000.

<figure>
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/instore-purchase-sensitivity.png" alt="Paired stacked bars of private revenue (green shades) and costs (red shades) at in-store purchase probabilities of 0, 0.05, 0.1 and 0.15; the revenue bar grows taller than the cost bar as the probability rises" loading="lazy" />
  <figcaption>Revenue (green) against costs, the investor's own budget and the subsidy (red) as the chance that a charging customer shops in the store rises from 0 to 15%. At zero, revenue covers costs and the subsidy but not the investor's own money. From the paper.</figcaption>
</figure>

**Time works against public chargers on a fixed budget.** A public budget has to cover operating costs as well as construction. Stretch the planning period from 2 to 10 years and the number of new public stations the $500,000 can afford falls from 27 to 17, while private profit grows to nearly $1.8 million by year 10. Turning the private subsidy into a loan instead of a grant would stretch the investor's payback from under two years to about four, which the paper considers still favourable.

<figure>
  <img src="/media/hong-ev-infrastructure-investment-trd-2026/profit-components-horizon.png" alt="Grouped stacked bars for planning horizons of 2, 4, 6, 8 and 10 years, showing public revenue and costs in blue, orange and yellow and private revenue and costs in green and red; private revenue bars grow much taller over time" loading="lazy" />
  <figcaption>Revenue and costs for public (blue, yellow, orange) and private (green, red) chargers over planning periods of 2 to 10 years. Private revenue overtakes costs quickly; public chargers sell at cost and their operating costs keep growing. From the paper.</figcaption>
</figure>

The paper notes one important caution. The demand model was trained on public chargers and does not include price, so it does not capture drivers using private chargers less because they cost more. The private-led advantages should therefore be read as upper estimates. Kansas City is a demonstration, not a national benchmark: the direction of the trade-offs should carry over to similar cities, but the numbers will differ.

## What can this be used for?

- **State and federal agencies running charging grants**: compare spending a budget directly with subsidizing private hosts, before committing, on the agency's own data. The Kansas City results suggest that during today's market expansion, subsidies can buy more charging per public dollar.
- **Designing subsidy rules**: pair private subsidies with safeguards the paper points to, such as fee caps or targeted discounts for frequent users, differentiated subsidy rates, set-aside funds for underserved neighbourhoods, and loans rather than grants where investors can carry them.
- **Cities and planners**: find which candidate sites matter most, accounting for how new chargers pull users from existing ones.
- **Researchers**: a framework that can be recalibrated for other cities; next steps include price-sensitive and mixed-ownership demand data, individual charging-choice models, and power-grid constraints.
