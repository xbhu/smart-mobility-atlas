---
tldr: >-
  We worked out how to split a fixed "privacy budget" across a transit trip database so that published
  smart card data stays provably private yet as accurate as possible; on 2.8 million Shenzhen Metro riders,
  our method gave the most accurate published data of four methods tested and ran in under three minutes.
hero:
  image: /media/chen-ppdp-privacy-budget-tits-2023/linkage-attack.png
  alt: Diagram of a linkage attack on Shenzhen Metro smart card data. Alice's two known trips, Bu Xin around 07:25 and Long Cheng Square around 08:14, match only one pseudo identifier, 20015461, which reveals her full travel history and her likely home (Buxin) and work (Longcheng Square). A second person, Frank, is matched the same way from a bus transfer near Gangxia
  caption: >-
    Removing names is not enough. If someone knows just two of Alice's trips, say from a social media post,
    only one card in the "anonymous" Shenzhen Metro data fits (20015461). That card then gives away her
    whole travel history and, with it, where she likely lives and works.
affiliations:
  - The Pennsylvania State University
  - Guangdong University of Technology
author_affiliations: [[1], [1], [2], [1]]
abstract: |-
  Trajectory datasets have been widely used in transportation research, but the risk of privacy breach comes with data sharing. Privacy budget allocation is a key step of the differential privacy (DP)-based privacy-preserving data publishing (PPDP) algorithm development, as it directly impacts the data utility of the released dataset. Most prior research used simple logic to allocate privacy budgets, such as evenly distributing them among different tree levels, without theoretical support to reach optimality. This manuscript presents the development of an optimal privacy budget allocation algorithm for transit smart card data, with the goal of publishing non-interactive sanitized trajectory data under a differential privacy definition. To this end, the smart card trajectory data are first stored in a prefix tree structure, and a query probability model is developed to quantitatively measure the probability of a trajectory location pair being queried. Next, the privacy budget is optimized for each prefix tree node to minimize the query error, while satisfying the differential privacy definition. The Lagrangian relaxation method is adopted to derive the optimal privacy budget values, and several propositions on the solution property are proposed and proved. Real-life metro smart card data from Shenzhen, China that include a total of 2.8 million individual travelers and over 220 million records are used in the case study section. The developed algorithm is demonstrated to output a sanitized dataset with the highest utilities when compared with three benchmark algorithms. Sensitivity analysis shows that the resulting data utility remains stable when the privacy budget changes. The runtime of the proposed algorithm is less than 160 seconds in all experiments, exhibiting good computational efficiency.
key_numbers:
  - { value: "30.7%", label: "of transit riders identifiable from just two card taps, in our earlier study of the same data" }
  - { value: "2.8 million", label: "Shenzhen Metro riders and 220 million records used to test the method" }
  - { value: "0.8–7.6%", label: "average query error on the published data, the lowest of four methods" }
  - { value: "< 3 min", label: "to produce the protected data set in every experiment" }
updated: 2026-10-27
---

## What problem does this research solve?

Transit smart cards, GPS devices and phones record where and when millions of people travel. Shared openly, these **trajectory data** are enormously useful for planning routes, schedules and stations. Agencies usually remove names and card numbers first and assume that makes the data safe. It does not.

Knowing just a 5-digit ZIP code, date of birth and gender is enough to single out about **87% of people in the U.S.** Using exactly this kind of linking, the medical records of then Massachusetts Governor William Weld were picked out of an "anonymized" health database and sent to his office. Travel data are no different: in our earlier study of Shenzhen Metro smart card data, **30.7% of riders could be uniquely identified from just two card taps**. If Alice posts that she was at Buxin station at 7:25 a.m. and checked in at Longcheng Square at 8:14 a.m., an attacker can find the one card that matches, then read where she went last weekend and whether she went home after work last Wednesday.

<figure>
  <img src="/media/chen-ppdp-privacy-budget-tits-2023/trips-prefix-tree.png" alt="Left, a table of eight short sample trips such as 1Y to 4X and 2X to 3Z to 4Y. Right, the same trips drawn as a tree: a root node A branches to B through F, and each further branch adds the next check-in, so trips that start the same way share the same branch" loading="lazy" />
  <figcaption>How trips are stored before they are protected. Each label is a time slot and a station (1Y = time 1, station Y). Left: eight sample trips. Right: the same trips as a <strong>prefix tree</strong>, where trips that start the same way share a branch and each node counts how many trips pass through it. Image: from the paper.</figcaption>
</figure>

The gold standard for protecting such data is **differential privacy**. Before release, carefully sized random noise is added to the counts, so that the published data look almost the same whether or not any one person is in them. No matter what an attacker already knows, they cannot tell whether Alice is in the data. How much noise to add is set by a single number, the **privacy budget ε** (epsilon): the smaller it is, the stronger the protection and the more noise.

The catch is that this one budget has to be shared across the whole tree, and every node that gets a smaller share gets more noise. Earlier methods (SeqPT and SafePath) split it **evenly across the levels of the tree**. Our lab's earlier algorithm (Li et al., 2020) gave lower levels a growing share using a rule of thumb. Both are easy to use, but neither is designed to give the most accurate data the budget allows.

## What did we do?

We turned budget allocation into an **optimization problem**: give each node of the tree its own share of the budget, so that the published data answer users' questions as accurately as possible while still meeting the differential privacy guarantee.

<figure>
  <img src="/media/chen-ppdp-privacy-budget-tits-2023/pipeline.png" alt="Flow chart: original trajectory, build tree, prefix tree, allocate budget, customized budget, add noise, sanitized tree, output, sanitized trajectory" loading="lazy" />
  <figcaption>The publishing pipeline. Raw trips are stored as a prefix tree, each node gets its own budget, noise sized to that budget is added to the counts, and the noisy ("sanitized") tree is turned back into trips that can be released. Our contribution is the "allocate budget" step.</figcaption>
</figure>

The method works in three steps:

1. **Estimate how often each part of the data will be asked about.** Noise on a node that many questions touch does more damage than noise on one that is rarely used. Without assuming anything about what an attacker knows, we derived the probability that a random question involves each node of the tree, working up from the leaves to the root.
2. **Optimize the budget for every node.** We set up a model that minimizes the expected error of the published counts, weighted by those probabilities. The constraint is what makes the result private: along every path from the root to a leaf, which is one complete trip, the budgets must add up to exactly the total budget ε.
3. **Solve it with Lagrangian relaxation.** We derived the optimal budget values with this standard optimization technique, and proved several properties of the solution that keep the computation simple even for very large trees.

<figure>
  <img src="/media/chen-ppdp-privacy-budget-tits-2023/budget-tree.png" alt="The same example tree with a budget value in each node instead of a letter: 0.32 at the root, between 0.26 and 0.38 on the second level, and between 0.18 and 0.4 further down" loading="lazy" />
  <figcaption>Per-node budgets illustrated on the sample tree with a total budget of ε = 1. Each node gets its own share instead of an even split by level, and the shares along any root-to-leaf path add up to the total (for example, 0.32 + 0.38 + 0.3 = 1), which is what keeps every trip protected. Image: from the project slides.</figcaption>
</figure>

We then add noise to each node according to its budget and convert the noisy tree back into trips. We showed that the whole procedure satisfies ε-differential privacy.

## What are the key findings?

We tested the method on **real Shenzhen Metro smart card data covering 2.8 million riders and more than 220 million records**, using four extracts of 0.39 to 0.85 million trips across the network's 121 stations. We compared it with SeqPT, SafePath and Li's algorithm, all implemented by our team and checked against the results in their original papers. Accuracy was measured as the **average relative error of count queries**, questions such as "how many riders went from station X in one time slot to station Y in the next," comparing the published data with the original.

- **Most accurate in every test.** Our method had the lowest error on all four data sets at every tree height tested, with errors of **0.8% to 7.6%**. SeqPT had the largest errors on the smallest data set and could not produce a result at all on the three larger ones.

<figure>
  <img src="/media/chen-ppdp-privacy-budget-tits-2023/error-comparison.png" alt="Four line charts, one per data set, of average relative error against prefix tree height from 2 to 5. The red line for our algorithm is lowest in every panel; SafePath (blue) is highest in data sets 2 to 4, and SeqPT (black) shoots up to 7.02 in data set 1 and is absent from the others" loading="lazy" />
  <figcaption>Average relative error for the four methods on the four data sets (lower is better). Our algorithm (red) is the most accurate everywhere. SeqPT (black) appears only in data set 1 because it failed to run on the larger ones. Image: from the paper.</figcaption>
</figure>

- **Fast enough for routine use.** Every run finished within about **160 seconds**, under three minutes, and the time grew roughly in a straight line as the tree got taller. Our method is a little slower than Li's algorithm because of the extra optimization step and similar to SafePath. Since data releases are prepared offline, a few minutes is acceptable.

<figure>
  <img src="/media/chen-ppdp-privacy-budget-tits-2023/runtime-comparison.png" alt="Four line charts of runtime in seconds against prefix tree height for the four data sets. Our algorithm (red) stays under three minutes on every data set; SeqPT (black) climbs to about 115 seconds on data set 1 alone" loading="lazy" />
  <figcaption>Runtime of the four methods. The optimization costs some extra time compared with Li's algorithm (purple), but the whole job still takes no more than a few minutes on hundreds of thousands of trips. Image: from the paper.</figcaption>
</figure>

- **Stable across privacy settings.** Over 40,000 random queries, the average error moved only from 0.0398 to 0.0417 as the total budget ranged from 0.5 to 1.25.
- **Most of the time goes to adding noise.** On the largest data set the whole job took under 100 seconds; about 75% of it was adding noise to the tree and about 15% was building the tree from the raw data.
- **The tree height needs tuning.** Accuracy did not simply rise or fall as the tree got taller, so the best height should be chosen for each data set.

## What can this be used for?

- **Transit agencies and open-data programs** can publish smart card or other trip data for research and planning with a formal privacy guarantee, instead of relying on removing names and IDs.
- **Data users** get published data that are as accurate as the chosen privacy level allows, so origin-destination counts, ridership patterns and travel behavior analyses stay reliable.
- **Researchers building privacy-preserving methods** can plug the budget optimization into other tree-based differential privacy algorithms, which so far split the budget by fixed rules.

The method assumes that any question about the data is equally likely to be asked, which matches the differential privacy idea of making no assumption about the attacker. It builds on our earlier smart card privacy algorithm (Li, Yang and Hu, 2020) and uses the same Shenzhen Metro data, so the two can be compared directly.
