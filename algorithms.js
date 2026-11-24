/* Core algorithms used by Cyber Heist. No dependencies; browser + Node compatible. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CyberAlgorithms = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  class MinHeap {
    constructor() { this.items = []; }
    get size() { return this.items.length; }
    push(entry) {
      this.items.push(entry);
      let index = this.items.length - 1;
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.items[parent].priority <= entry.priority) break;
        this.items[index] = this.items[parent];
        index = parent;
      }
      this.items[index] = entry;
    }
    pop() {
      if (!this.items.length) return null;
      const first = this.items[0];
      const last = this.items.pop();
      if (this.items.length) {
        let index = 0;
        while (true) {
          const left = index * 2 + 1;
          const right = left + 1;
          if (left >= this.items.length) break;
          let child = left;
          if (right < this.items.length && this.items[right].priority < this.items[left].priority) child = right;
          if (this.items[child].priority >= last.priority) break;
          this.items[index] = this.items[child];
          index = child;
        }
        this.items[index] = last;
      }
      return first;
    }
  }

  /** Dijkstra shortest path for an undirected, non-negative weighted graph. */
  function dijkstra(nodes, edges, startId, endId) {
    const nodeIds = new Set(nodes.map(node => node.id));
    if (!nodeIds.has(startId) || !nodeIds.has(endId)) {
      return { path: [], cost: Infinity, visitedOrder: [], distances: {}, previous: {}, reachable: false };
    }

    const adjacency = new Map(nodes.map(node => [node.id, []]));
    for (const edge of edges) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue;
      if (!Number.isFinite(edge.weight) || edge.weight < 0) {
        throw new RangeError('Dijkstra requires finite, non-negative edge weights.');
      }
      adjacency.get(edge.from).push({ id: edge.to, weight: edge.weight });
      adjacency.get(edge.to).push({ id: edge.from, weight: edge.weight });
    }

    const distances = Object.fromEntries(nodes.map(node => [node.id, Infinity]));
    const previous = Object.fromEntries(nodes.map(node => [node.id, null]));
    const visitedOrder = [];
    const settled = new Set();
    const heap = new MinHeap();
    distances[startId] = 0;
    heap.push({ id: startId, priority: 0 });

    while (heap.size) {
      const current = heap.pop();
      if (settled.has(current.id) || current.priority !== distances[current.id]) continue;
      settled.add(current.id);
      visitedOrder.push(current.id);
      if (current.id === endId) break;

      for (const neighbor of adjacency.get(current.id)) {
        if (settled.has(neighbor.id)) continue;
        const candidate = distances[current.id] + neighbor.weight;
        if (candidate < distances[neighbor.id]) {
          distances[neighbor.id] = candidate;
          previous[neighbor.id] = current.id;
          heap.push({ id: neighbor.id, priority: candidate });
        }
      }
    }

    if (!Number.isFinite(distances[endId])) {
      return { path: [], cost: Infinity, visitedOrder, distances, previous, reachable: false };
    }

    const path = [];
    let cursor = endId;
    while (cursor !== null) {
      path.unshift(cursor);
      if (cursor === startId) break;
      cursor = previous[cursor];
    }
    if (path[0] !== startId) {
      return { path: [], cost: Infinity, visitedOrder, distances, previous, reachable: false };
    }
    return { path, cost: distances[endId], visitedOrder, distances, previous, reachable: true };
  }

  /** Exact 0/1 knapsack dynamic programming with item reconstruction. */
  function solveKnapsack(items, capacity) {
    if (!Number.isInteger(capacity) || capacity < 0) {
      throw new RangeError('Knapsack capacity must be a non-negative integer.');
    }
    for (const item of items) {
      if (!Number.isInteger(item.weight) || item.weight <= 0 || !Number.isFinite(item.value) || item.value < 0) {
        throw new RangeError('Each item must have a positive integer weight and a non-negative finite value.');
      }
    }

    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    for (let i = 1; i <= n; i += 1) {
      const item = items[i - 1];
      for (let w = 0; w <= capacity; w += 1) {
        dp[i][w] = dp[i - 1][w];
        if (item.weight <= w) {
          const candidate = item.value + dp[i - 1][w - item.weight];
          if (candidate > dp[i][w]) dp[i][w] = candidate;
        }
      }
    }

    const selected = [];
    let remaining = capacity;
    for (let i = n; i > 0; i -= 1) {
      if (dp[i][remaining] !== dp[i - 1][remaining]) {
        const item = items[i - 1];
        selected.unshift(item);
        remaining -= item.weight;
      }
    }
    const totalWeight = selected.reduce((sum, item) => sum + item.weight, 0);
    const totalValue = selected.reduce((sum, item) => sum + item.value, 0);
    return {
      selected,
      selectedIds: selected.map(item => item.id),
      totalWeight,
      totalValue,
      remainingCapacity: capacity - totalWeight,
      capacity,
      dp
    };
  }

  return { dijkstra, solveKnapsack };
});
