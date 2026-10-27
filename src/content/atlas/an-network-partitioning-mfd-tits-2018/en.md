---
tldr: >-
  We built an algorithm that splits a city's road network into areas where traffic behaves alike, so
  each area can be monitored and controlled with one simple network-level model; on Tucson's
  38,000-link regional network it chose 20 areas on its own in under 10 minutes, and it does not
  need traffic data on every road.
hero:
  image: /media/an-network-partitioning-mfd-tits-2018/tucson-partition.jpg
  alt: >-
    Map of the Tucson and Pima County road network drawn as thin lines, colored in 20 groups with a
    numbered legend from 1 to 20. Dense, small, tightly packed colored areas fill the central city,
    while long sparse lines reach out to the rural south and west
  caption: >-
    The algorithm's answer for Tucson at 8:00 AM: 20 subnetworks, one color each. Nobody told it to
    find 20; the number came out of the network's own congestion pattern. Compact areas form in the
    dense center, while a few cover the sparse outskirts.
  credit: From the paper
affiliations:
  - Tongji University
  - University of Arizona
  - Metropia Inc.
author_affiliations: [[1], [2], [3], [1]]
abstract: |-
  The existence of a Macroscopic Fundamental Diagram (MFD) in a network/subnetwork allows one to formulate hierarchical traffic management strategies. In order to achieve this, a robust and efficient network partitioning algorithm is needed. This research aims to create such an algorithm, where distinct MFD properties exist for each respective partition. The proposed four-step network partition approach utilizes the concept of lambda-connectedness and the technique of region growing, and, unlike prior studies, can work with partial traffic data. This research brings forth the following contributions: 1) an algorithmic approach that allows for incomplete traffic datasets as an input, and 2) an approach that does not require the user to arbitrarily pre-determine the number of necessary subnetworks. The proposed algorithmic approach can intuitively decide on the number of partitions based on the network connectivity and traffic congestion patterns.

  The proposed approach was implemented and tested on the regional planning network of Tucson/Pima County Arizona. The MFD related statistics for each subnetwork are presented and discussed. Numerical analysis on lambda choice and algorithm sensitivity regarding different data missing ratios were also performed and elaborated.
key_numbers:
  - { value: "38,000+", label: "road links in the Tucson/Pima County network, partitioned in under 10 minutes" }
  - { value: "20", label: "subnetworks, a number the algorithm chose by itself" }
  - { value: "40%", label: "of links with traffic data is enough to keep about half of the full-data answer" }
updated: 2026-10-27
---

## What problem does this research solve?

Traffic engineers know the **fundamental diagram** of a single road: as more cars crowd onto it, the flow of cars past a point rises, peaks at a critical density, and then falls as the road jams. In 2007 and 2008, researchers showed that a whole city district can have a similar curve, the **Macroscopic Fundamental Diagram (MFD)**. It relates the average density of vehicles across the area to the average flow, without looking at any single street.

The MFD is useful because it lets a city manage traffic **area by area**, without modeling every street. If a district is close to the peak of its curve, the city can hold back cars at its edges (perimeter or "gating" control), steer drivers around it, or price entry into it, and keep the whole network moving at its best rate. Modeling tens of thousands of individual links in real time is too slow for that; a handful of area curves is not.

The catch: a clean MFD appears only when traffic inside the area is **fairly uniform**. A real city mixes a jammed downtown with free-flowing suburbs, and an MFD drawn over both turns into a scattered cloud of points. So the city must first be cut into **homogeneous subnetworks**. Earlier methods for this had three practical problems:

- They cut the network in two again and again, and stop only at a **number of pieces the user picks in advance**, with no good rule for picking it.
- They assume **traffic data on every road**. Real cities have detectors on some roads, not all.
- They can be **slow**: one method failed to finish in reasonable time on the Dallas-Fort Worth regional network.

## What did we do?

We wrote a partitioning algorithm that grows areas from the bottom up instead of cutting from the top down. It borrows **region growing** from image processing, the idea behind a photo editor's "magic wand": start from one pixel and keep adding neighbors whose color is close enough. Here each road link plays the role of a pixel, and its traffic density plays the role of color. The algorithm works in four steps.

<figure>
  <img src="/media/an-network-partitioning-mfd-tits-2018/four-steps.png" alt="Four boxes in two rows connected by yellow arrows. 1, Grow by link: start from a seed link and keep adding neighboring links with similar density. 2, Grow by region: treat each region as one node and join neighboring regions that look alike. 3, Merge small regions: fold the smallest region into its most similar neighbor until each has 100 or more links. 4, Draw boundaries: give each subnetwork a convex boundary and split any area where two overlap" loading="lazy" />
  <figcaption>The four steps. Steps 1 and 2 make areas uniform inside; step 3 keeps them big enough to have an MFD (at least 100 links, following earlier studies); step 4 gives them clean edges that a traffic control plan can use. Diagram based on the paper's workflow.</figcaption>
</figure>

To test it we used the **regional planning network of Tucson and Pima County, Arizona**, with more than **38,000 road links**. A full day of traffic demand was run through the DynusT traffic simulation model, which had been calibrated with traffic counts and speed profiles and checked by the local transportation agency. We partitioned the network at **8:00 AM**, when it is heavily congested and different parts of the city are congested to different degrees.

## What is the key methodological contribution?

The core idea is a way to measure how alike two links are, even when there is no data in between. It is called **lambda-connectedness** and comes from image segmentation.

- **Neighbor score.** For two adjacent links, the score is 1 when their densities are equal and drops toward 0 as their densities differ (the paper uses e to the power of minus the squared density difference).
- **Path score.** Along a chain of links, the score is the **weakest step**. The paper's analogy: the water a tube can carry is set by its narrowest point.
- **Connectedness.** Between any two links, the score is the **best path** among all paths that connect them through links with data.
- **The threshold λ.** Two links can share a subnetwork if their connectedness is at least λ.

<figure>
  <img src="/media/an-network-partitioning-mfd-tits-2018/lambda-connectedness.png" alt="Network sketch with two dark nodes, link x and link y, joined by three paths. Path A, dashed and grey, runs through a node marked with a question mark, a link with no detector, so it cannot be scored. Path B has steps of 0.9 and 0.2, so its weakest step is 0.2. Path C has steps of 0.7, 0.8 and 0.6, so its weakest step is 0.6. Below: connectedness of x and y equals the best path's weakest step, max of 0.2 and 0.6, which is 0.6; with lambda 0.1, x and y can belong to the same subnetwork" loading="lazy" />
  <figcaption>How lambda-connectedness scores two links. A path through a link with no detector cannot be scored, but that does not matter as long as some other path with data connects them. The step values here are made up to show the rule. Illustration based on the paper's definitions.</figcaption>
</figure>

This definition gives the method three properties that the earlier graph-cut approaches lacked:

- **It works with partial data.** Any two links have a score as long as at least one path with data connects them. Links with no data are carried along as tiny one-link clusters and folded into the most similar neighboring subnetwork during merging.
- **The number of subnetworks is an output, not an input.** Growth stops where no neighbor passes the threshold, so the city's own congestion pattern decides how many areas there are. The analyst chooses λ, which has a physical meaning: λ = 0.1 lets neighboring links differ by up to about **1.52 vehicles per lane per mile**.
- **It is fast.** The search visits each link only once, so the work grows in step with the size of the network.

In step 2, each area from step 1 becomes a single node, scored by its average density weighted by lane length, and the same growing rule runs again one level up. This captures how congestion spreads from one patch of streets to the next.

<figure class="figure-narrow">
  <img src="/media/an-network-partitioning-mfd-tits-2018/subnetwork-to-graph.png" alt="Sketch of black dots, each a road link, grouped by dashed outlines into three areas labeled A, B and C. A callout shows the same three areas as three nodes joined in a triangle" loading="lazy" />
  <figcaption>Step 2 in one picture. Each dot is a road link. After step 1 the links form areas A, B and C; the algorithm then treats each area as a single node, links nodes whose areas touch, and grows again. Image: from the paper.</figcaption>
</figure>

## What are the key findings?

**Twenty well-separated areas, found in minutes.** At λ = 0.1 the algorithm divided Tucson into **20 subnetworks** of **326 to 5,206 links**. Average density inside them ranged from **0.8 to 26.22 vehicles per lane per mile**, with small variation inside each subnetwork. The run took **under 10 minutes** on the Tucson network and under 15 minutes on the Houston regional network, fast enough for real-time control. On a separation score (NS) that compares each subnetwork with its most similar neighbor, where lower is better, the partition averaged **0.589**, against 0.621 reported for an earlier three-step method.

<figure>
  <img src="/media/an-network-partitioning-mfd-tits-2018/subnetwork-sizes.png" alt="Bar chart of the number of road links in each of the 20 subnetworks, from 5,206 links in subnetwork 1 down to 326 in subnetwork 20. Bars for subnetworks 7, 8, 18 and 19 are yellow, the rest dark blue" loading="lazy" />
  <figcaption>Sizes of the 20 subnetworks. All are well above the 100-link minimum. Yellow bars are the four whose MFDs are shown below. Chart drawn from the numbers in the paper (Table 1).</figcaption>
</figure>

**Each area has a clear MFD, and they differ.** Plotting flow against density every 5 minutes over 24 hours gives a clean curve for each subnetwork. Downtown areas 7 and 8, full of local streets, peak at about **200 to 400 vehicles per lane per hour**. Suburban areas 18 and 19, with more high-class roads, peak at about **600 and 800**. That difference is exactly what a single citywide MFD would blur. The critical density, where flow stops rising, is about **20 to 30 vehicles per lane per mile**: close to an earlier simulation study (about 25) and lower than studies based on loop detectors (about 35 and 55), which sit mostly on major roads.

<figure>
  <img src="/media/an-network-partitioning-mfd-tits-2018/subnetwork-mfds.png" alt="Four scatter plots of flow, in vehicles per hour per lane, against density, in hundreds of vehicles per lane per mile, with points colored by time of day from blue at midnight to red at the end of the day. Regions 7 and 8, downtown, rise to about 200 and 300. Region 18, suburban, rises steeply then levels at about 500, with a spread of points at high density. Region 19, suburban, rises almost in a line to about 800" loading="lazy" />
  <figcaption>Network-level flow against density for four subnetworks, one dot per 5 minutes. The horizontal axis is in hundreds of vehicles per lane per mile (0.25 means 25). Downtown areas (top) top out far lower than suburban ones (bottom). Images: from the paper; labels and time scale added.</figcaption>
</figure>

**The curves show which areas to protect.** Some subnetworks show scatter during the morning peak, a sign of a **capacity drop**: once they are overloaded, they move fewer cars. In Tucson, regions **4, 11 and 16** behave this way, so they are the ones a gating or routing strategy should shield at peak hours.

**Choosing λ.** We tested λ from 0.1 down to 0.00001, which lets neighboring densities differ by **1.52 up to 3.39** vehicles per lane per mile. λ = 0.1 gave the most balanced sizes (the smallest largest subnetwork); λ = 0.0001 gave the biggest density differences between subnetworks, with 0.1 second. We used 0.1, but agencies can tune λ to their own goals.

**Missing data.** We removed traffic data from growing shares of the links and compared the result with the full-data partition, link by link. The overlap falls as more data go missing. If an overlap of at least half is acceptable, the method tolerates up to **60% missing data**, so it needs data on about **40% of the links**. Freeways and major arterials usually have detectors, and with data imputation that coverage is within reach for most regions.

<figure class="figure-row">
  <img src="/media/an-network-partitioning-mfd-tits-2018/lambda-sensitivity.png" alt="Line chart against lambda from 0.00001 to 0.1. Maximum subnetwork size, in links, falls steadily from about 5,100 to about 3,400. Subnetwork density variance zigzags, highest at 0.0001, lowest at 0.01, and second-highest at 0.1" loading="lazy" />
  <img src="/media/an-network-partitioning-mfd-tits-2018/missing-data-similarity.png" alt="Line chart of similarity to the full-data result against the share of missing data: 1.0 at 0 percent, about 0.6 at 20 percent, about 0.53 at 40 percent, about 0.5 at 60 percent and about 0.45 at 80 percent" loading="lazy" />
  <figcaption>Left: how λ changes the result. A smaller largest subnetwork (blue) means more balanced sizes; a higher variance (orange) means more distinct areas. Right: how closely the partition matches the full-data answer as data go missing. Images: from the paper.</figcaption>
</figure>

We also noticed that links of the **same road type** tend to land in the same subnetwork, which points to road hierarchy, not only congestion, as a driver of MFD shape.

## What can this be used for?

- **Area-wide traffic control.** The subnetworks are the building blocks for MFD-based perimeter (gating) control, route guidance, congestion pricing zones and parking management, all of which need areas where traffic is uniform.
- **Regions with sparse detectors.** Because it works with partial data, an agency can apply it with the detectors it already has instead of instrumenting every street.
- **Peak-hour planning.** The subnetwork MFDs show which areas lose capacity when overloaded, and so which ones to protect first.
- **No guessing the number of zones.** The analyst sets one threshold with a physical meaning instead of an arbitrary count.

The study partitions one moment, 8:00 AM, on simulated traffic. Because congestion moves through the day, the next step is a **dynamic** partition with a time-varying λ; the 100-link minimum also deserves calibration, and region growing could be combined with graph-cut methods to balance subnetwork sizes.

Transportation network and demand data came from the Pima County Association of Governments (PAG).
