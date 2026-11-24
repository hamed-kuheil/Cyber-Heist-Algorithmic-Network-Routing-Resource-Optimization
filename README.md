<div align="center">

# 🕶️ CYBER HEIST
### Algorithmic Network Routing & Resource Optimization

**A browser-based educational game for the Analysis of Algorithms course**

<p>
  <img src="https://img.shields.io/badge/COURSE-Analysis%20of%20Algorithms-7C3AED?style=for-the-badge" alt="Course: Analysis of Algorithms" />
  <img src="https://img.shields.io/badge/PROJECT-University%20Course%20Project-0EA5E9?style=for-the-badge" alt="University course project" />
  <img src="https://img.shields.io/badge/PLATFORM-Browser-06B6D4?style=for-the-badge" alt="Browser game" />
</p>
<p>
  <img src="https://img.shields.io/badge/HTML5-Structure-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-Interface-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-Game%20Logic-F7DF1E?style=flat-square&logo=javascript&logoColor=111111" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Algorithms-Dijkstra%20%7C%200%2F1%20Knapsack-10B981?style=flat-square" alt="Dijkstra and Knapsack" />
  <img src="https://img.shields.io/badge/Mode-Offline%20Ready-16A34A?style=flat-square" alt="Offline ready" />
</p>

---

### 🎮 Plan the route. ⚙️ Optimize your tools. 🔐 Complete the heist.

</div>

## 📌 Project at a Glance

| | Details |
|---|---|
| **Project** | Cyber Heist — Algorithmic Network Routing & Resource Optimization |
| **Course** | Analysis of Algorithms |
| **Instructor** | Mr. Muhammad Usman Sharif |
| **Semester** | Spring 2026 |
| **Team Member 1** | Nour Aldin Qwaider — **71604** |
| **Team Member 2** | Hamed Kuheil — **71590** |
| **Main Algorithms** | Dijkstra’s Shortest-Path and 0/1 Knapsack |

## 🧭 Table of Contents

- [🌐 About the Project](#-about-the-project)
- [✨ Game Features](#-game-features)
- [🕹️ How to Play](#️-how-to-play)
- [🧠 Algorithms Behind the Game](#-algorithms-behind-the-game)
- [📊 Big O Complexity](#-big-o-complexity)
- [🚀 Run the Game](#-run-the-game)
- [⌨️ Controls](#️-controls)
- [🧰 Technology Stack](#-technology-stack)
- [📁 Project Structure](#-project-structure)
- [⚠️ Scope & Limitations](#️-scope--limitations)
- [🔮 Future Improvements](#-future-improvements)
- [📚 References](#-references)

## 🌐 About the Project

**Cyber Heist** is an interactive browser game created as a university project for the **Analysis of Algorithms** course. It turns two important algorithmic problems into a cyber-heist mission:

- **Network routing:** Find a minimum-cost path from the starting node to the target.
- **Resource optimization:** Choose the most valuable set of tools without exceeding the available capacity.

The player takes the role of a cyber operative navigating a fictional computer network. Each device is represented by a **node**, and each connection has a **weight** representing its cost.

> 🎯 **Main learning goal:** Understand how algorithm design helps solve routing and resource-allocation problems through an interactive example.

## ✨ Game Features

<table>
  <tr>
    <td width="50%">
      <h3>🗺️ Interactive Network</h3>
      Explore a weighted graph, inspect nodes, and move around the network map.
    </td>
    <td width="50%">
      <h3>🧭 Shortest-Path Search</h3>
      Run Dijkstra’s algorithm and watch the visited nodes and final route appear.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎒 Smart Tool Selection</h3>
      Choose from six tools, each with its own weight and value.
    </td>
    <td width="50%">
      <h3>⚖️ Loadout Optimization</h3>
      Use 0/1 Knapsack to maximize tool value within a capacity of **12**.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🏁 Three Missions</h3>
      Play The Infiltration, Firewall Maze, and The Final Heist.
    </td>
    <td width="50%">
      <h3>📟 Mission Feedback</h3>
      Review route cost, selected tools, execution log, and game score.
    </td>
  </tr>
</table>

## 🕹️ How to Play

1. **Choose a mission** from the Mission menu.
2. **Review the network** and identify the start node (`S`) and target node (`T`).
3. **Prepare your tools:** select tools manually or use **Optimize Loadout**.
4. **Plan your route:** click **Run Dijkstra** to calculate and animate the minimum-cost path.
5. **Review the result:** check the visited nodes, route cost, selected tools, and score.
6. **Try again:** use **Reset Mission** to restart the current mission.

<blockquote>
  💡 <strong>Tip:</strong> A good mission plan needs both parts: an efficient route and a useful tool selection that stays within the capacity limit.
</blockquote>

## 🧠 Algorithms Behind the Game

### 1. 🧭 Dijkstra’s Shortest-Path Algorithm

Dijkstra’s algorithm finds a minimum-cost path from a source node to other nodes in a weighted graph, as long as all edge weights are **non-negative**.

**How it works in Cyber Heist:**

1. Set the distance to the start node (`S`) to `0`; set all other distances to infinity.
2. Select the unvisited node with the smallest known distance.
3. Mark that node as visited.
4. Check its neighbors and update their distances when a cheaper route is found. This is called **relaxation**.
5. Continue until the target node (`T`) is reached, then rebuild the path using predecessor links.
6. Show the visited nodes and highlight the final route on the map.

**Example from Mission 1:**

```text
S → B → C → E → G → T
Total route cost = 2 + 2 + 3 + 2 + 3 = 12
```

The route is calculated from the mission graph when the algorithm runs; it is not simply displayed as a fixed answer.

### 2. 🎒 0/1 Knapsack — Dynamic Programming

The 0/1 Knapsack problem selects items with the highest possible total value while keeping their total weight within a fixed capacity. Each item can be selected **once or not selected**.

**How it works in Cyber Heist:**

1. Every tool has a weight and a value.
2. The maximum available capacity is `12` units.
3. A dynamic-programming table stores the best value possible for each capacity as tools are considered.
4. The algorithm checks whether adding the current tool improves the result without exceeding capacity.
5. The solution is reconstructed to display the selected tools, total weight, and total value.

Use **Optimize Loadout** to calculate the best-value selection, or choose tools manually.

## 📊 Big O Complexity

Let:

- `V` = number of vertices (network nodes)
- `E` = number of edges (network connections)
- `n` = number of available items (tools)
- `W` = maximum load capacity

| Algorithm / Implementation | Time Complexity | Space Complexity |
|---|---:|---:|
| Dijkstra — standard implementation with a binary min-heap | `O((V + E) log V)` | `O(V + E)` |
| Dijkstra — current browser implementation using a sorted array queue | `O(E² log E)` conservative worst-case bound | `O(V + E)` |
| 0/1 Knapsack — dynamic programming with reconstruction table | `O(nW)` | `O(nW)` |

<blockquote>
  ⚙️ <strong>Implementation note:</strong> The current browser version of Dijkstra uses a simple array as its priority queue and sorts the array during extraction. It does <strong>not</strong> use a binary heap. Therefore, the binary-heap complexity shown above is a standard alternative, not the complexity of the current implementation.
</blockquote>

For Knapsack, the one-dimensional value array uses `O(W)` space. The additional reconstruction table uses `O(nW)` space, so the overall space complexity is `O(nW)`.

## 🚀 Run the Game

<details open>
<summary><strong>▶️ Option 1 — Open locally (quick start)</strong></summary>

1. Download or clone this repository.
2. Open the project folder.
3. Open `Game/index.html` in a modern browser such as Google Chrome, Microsoft Edge, or Firefox.
4. Start a mission and play.

No backend, database, API key, or external Python package is required.

</details>

<details>
<summary><strong>💻 Option 2 — Clone using Git</strong></summary>

```bash
git clone <your-repository-url>
cd <your-repository-folder>
```

Then open `Game/index.html` in your browser.

</details>

## ⌨️ Controls

| Control | Action |
|---|---|
| **Mission selector** | Switch between the three network missions. |
| **Tool checkboxes** | Add or remove tools from the loadout. |
| **Optimize Loadout** | Run 0/1 Knapsack on the tools and available capacity. |
| **Run Dijkstra** | Calculate and animate the minimum-cost route from `S` to `T`. |
| **Animation Speed** | Change the route-visualization speed. |
| **Click a node** | Display information about the selected network node. |
| **Drag on the map** | Move the network map view. |
| **Reset Mission** | Reset the current mission and its visual state. |

## 🧰 Technology Stack

<p>
  <img src="https://img.shields.io/badge/HTML5-Game%20Structure-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-UI%20%26%20Styling-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-Game%20Logic-F7DF1E?style=flat-square&logo=javascript&logoColor=111111" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Canvas-Graph%20Visualization-0F766E?style=flat-square" alt="Canvas" />
</p>

- **HTML5** — game structure
- **CSS3** — layout, styling, and visual effects
- **JavaScript** — gameplay and algorithm implementation
- **HTML Canvas API** — drawing and animating the network graph
- **Python** — optional reference implementations for algorithm study

## 📁 Project Structure

```text
Cyber-Heist/
├── Game/
│   ├── index.html
│   ├── styles.css
│   ├── game.js
│   ├── README_GAME.txt
│   └── algorithms/
│       ├── algorithms.js
│       └── reference_algorithms.py
├── Documentation/
│   ├── Cyber_Heist_Report.docx
│   └── Cyber_Heist_Report.pdf
├── Presentation/
│   └── Cyber_Heist_Presentation.pptx
├── requirements.txt
└── README.md
```

## ⚠️ Scope & Limitations

- The network and missions are fictional simulations for learning algorithms.
- The game does **not** scan, access, attack, or exploit real networks or devices.
- Dijkstra’s algorithm requires non-negative edge weights. It is not suitable for graphs with negative edge weights.
- The current browser implementation uses a sorted array for Dijkstra’s priority queue; a binary min-heap could improve scalability.
- The game score is an illustrative gameplay score. It is **not** an algorithm-speed benchmark or a measure of real cybersecurity skill.
- No machine-specific performance benchmark is claimed. Any timing or memory comparison should be measured on the machine and runtime used for the experiment.

## 🔮 Future Improvements

- ⚡ Replace the array-based priority queue with a binary min-heap.
- 🧩 Add more network layouts, missions, and difficulty levels.
- 📈 Add benchmark tools to compare algorithms on larger graphs.
- 🧠 Add alternative shortest-path algorithms, such as Bellman–Ford or A*.
- 🎒 Add more resource-allocation scenarios and configurable tool inventories.

## 📚 References

1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
2. Dijkstra, E. W. (1959). A note on two problems in connexion with graphs. *Numerische Mathematik, 1*, 269–271. https://doi.org/10.1007/BF01386390
3. Bellman, R. (1957). *Dynamic Programming*. Princeton University Press.
4. Kleinberg, J., & Tardos, É. (2006). *Algorithm Design*. Pearson.
5. MDN Web Docs. [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

---

<div align="center">

### 🕶️ CYBER HEIST
**Analysis of Algorithms — University Course Project · Spring 2026**

*Designed to make algorithmic thinking interactive.*

</div>
