---
tldr: >-
  Removing names from metro smart card data is not enough: knowing just two of a rider's trips
  singles out 30.7% of 2.8 million Shenzhen Metro users. We built a differential privacy algorithm
  that publishes a provably private version of such data with smaller errors and shorter run times than
  two leading methods.
hero:
  image: /media/li-ppdp-smart-card-trc-2020/station-tap-volumes.jpg
  alt: 3D map of Shenzhen with a purple and yellow bar standing on each metro station; the tallest bars, at stations such as Chegongmiao, Wuhe and Pingzhou, show between 55,000 and 95,000 entries and exits in one day
  caption: >-
    One day of Shenzhen Metro smart card taps. Each bar is a station: purple for riders tapping in,
    yellow for riders tapping out. Every one of these taps is tied to a card ID, and a sequence of
    taps can say where a rider lives and works.
  credit: From the paper; base map Bing Maps, © 2019 HERE
affiliations:
  - Guangdong University of Technology
  - Missouri University of Science and Technology
author_affiliations: [[1, 2], [1], [2]]
abstract: |-
  This manuscript is focused on transit smart card data and finds that the release of such trajectory information after simple anonymization creates high concern about breaching privacy. Trajectory data is large-scale, high-dimensional, and sparse in nature and, thus, requires an efficient privacy-preserving data publishing (PPDP) algorithm with high data utility. This paper describes the investigation of the publication of non-interactive sanitized trajectory data under a differential privacy (DP) definition. To this end, a new prefix tree structure, an incremental privacy budget allocation model, and a spatial-temporal dimensionality reduction model are proposed to enhance the sanitized data utility as well as to improve runtime efficiency. The developed algorithm is implemented and applied to real-life metro smart card data from Shenzhen, China, which includes a total of 2.8 million individual travelers and over 220 million records. Numerical analysis finds that, compared with previous work, the proposed model outputs sanitized dataset with higher utilities, and the algorithm is more efficient and scalable.
key_numbers:
  - { value: "30.7%", label: "of riders singled out by just two trips in “anonymous” smart card data" }
  - { value: "41.4%", label: "singled out when the attacker also knows about a bus transfer" }
  - { value: "2.8 million", label: "Shenzhen Metro riders and 220 million records used to test the method" }
  - { value: "1/3", label: "of the error of the best earlier method, SafePath, on the same metro data and privacy budget" }
updated: 2026-10-27
---

## What problem does this research solve?

Every time a rider taps a transit smart card, the system records which station, and when. Transit agencies collect millions of these records a day, and they are valuable: researchers and planners use them to study travel patterns, crowding and service gaps. Agencies often want to share them, and the usual practice is to strip out names and addresses first and replace the card number with a random ID.

The trouble is that **removing names does not make the data anonymous**. A well-known study found that 87% of Americans can be identified from just their ZIP code, gender and date of birth. Travel records are even more revealing, because almost nobody else makes exactly the same trips at exactly the same times.

We measured this on the Shenzhen Metro data. If an attacker knows only **two of a rider's trips**, the station and the time to within 10 minutes, **30.7% of riders can be singled out**, even with all personal information removed. If the attacker also knows the rider took a bus right after the subway, that rises to **41.4%**. Once a card ID is found, the attacker can read that person's entire travel history and infer where they live and work.

<figure>
  <img src="/media/li-ppdp-smart-card-trc-2020/background-knowledge-attack.png" alt="Diagram. At top, an attacker knows Alice was at Buxin station around 7:20 to 7:30 and at Longcheng Square around 8:09 to 8:19. Red lines link these two facts to the only matching card in a table of anonymous metro records, ID 20015461, whose full trip history reveals a home near Buxin and work at Longcheng Square. At bottom right, a second attacker knows Frank was at Gangxia around 8 pm and then took a bus, which matches only card 20099459" loading="lazy" />
  <figcaption>How an “anonymous” record is linked back to a person. Red boxes: what the attacker already knows (two trips for Alice; one trip and a bus transfer for Frank). Green boxes: what the attacker learns once the card is found, such as home and work stations. Image: from the paper.</figcaption>
</figure>

Older protection methods, such as *k*-anonymity, try to hide each rider in a crowd of look-alikes. But they only work if the data owner can guess in advance what the attacker already knows, which is impossible in practice. **Differential privacy** offers a much stronger guarantee: the published data look almost the same whether or not any one person's records are in it, no matter what the attacker knows. The challenge is that transit trip data are huge, sparse and contain both place and time, so earlier differential privacy methods either lost too much accuracy or ran out of memory.

## What did we do?

We tested the problem on real data: **220 million smart card records from 2.8 million Shenzhen Metro riders** over 29 days in June 2016, about 10% of the city's resident population, on six metro lines and 137 stations. The ten busiest stations alone generate about 20% of all trips.

<figure>
  <img src="/media/li-ppdp-smart-card-trc-2020/shenzhen-metro-network.png" alt="Map of Shenzhen with six metro lines drawn in different colors, with dots for stations, spreading from the city center along the bay to the west, north and east" loading="lazy" />
  <figcaption>The six Shenzhen Metro lines and their stations covered by the data set, which reach most of the city. Image: from the paper.</figcaption>
</figure>

We then designed an algorithm that publishes a **sanitized** copy of the trip data that satisfies differential privacy. The data are not released as individual records. Instead, the algorithm stores all trips in a **prefix tree**: each branch is a station and a time slot, and each node counts how many riders followed that sequence of stops. Random noise is added to every count, branches with too few riders are cut, and the noisy tree is read back out as a synthetic data set. Researchers can then ask the published data questions such as “how many riders entered station X at 8:00 and exited at station Y by 8:30?” and get answers close to the truth, while no single rider can be picked out.

<figure class="figure-row">
  <img src="/media/li-ppdp-smart-card-trc-2020/prefix-tree-raw.png" alt="A tree diagram with a root node counting 8 trajectories, branching into five nodes by first stop (such as 1Y or 2X) and then into later stops, each node holding a count of 1 or 2" loading="lazy" />
  <img src="/media/li-ppdp-smart-card-trc-2020/prefix-tree-noisy.png" alt="A similar tree with a root node of 12, four first-level branches and seven leaf nodes; the counts and some branches differ from the original tree" loading="lazy" />
  <figcaption>A toy example with eight trips. Left: the true prefix tree, where each edge is a time slot and station (2X means station X in time slot 2) and each node counts riders. Right: one possible published tree after noise is added and small branches are pruned. Counts change and some branches appear or disappear, so the published tree cannot be traced back to any one real rider. Images: from the paper.</figcaption>
</figure>

## What is the key methodological contribution?

Differential privacy comes with a fixed **privacy budget**: the more budget spent on a step, the less noise that step needs. The two leading tree-based methods, SeqPT and SafePath, spend this budget in ways that hurt accuracy on large transit data. Our algorithm makes three changes.

1. **A simpler prefix tree, with no taxonomy sub-trees.** SafePath builds extra “taxonomy” trees for time and location at every level to help prune empty branches. Those extra trees use up most of the privacy budget, leaving little for the actual trip counts. Our tree skips them, so the whole budget goes to the counts that matter.
2. **More budget where counts are small.** Counts shrink as the tree goes deeper (many riders share a first stop, few share a whole day). Earlier methods split the budget evenly across levels, so the same noise swamps the small counts deep in the tree. We give each deeper level a larger share of the budget, and lower the pruning threshold level by level to match.
3. **Skip trips that are physically impossible.** To be private, the algorithm must also consider station-and-time pairs that never appear in the data, and there are a great many of them. We use a matrix of minimum travel times between stations to drop any next stop a rider could not reach in the time available. This matrix comes from the network itself, not from rider data, so it costs no privacy budget, and it cuts the computation sharply.

<figure class="figure-narrow">
  <img src="/media/li-ppdp-smart-card-trc-2020/algorithm-framework.png" alt="Flow chart in three boxes: Initialization builds a prefix tree; HandleSubTree applies the incremental privacy budget allocation model and the spatial-temporal dimensionality reduction model to produce a noise prefix tree; TraverseOutput reads the noisy tree and outputs the sanitized data set" loading="lazy" />
  <figcaption>The three steps of the algorithm. All of the privacy budget is spent in the middle step; building the tree and reading it out use none. Image: from the paper.</figcaption>
</figure>

We prove that the whole procedure is ε-differentially private for any privacy budget ε the data owner chooses.

## What are the key findings?

We built four test data sets from the Shenzhen data, from 393,552 to 845,727 rider trajectories, with time sliced into 15-minute slots. A fifth set, about 734,000 GPS walking trajectories from Beijing with 1,571 locations, tested a much larger location domain. Accuracy was measured with 40,000 random count queries, comparing the answers from the published data with the answers from the original data.

- **High accuracy.** In most settings the average relative error of the published data was **below 0.1** (10%).
- **More accurate than earlier methods.** On every metro data set our algorithm had lower error than SafePath and SeqPT. On the smallest data set with a five-level tree, our error was **0.034, about one third of SafePath's and 1/200 of SeqPT's**.
- **Faster, and able to handle large data.** SeqPT ran out of memory on the largest metro data set even with a three-level tree. With a five-level tree on the smallest data set, our run time was about **2/3 of SafePath's and 1/30 of SeqPT's**, and the advantage grew with larger data sets and more time slots.
- **Scales to large location domains.** On the Beijing data, our algorithm finished every tree height from 2 to 5 (about 2,000 seconds at the deepest), while SafePath took 8,976 seconds at height 3 and could not finish at heights 4 and 5. SeqPT could not finish at all.

<figure>
  <img src="/media/li-ppdp-smart-card-trc-2020/utility-comparison.png" alt="Four line charts, one per metro data set, of average relative error against prefix tree height from 2 to 5. Our algorithm (crosses) is below SafePath (triangles) at every point; on Dataset 1, SeqPT (squares) rises steeply to an error of about 7" loading="lazy" />
  <figcaption>Average relative error of the published data, by tree height, on the four Shenzhen Metro data sets (lower is better). Our algorithm (×) is more accurate than SafePath (△) at every height, and far more accurate than SeqPT (□), which could only run on Dataset 1. Image: from the paper.</figcaption>
</figure>

<figure>
  <img src="/media/li-ppdp-smart-card-trc-2020/runtime-comparison.png" alt="Four line charts of run time against prefix tree height from 2 to 5. Our algorithm (crosses) is fastest in all four; SafePath (triangles) is next; on Dataset 1, SeqPT (squares) grows much faster than both" loading="lazy" />
  <figcaption>Run time by tree height on the same four data sets. The gap between our algorithm (×) and SafePath (△) widens on the larger data sets (Datasets 3 and 4). Image: from the paper.</figcaption>
</figure>

<figure>
  <img src="/media/li-ppdp-smart-card-trc-2020/large-domain-comparison.png" alt="Two charts on log scales against prefix tree height from 2 to 5. Left, run time: our algorithm rises from about 134 to 2,007 seconds, while SafePath jumps from 1,077 to 8,976 seconds and stops at height 3. Right, error: ours rises slowly from 0.0035 to 0.0085, while SafePath jumps from 0.0025 to 0.0203 and stops at height 3" loading="lazy" />
  <figcaption>The test with 1,571 locations (Beijing GPS data). SafePath stops after a tree height of 3; our algorithm keeps going, with error staying below 0.01. Image: from the paper.</figcaption>
</figure>

## What can this be used for?

- **Transit agencies and cities that want to open their fare data.** The algorithm turns raw smart card records into a data set that can be shared with researchers, consultants or the public, with a mathematical privacy guarantee instead of a hope that removing names is enough.
- **Planners and analysts who use shared data.** Origin-destination counts, station loads and trip-chain patterns can still be computed from the published data with small error.
- **Other trajectory data.** The same approach applies directly to other location traces, such as data from navigation apps, ridesharing services and social media check-ins.
- **Policy makers.** The re-identification numbers in this paper are a concrete reminder that “anonymized” travel data still carry real privacy risk.

Future work will look at choosing the tree height and the budget and threshold settings automatically, and at data structures other than the prefix tree. A later study from the lab takes up the budget question on the same Shenzhen data: [how to split a fixed privacy budget for transit trip data](/chen-ppdp-privacy-budget-tits-2023/).
