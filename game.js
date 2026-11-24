/* Cyber Heist — local browser game logic. */
(() => {
  'use strict';

  const { dijkstra, solveKnapsack } = window.CyberAlgorithms;
  const $ = (id) => document.getElementById(id);
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const LEVELS = [
    {
      name: 'Ghost Protocol',
      description: 'Recover the encrypted fragments and access the central vault.',
      capacity: 6,
      maxThreat: 37,
      threatLabel: 'LOW SECURITY',
      nodes: [
        { id: 'A', x: 77, y: 250, label: 'ENTRY GATE', short: 'IN', type: 'start', alert: 0 },
        { id: 'B', x: 220, y: 112, label: 'RELAY 01', short: 'R1', type: 'relay', alert: 1 },
        { id: 'C', x: 220, y: 390, label: 'RELAY 02', short: 'R2', type: 'relay', alert: 1 },
        { id: 'D', x: 382, y: 85, label: 'GHOST KEY', short: 'DATA', type: 'data', alert: 1 },
        { id: 'E', x: 392, y: 255, label: 'FIREWALL 01', short: 'FW', type: 'guard', alert: 1 },
        { id: 'F', x: 405, y: 430, label: 'CIPHER CACHE', short: 'DATA', type: 'data', alert: 2 },
        { id: 'G', x: 614, y: 365, label: 'ZERO-DAY INTEL', short: 'DATA', type: 'data', alert: 2 },
        { id: 'H', x: 602, y: 132, label: 'RELAY 03', short: 'R3', type: 'relay', alert: 1 },
        { id: 'I', x: 748, y: 250, label: 'VAULT X', short: 'EXIT', type: 'vault', alert: 2 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 3 },
        { from: 'B', to: 'D', weight: 3 }, { from: 'B', to: 'E', weight: 3 },
        { from: 'C', to: 'E', weight: 4 }, { from: 'C', to: 'F', weight: 3 },
        { from: 'D', to: 'E', weight: 2 }, { from: 'D', to: 'H', weight: 5 },
        { from: 'E', to: 'F', weight: 2 }, { from: 'E', to: 'H', weight: 3 },
        { from: 'E', to: 'G', weight: 4 }, { from: 'F', to: 'G', weight: 4 },
        { from: 'H', to: 'G', weight: 3 }, { from: 'H', to: 'I', weight: 5 },
        { from: 'G', to: 'I', weight: 4 }
      ],
      items: [
        { id: 'ghost', name: 'Ghost Key', nodeId: 'D', weight: 2, value: 34, detail: 'Unlock fragment' },
        { id: 'cipher', name: 'Cipher Cache', nodeId: 'F', weight: 3, value: 48, detail: 'Encrypted archive' },
        { id: 'zero', name: 'Zero-Day Intel', nodeId: 'G', weight: 4, value: 61, detail: 'Exploit intelligence' }
      ]
    },
    {
      name: 'Black Ice District',
      description: 'A segmented subnet. Choose the best intelligence payload and bypass its firewall.',
      capacity: 8,
      maxThreat: 50,
      threatLabel: 'ELEVATED SECURITY',
      nodes: [
        { id: 'A', x: 70, y: 260, label: 'ENTRY GATE', short: 'IN', type: 'start', alert: 0 },
        { id: 'B', x: 205, y: 112, label: 'RELAY 11', short: 'R1', type: 'relay', alert: 1 },
        { id: 'C', x: 205, y: 410, label: 'RELAY 12', short: 'R2', type: 'relay', alert: 2 },
        { id: 'D', x: 350, y: 65, label: 'BLACK ICE KEY', short: 'DATA', type: 'data', alert: 1 },
        { id: 'E', x: 365, y: 230, label: 'DEEP ARCHIVE', short: 'DATA', type: 'data', alert: 2 },
        { id: 'F', x: 388, y: 410, label: 'FIREWALL 02', short: 'FW', type: 'guard', alert: 2 },
        { id: 'G', x: 555, y: 428, label: 'ROOT INTEL', short: 'DATA', type: 'data', alert: 2 },
        { id: 'H', x: 555, y: 226, label: 'RELAY 13', short: 'R3', type: 'relay', alert: 1 },
        { id: 'I', x: 690, y: 105, label: 'RELAY 14', short: 'R4', type: 'relay', alert: 2 },
        { id: 'J', x: 754, y: 275, label: 'VAULT Y', short: 'EXIT', type: 'vault', alert: 3 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 3 }, { from: 'A', to: 'C', weight: 5 },
        { from: 'B', to: 'D', weight: 4 }, { from: 'B', to: 'E', weight: 6 },
        { from: 'B', to: 'F', weight: 4 }, { from: 'C', to: 'F', weight: 3 },
        { from: 'C', to: 'G', weight: 5 }, { from: 'D', to: 'F', weight: 2 },
        { from: 'D', to: 'H', weight: 5 }, { from: 'E', to: 'F', weight: 3 },
        { from: 'E', to: 'H', weight: 4 }, { from: 'F', to: 'G', weight: 3 },
        { from: 'F', to: 'H', weight: 2 }, { from: 'G', to: 'I', weight: 4 },
        { from: 'H', to: 'I', weight: 2 }, { from: 'H', to: 'J', weight: 7 },
        { from: 'I', to: 'J', weight: 4 }
      ],
      items: [
        { id: 'ice', name: 'Black Ice Key', nodeId: 'D', weight: 3, value: 42, detail: 'Firewall credentials' },
        { id: 'archive', name: 'Deep Archive', nodeId: 'E', weight: 4, value: 53, detail: 'Classified records' },
        { id: 'root', name: 'Root Intelligence', nodeId: 'G', weight: 5, value: 69, detail: 'Root access dossier' }
      ]
    },
    {
      name: 'Phantom Core',
      description: 'A hardened core network. Extract the optimal payload before the trace saturates.',
      capacity: 10,
      maxThreat: 63,
      threatLabel: 'CRITICAL SECURITY',
      nodes: [
        { id: 'A', x: 65, y: 258, label: 'ENTRY GATE', short: 'IN', type: 'start', alert: 0 },
        { id: 'B', x: 195, y: 105, label: 'RELAY 21', short: 'R1', type: 'relay', alert: 1 },
        { id: 'C', x: 195, y: 405, label: 'RELAY 22', short: 'R2', type: 'relay', alert: 1 },
        { id: 'D', x: 340, y: 63, label: 'PHANTOM KEY', short: 'DATA', type: 'data', alert: 2 },
        { id: 'E', x: 350, y: 230, label: 'RELAY 23', short: 'R3', type: 'relay', alert: 2 },
        { id: 'F', x: 352, y: 420, label: 'CORE FRAGMENT', short: 'DATA', type: 'data', alert: 2 },
        { id: 'G', x: 502, y: 112, label: 'FIREWALL 03', short: 'FW', type: 'guard', alert: 3 },
        { id: 'H', x: 520, y: 325, label: 'DEEP MEMORY', short: 'DATA', type: 'data', alert: 3 },
        { id: 'I', x: 655, y: 78, label: 'RELAY 24', short: 'R4', type: 'relay', alert: 2 },
        { id: 'J', x: 664, y: 420, label: 'PHANTOM VAULT', short: 'DATA', type: 'data', alert: 3 },
        { id: 'K', x: 675, y: 247, label: 'RELAY 25', short: 'R5', type: 'relay', alert: 2 },
        { id: 'L', x: 770, y: 247, label: 'CORE EXIT', short: 'EXIT', type: 'vault', alert: 3 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 3 }, { from: 'A', to: 'C', weight: 4 },
        { from: 'B', to: 'D', weight: 3 }, { from: 'B', to: 'E', weight: 3 },
        { from: 'C', to: 'E', weight: 4 }, { from: 'C', to: 'F', weight: 3 },
        { from: 'D', to: 'E', weight: 2 }, { from: 'D', to: 'G', weight: 4 },
        { from: 'E', to: 'F', weight: 2 }, { from: 'E', to: 'G', weight: 3 },
        { from: 'E', to: 'H', weight: 4 }, { from: 'F', to: 'H', weight: 3 },
        { from: 'G', to: 'I', weight: 3 }, { from: 'G', to: 'K', weight: 4 },
        { from: 'H', to: 'K', weight: 2 }, { from: 'H', to: 'J', weight: 3 },
        { from: 'I', to: 'K', weight: 2 }, { from: 'I', to: 'L', weight: 5 },
        { from: 'J', to: 'K', weight: 3 }, { from: 'J', to: 'L', weight: 5 },
        { from: 'K', to: 'L', weight: 3 }
      ],
      items: [
        { id: 'phantom', name: 'Phantom Key', nodeId: 'D', weight: 2, value: 36, detail: 'Stealth authorization' },
        { id: 'fragment', name: 'Core Fragment', nodeId: 'F', weight: 4, value: 65, detail: 'Core source fragment' },
        { id: 'memory', name: 'Deep Memory', nodeId: 'H', weight: 5, value: 80, detail: 'Encrypted memory bank' },
        { id: 'vaultdata', name: 'Phantom Vault Data', nodeId: 'J', weight: 6, value: 90, detail: 'Priority intelligence' }
      ]
    }
  ];

  let state = null;
  let playbackTimer = null;
  let toastTimer = null;

  function createLevelState(index, score) {
    const level = LEVELS[index];
    return {
      levelIndex: index,
      level,
      score,
      scoreBeforeLevel: score,
      status: 'prep',
      playerNode: 'A',
      playerVisited: new Set(['A']),
      selectedItemIds: [],
      appliedItemIds: [],
      collectedItemIds: [],
      collectedWeight: 0,
      collectedValue: 0,
      threat: 0,
      totalTravelCost: 0,
      route: [],
      routeCursor: 0,
      routeAnalysis: null,
      destination: null,
      selectedEdge: null,
      activeAlgorithm: 'knapsack',
      knapsackMessage: 'Run the optimizer to find the best-value combination.',
      routeMessage: 'Deploy your loadout to begin route planning.'
    };
  }

  function stopPlayback() {
    if (playbackTimer !== null) {
      window.clearInterval(playbackTimer);
      playbackTimer = null;
    }
  }

  function showToast(message, tone = 'normal') {
    const toast = $('toast');
    toast.textContent = message;
    toast.className = `toast show ${tone}`;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.className = 'toast'; }, 2600);
  }

  function startGame() {
    stopPlayback();
    state = createLevelState(0, 0);
    $('startScreen').hidden = true;
    $('gameScreen').hidden = false;
    $('resultOverlay').hidden = true;
    renderAll();
    showToast('Operation 01 loaded. Configure your data loadout.');
  }

  function loadLevel(index, score = state ? state.score : 0) {
    stopPlayback();
    state = createLevelState(index, score);
    $('resultOverlay').hidden = true;
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Operation ${String(index + 1).padStart(2, '0')} ready: ${state.level.name}.`);
  }

  function restartMission() {
    if (!state) return;
    const index = state.levelIndex;
    const restoreScore = state.scoreBeforeLevel;
    loadLevel(index, restoreScore);
  }

  function nextLevel() {
    if (!state || state.status !== 'won') return;
    if (state.levelIndex < LEVELS.length - 1) {
      loadLevel(state.levelIndex + 1, state.score);
    } else {
      startGame();
      showToast('New campaign started. Good hunting.');
    }
  }

  function getSelectedItems() {
    return state.level.items.filter(item => state.selectedItemIds.includes(item.id));
  }

  function getAppliedItems() {
    return state.level.items.filter(item => state.appliedItemIds.includes(item.id));
  }

  function getNextRequiredItem() {
    return getAppliedItems().find(item => !state.collectedItemIds.includes(item.id)) || null;
  }

  function getNode(nodeId) {
    return state.level.nodes.find(node => node.id === nodeId);
  }

  function getEdge(from, to) {
    return state.level.edges.find(edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from));
  }

  function updateSelectedItems(nextIds) {
    if (state.status !== 'prep') return;
    state.selectedItemIds = [...new Set(nextIds)];
    const selected = getSelectedItems();
    const totalWeight = selected.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight > state.level.capacity) {
      state.knapsackMessage = `Over capacity by ${totalWeight - state.level.capacity}. Remove a packet or run the optimizer.`;
    } else {
      state.knapsackMessage = `${selected.length} packet${selected.length === 1 ? '' : 's'} selected. Run the optimizer or deploy this combination.`;
    }
    state.activeAlgorithm = 'knapsack';
    renderAll();
  }

  function optimizeLoadout() {
    if (state.status !== 'prep') return;
    const result = solveKnapsack(state.level.items, state.level.capacity);
    state.selectedItemIds = result.selectedIds;
    state.activeAlgorithm = 'knapsack';
    const names = result.selected.map(item => item.name).join(', ');
    state.knapsackMessage = `Optimal value ${result.totalValue}: ${names || 'no packets'} · ${result.totalWeight}/${result.capacity} capacity used.`;
    renderAll();
    showToast(`Knapsack solved: value ${result.totalValue} with ${result.remainingCapacity} capacity remaining.`, 'success');
  }

  function deployLoadout() {
    if (state.status !== 'prep') return;
    const selected = getSelectedItems();
    const weight = selected.reduce((sum, item) => sum + item.weight, 0);
    if (!selected.length) {
      state.knapsackMessage = 'Choose at least one data packet before deployment.';
      renderAll();
      showToast('Loadout rejected: select at least one data packet.', 'warning');
      return;
    }
    if (weight > state.level.capacity) {
      state.knapsackMessage = `Loadout exceeds capacity by ${weight - state.level.capacity}.`;
      renderAll();
      showToast('Loadout rejected: capacity exceeded.', 'warning');
      return;
    }
    state.appliedItemIds = selected.map(item => item.id);
    state.status = 'ready';
    state.activeAlgorithm = 'knapsack';
    state.routeMessage = 'Loadout deployed. Select a node to calculate your shortest route.';
    renderAll();
    showToast(`Loadout deployed. ${selected.length} target${selected.length === 1 ? '' : 's'} marked on the network.`, 'success');
  }

  function handleNodeSelection(nodeId) {
    if (!state || ['won', 'lost'].includes(state.status)) return;
    if (state.status === 'prep') {
      showToast('Deploy a valid loadout before accessing the network.', 'warning');
      return;
    }
    if (state.status === 'running') {
      showToast('Pause the route before selecting a new destination.', 'warning');
      return;
    }
    if (nodeId === state.playerNode) {
      showToast('You are already at this node. Select another destination.');
      return;
    }
    const node = getNode(nodeId);
    if (!node) return;
    if (node.type === 'vault' && getNextRequiredItem()) {
      const missing = getNextRequiredItem();
      state.routeMessage = `Vault locked. Recover ${missing.name} at node ${missing.nodeId} first.`;
      renderAll();
      showToast(`Vault locked: recover ${missing.name} first.`, 'warning');
      return;
    }

    stopPlayback();
    const analysis = dijkstra(state.level.nodes, state.level.edges, state.playerNode, nodeId);
    state.routeAnalysis = analysis;
    state.destination = nodeId;
    state.selectedEdge = null;
    state.activeAlgorithm = 'dijkstra';
    if (!analysis.reachable || analysis.path.length < 2) {
      state.route = [];
      state.routeCursor = 0;
      state.routeMessage = `No route from ${state.playerNode} to ${nodeId}. Choose a connected destination.`;
      renderAll();
      showToast(state.routeMessage, 'warning');
      return;
    }
    state.route = analysis.path;
    state.routeCursor = 0;
    state.status = 'ready';
    state.routeMessage = `Shortest route found: ${analysis.path.join(' → ')}. Select Play or Step to move.`;
    renderAll();
    showToast(`Route found: cost ${analysis.cost} · ${analysis.path.length - 1} hop${analysis.path.length === 2 ? '' : 's'}.`, 'success');
  }

  function handleEdgeSelection(edge) {
    if (!state) return;
    state.selectedEdge = edge;
    $('edgeInfo').textContent = `LINK ${edge.from} ↔ ${edge.to}  ·  WEIGHT ${edge.weight}  ·  ${edge.weight <= 3 ? 'LOW COST' : edge.weight <= 5 ? 'MEDIUM COST' : 'HIGH COST'}`;
    renderMap();
  }

  function startPlayback() {
    if (!state || ['prep', 'won', 'lost', 'running'].includes(state.status)) return;
    if (!state.route.length || state.routeCursor >= state.route.length - 1) {
      showToast('Select a destination node to calculate a route first.', 'warning');
      return;
    }
    state.status = 'running';
    renderAll();
    playbackTimer = window.setInterval(() => {
      const shouldContinue = moveOneStep();
      renderAll();
      if (!shouldContinue) stopPlayback();
    }, 620);
  }

  function pausePlayback() {
    if (!state || state.status !== 'running') return;
    stopPlayback();
    state.status = 'paused';
    state.routeMessage = 'Route paused. Resume with Play or advance one hop with Step.';
    renderAll();
    showToast('Route paused.');
  }

  function stepPlayback() {
    if (!state || ['prep', 'won', 'lost', 'running'].includes(state.status)) return;
    if (!state.route.length || state.routeCursor >= state.route.length - 1) {
      showToast('No pending hop. Select a destination to plan another route.', 'warning');
      return;
    }
    state.status = 'paused';
    const shouldContinue = moveOneStep();
    if (!shouldContinue) stopPlayback();
    if (state.status === 'paused' && state.routeCursor >= state.route.length - 1) state.status = 'ready';
    renderAll();
  }

  function moveOneStep() {
    if (!state.route.length || state.routeCursor >= state.route.length - 1) {
      state.status = 'ready';
      return false;
    }
    const from = state.route[state.routeCursor];
    const to = state.route[state.routeCursor + 1];
    const edge = getEdge(from, to);
    const node = getNode(to);
    if (!edge || !node) {
      state.routeMessage = 'Route interrupted: a network link is unavailable. Recalculate the route.';
      state.status = 'ready';
      return false;
    }

    state.playerNode = to;
    state.playerVisited.add(to);
    state.routeCursor += 1;
    state.totalTravelCost += edge.weight;
    state.threat += edge.weight + node.alert;
    state.routeMessage = `Moved ${from} → ${to}. Link cost ${edge.weight}; trace increased by ${edge.weight + node.alert}.`;

    const cache = state.level.items.find(item => item.nodeId === to && state.appliedItemIds.includes(item.id));
    if (cache && !state.collectedItemIds.includes(cache.id)) {
      state.collectedItemIds.push(cache.id);
      state.collectedWeight += cache.weight;
      state.collectedValue += cache.value;
      state.score += cache.value * 5;
      state.routeMessage = `Data recovered: ${cache.name}. +${cache.value * 5} score points.`;
      showToast(`${cache.name} secured · data value +${cache.value}.`, 'success');
    }

    if (state.threat >= state.level.maxThreat) {
      loseMission();
      return false;
    }

    if (node.type === 'vault') {
      const missing = getNextRequiredItem();
      if (!missing) {
        winMission();
        return false;
      }
      state.routeMessage = `Vault sealed. Recover ${missing.name} at ${missing.nodeId}, then return to the vault.`;
      showToast(`Vault sealed. ${missing.name} is still missing.`, 'warning');
    }

    if (state.routeCursor >= state.route.length - 1) {
      state.status = 'ready';
      const next = getNextRequiredItem();
      if (next && state.playerNode === next.nodeId) {
        state.routeMessage = `${next.name} is in range. Data recovery pending.`;
      } else if (next) {
        state.routeMessage += ` Next objective: recover ${next.name} at node ${next.nodeId}.`;
      } else if (state.playerNode !== getVaultNodeId()) {
        state.routeMessage += ' All packets recovered. Proceed to the vault.';
      }
      return false;
    }
    return true;
  }

  function getVaultNodeId() {
    const vault = state.level.nodes.find(node => node.type === 'vault');
    return vault ? vault.id : null;
  }

  function resetRoute() {
    if (!state || state.status === 'prep' || ['won', 'lost'].includes(state.status)) return;
    stopPlayback();
    state.route = [];
    state.routeCursor = 0;
    state.routeAnalysis = null;
    state.destination = null;
    state.selectedEdge = null;
    state.status = 'ready';
    state.activeAlgorithm = 'dijkstra';
    state.routeMessage = 'Route cleared. Select another node to run Dijkstra from your current position.';
    $('edgeInfo').textContent = 'Select a connection to inspect its weight.';
    renderAll();
    showToast('Route reset. Mission progress is preserved.');
  }

  function winMission() {
    stopPlayback();
    state.status = 'won';
    const bonus = 100 + Math.max(0, state.level.maxThreat - state.threat) * 3;
    state.score += bonus;
    state.routeMessage = `Vault ${getVaultNodeId()} accessed. All selected data packets extracted.`;
    renderAll();
    showResult(true, bonus);
  }

  function loseMission() {
    stopPlayback();
    state.status = 'lost';
    state.routeMessage = 'Trace limit exceeded. The network has isolated your connection.';
    renderAll();
    showResult(false, 0);
  }

  function showResult(success, bonus) {
    const overlay = $('resultOverlay');
    const card = overlay.querySelector('.result-card');
    card.classList.toggle('failed', !success);
    $('resultSymbol').textContent = success ? '✓' : '×';
    $('resultKicker').textContent = success ? (state.levelIndex === LEVELS.length - 1 ? 'CAMPAIGN COMPLETE' : 'OPERATION COMPLETE') : 'CONNECTION COMPROMISED';
    $('resultTitle').textContent = success ? (state.levelIndex === LEVELS.length - 1 ? 'All systems breached' : 'Vault accessed') : 'Trace detected';
    $('resultDescription').textContent = success
      ? `Extraction confirmed. ${state.collectedItemIds.length} data packet${state.collectedItemIds.length === 1 ? '' : 's'} recovered. Completion bonus: +${bonus} points.`
      : `Trace exposure reached ${state.threat} against a limit of ${state.level.maxThreat}. The operation failed. Restart this mission to try a different route.`;
    $('resultScore').textContent = String(state.score).padStart(4, '0');
    $('resultThreat').textContent = `${Math.round(state.threat / state.level.maxThreat * 100)}%`;
    $('resultValue').textContent = String(state.collectedValue);
    $('resultNextButton').textContent = state.levelIndex === LEVELS.length - 1 ? 'NEW CAMPAIGN ↗' : 'NEXT LEVEL ↗';
    $('resultNextButton').hidden = !success;
    $('resultRestartButton').textContent = success ? 'REPLAY MISSION' : 'RETRY MISSION';
    overlay.hidden = false;
  }

  function svgElement(tag, attributes = {}, text = null) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    if (text !== null) element.textContent = text;
    return element;
  }

  function edgeKey(a, b) { return [a, b].sort().join('-'); }

  function renderMap() {
    if (!state) return;
    const svg = $('networkMap');
    svg.replaceChildren();
    const level = state.level;
    const pathEdges = new Set();
    for (let i = 0; i < state.route.length - 1; i += 1) pathEdges.add(edgeKey(state.route[i], state.route[i + 1]));
    const visited = new Set(state.routeAnalysis ? state.routeAnalysis.visitedOrder : []);
    const nextItem = getNextRequiredItem();

    const edgeLayer = svgElement('g', { class: 'edge-layer' });
    level.edges.forEach((edge, index) => {
      const a = getNode(edge.from);
      const b = getNode(edge.to);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const offset = edge.labelOffset || 0;
      const labelX = midX + (-dy / length) * (12 + offset);
      const labelY = midY + (dx / length) * (12 + offset);
      const active = state.selectedEdge && edgeKey(state.selectedEdge.from, state.selectedEdge.to) === edgeKey(edge.from, edge.to);
      const group = svgElement('g', { class: `edge-group${active ? ' edge-active' : ''}`, tabindex: '0', role: 'button', 'aria-label': `Connection ${edge.from} to ${edge.to}, weight ${edge.weight}`, 'data-edge-id': `${edge.from}-${edge.to}` });
      group.appendChild(svgElement('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: `edge-line${pathEdges.has(edgeKey(edge.from, edge.to)) ? ' path-edge' : ''}${active ? ' selected-edge' : ''}` }));
      group.appendChild(svgElement('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'edge-hit' }));
      group.appendChild(svgElement('rect', { x: labelX - 11, y: labelY - 8, width: 22, height: 16, rx: 5, class: 'edge-weight-bg' }));
      group.appendChild(svgElement('text', { x: labelX, y: labelY + .5, class: 'edge-weight' }, String(edge.weight)));
      const title = svgElement('title', {}, `${edge.from} ↔ ${edge.to} · cost ${edge.weight}`);
      group.appendChild(title);
      group.addEventListener('click', (event) => { event.stopPropagation(); handleEdgeSelection(edge); });
      group.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleEdgeSelection(edge); }
      });
      edgeLayer.appendChild(group);
    });
    svg.appendChild(edgeLayer);

    const nodeLayer = svgElement('g', { class: 'node-layer' });
    level.nodes.forEach(node => {
      const item = level.items.find(candidate => candidate.nodeId === node.id);
      const selected = item && state.appliedItemIds.includes(item.id);
      const collected = item && state.collectedItemIds.includes(item.id);
      const isPlayer = state.playerNode === node.id;
      const isNext = nextItem && nextItem.nodeId === node.id;
      const disabled = state.status === 'prep' || state.status === 'running' || ['won', 'lost'].includes(state.status);
      const classes = [
        'node-group', `type-${node.type}`,
        isPlayer ? 'is-player' : '',
        visited.has(node.id) || state.playerVisited.has(node.id) ? 'is-visited' : '',
        collected ? 'is-collected' : '',
        isNext ? 'is-next' : '',
        disabled ? 'is-disabled' : ''
      ].filter(Boolean).join(' ');
      const group = svgElement('g', { class: classes, transform: `translate(${node.x} ${node.y})`, tabindex: '0', role: 'button', 'aria-label': `Node ${node.id}: ${node.label}`, 'data-node-id': node.id });
      group.appendChild(svgElement('circle', { r: 23, class: 'node-hit' }));
      group.appendChild(svgElement('circle', { r: 21, class: 'node-ring' }));
      group.appendChild(svgElement('circle', { r: node.type === 'vault' || node.type === 'start' ? 15 : 13, class: 'node-core' }));
      group.appendChild(svgElement('circle', { r: node.type === 'vault' || node.type === 'start' ? 3.3 : 2.7, class: 'node-inner' }));
      if (selected && !collected) {
        group.appendChild(svgElement('circle', { cx: 13, cy: -13, r: 7, class: 'node-badge' }));
        group.appendChild(svgElement('text', { x: 13, y: -12.5, class: 'node-badge-text' }, '＋'));
      }
      if (collected) {
        group.appendChild(svgElement('circle', { cx: 13, cy: -13, r: 7, class: 'node-badge' }));
        group.appendChild(svgElement('text', { x: 13, y: -12.5, class: 'node-badge-text' }, '✓'));
      }
      if (isPlayer) {
        group.appendChild(svgElement('text', { x: 0, y: -29, class: 'node-type-label' }, 'YOU'));
      }
      const labelY = node.y > 390 ? -27 : 35;
      group.appendChild(svgElement('text', { x: 0, y: labelY, class: 'node-name-label' }, node.label));
      group.appendChild(svgElement('title', {}, `${node.id} · ${node.label}${item ? ` · ${item.weight} capacity / ${item.value} value` : ''}`));
      group.addEventListener('click', (event) => { event.stopPropagation(); handleNodeSelection(node.id); });
      group.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleNodeSelection(node.id); }
      });
      nodeLayer.appendChild(group);
    });
    svg.appendChild(nodeLayer);
  }

  function renderItemList() {
    const list = $('itemList');
    list.replaceChildren();
    const locked = state.status !== 'prep';
    state.level.items.forEach(item => {
      const selected = state.selectedItemIds.includes(item.id);
      const collected = state.collectedItemIds.includes(item.id);
      const row = document.createElement('div');
      row.className = `item-row${selected ? ' selected' : ''}${collected ? ' collected' : ''}`;
      const label = document.createElement('label');
      label.className = 'item-pick';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selected;
      checkbox.disabled = locked;
      checkbox.setAttribute('aria-label', `Select ${item.name}`);
      checkbox.addEventListener('change', () => {
        const next = new Set(state.selectedItemIds);
        if (checkbox.checked) next.add(item.id); else next.delete(item.id);
        updateSelectedItems([...next]);
      });
      const nameWrap = document.createElement('span');
      nameWrap.className = 'item-name';
      nameWrap.textContent = item.name;
      const nodeLabel = document.createElement('span');
      nodeLabel.className = 'item-node';
      nodeLabel.textContent = collected ? `NODE ${item.nodeId} · RECOVERED` : `NODE ${item.nodeId}${locked && !selected ? ' · OPTIONAL' : ''}`;
      nameWrap.appendChild(nodeLabel);
      label.append(checkbox, nameWrap);
      const weight = document.createElement('span');
      weight.className = 'item-weight';
      weight.textContent = `${item.weight} u`;
      const value = document.createElement('span');
      value.className = 'item-value';
      value.textContent = String(item.value);
      row.append(label, weight, value);
      list.appendChild(row);
    });

    const selectedItems = getSelectedItems();
    const used = selectedItems.reduce((sum, item) => sum + item.weight, 0);
    const value = selectedItems.reduce((sum, item) => sum + item.value, 0);
    const remaining = state.level.capacity - used;
    $('itemValue').textContent = String(value);
    $('itemWeight').textContent = `${used} / ${state.level.capacity}`;
    $('itemRemaining').textContent = String(Math.max(0, remaining));
    $('loadoutFill').style.width = `${Math.min(100, used / state.level.capacity * 100)}%`;
    $('knapsackMessage').textContent = state.knapsackMessage;
    $('knapsackMessage').className = `knapsack-message${used > state.level.capacity ? ' warning' : state.status !== 'prep' ? ' success' : ''}`;
    $('optimizeButton').disabled = locked;
    $('applyButton').disabled = locked || selectedItems.length === 0 || used > state.level.capacity;
    $('applyButton').innerHTML = locked ? 'LOADOUT DEPLOYED <b>✓</b>' : 'DEPLOY LOADOUT <b>↗</b>';
  }

  function renderObjectives() {
    const list = $('objectiveList');
    list.replaceChildren();
    const deployed = state.status !== 'prep';
    const items = deployed ? getAppliedItems() : getSelectedItems();
    const objectives = [
      { done: deployed, title: 'Deploy data loadout', subtitle: deployed ? `${items.length} packet${items.length === 1 ? '' : 's'} selected` : 'Choose packets within capacity' },
      ...items.map(item => ({
        done: state.collectedItemIds.includes(item.id),
        title: `Recover ${item.name}`,
        subtitle: `Node ${item.nodeId} · ${item.weight} capacity · value ${item.value}`
      })),
      { done: state.status === 'won', title: 'Access the secure vault', subtitle: state.status === 'won' ? 'Extraction complete' : `Target node ${getVaultNodeId()}` }
    ];
    objectives.forEach((objective, index) => {
      const row = document.createElement('div');
      row.className = `objective-row${objective.done ? ' done' : ''}`;
      const icon = document.createElement('span');
      icon.className = 'objective-icon';
      icon.textContent = objective.done ? '✓' : String(index + 1).padStart(2, '0');
      const copy = document.createElement('span');
      copy.className = 'objective-copy';
      const title = document.createElement('strong');
      title.textContent = objective.title;
      const subtitle = document.createElement('small');
      subtitle.textContent = objective.subtitle;
      copy.append(title, subtitle);
      row.append(icon, copy);
      list.appendChild(row);
    });
    const complete = objectives.filter(objective => objective.done).length;
    $('objectiveCount').textContent = `${complete}/${objectives.length}`;
    $('progressLabel').textContent = `${complete} / ${objectives.length} OBJECTIVES`;
    $('missionProgress').style.width = `${complete / objectives.length * 100}%`;
  }

  function renderThreatAndStats() {
    const percent = Math.min(100, Math.round(state.threat / state.level.maxThreat * 100));
    $('scoreValue').textContent = String(state.score).padStart(4, '0');
    $('threatValue').textContent = `${percent}%`;
    $('threatLabel').textContent = `${state.threat} / ${state.level.maxThreat}`;
    $('threatFill').style.width = `${percent}%`;
    $('threatFill').classList.toggle('danger', percent >= 70);
    $('threatNote').textContent = percent >= 70 ? 'High exposure. Minimize additional network hops.' : 'Keep your trace below the mission limit.';
    const value = state.status === 'prep' ? getSelectedItems().reduce((sum, item) => sum + item.weight, 0) : state.collectedWeight;
    $('capacityValue').textContent = `${value} / ${state.level.capacity}`;
    $('headerMission').textContent = `OPERATION ${String(state.levelIndex + 1).padStart(2, '0')}`;
    $('levelNumber').textContent = String(state.levelIndex + 1).padStart(2, '0');
    $('levelTitle').textContent = state.level.name;
    $('levelDescription').textContent = state.level.description;
    $('threatLabel').title = state.level.threatLabel;
  }

  function renderRouteAnalysis() {
    const analysis = state.routeAnalysis;
    $('routeCost').textContent = analysis && analysis.reachable ? String(analysis.cost) : '—';
    $('visitedCount').textContent = analysis ? String(analysis.visitedOrder.length) : '0';
    $('destinationValue').textContent = state.destination || '—';
    const visitedEl = $('visitedNodes');
    visitedEl.replaceChildren();
    if (analysis && analysis.visitedOrder.length) {
      analysis.visitedOrder.forEach(id => {
        const chip = document.createElement('span');
        chip.className = 'node-chip';
        chip.textContent = id;
        visitedEl.appendChild(chip);
      });
    } else {
      const empty = document.createElement('span'); empty.className = 'empty-chip'; empty.textContent = 'Awaiting calculation'; visitedEl.appendChild(empty);
    }
    const pathEl = $('pathNodes');
    pathEl.replaceChildren();
    if (analysis && analysis.path.length) {
      analysis.path.forEach(id => {
        const chip = document.createElement('span');
        chip.className = 'node-chip';
        chip.textContent = id;
        if (state.playerNode === id) chip.title = 'Current position';
        pathEl.appendChild(chip);
      });
    } else {
      const empty = document.createElement('span'); empty.className = 'empty-chip'; empty.textContent = 'Select a destination node'; pathEl.appendChild(empty);
    }
    $('routeMessage').textContent = state.routeMessage;
  }

  function renderLearningPanel() {
    const title = $('learningTitle');
    const body = $('learningBody');
    const stats = $('learningStats');
    if (state.activeAlgorithm === 'knapsack') {
      const chosen = getSelectedItems();
      const weight = chosen.reduce((sum, item) => sum + item.weight, 0);
      const value = chosen.reduce((sum, item) => sum + item.value, 0);
      title.textContent = '0/1 Knapsack';
      body.textContent = `Dynamic programming compares two choices for every packet and capacity: include it once, or leave it out. The selected combination carries value ${value} at weight ${weight}/${state.level.capacity}. Once deployed, the loadout is locked for this run.`;
      stats.innerHTML = `<span>ITEMS <b>${state.level.items.length}</b></span><span>CAPACITY <b>${state.level.capacity}</b></span><span>SELECTED <b>${chosen.length}</b></span>`;
    } else if (state.activeAlgorithm === 'dijkstra') {
      const analysis = state.routeAnalysis;
      title.textContent = 'Dijkstra shortest path';
      if (analysis && analysis.reachable) {
        body.textContent = `Dijkstra repeatedly settles the unvisited node with the smallest tentative distance, then relaxes its outgoing edges. From ${state.route[0]} to ${state.destination}, it found cost ${analysis.cost} across ${state.route.length - 1} link${state.route.length - 1 === 1 ? '' : 's'} after visiting ${analysis.visitedOrder.length} nodes.`;
        stats.innerHTML = `<span>PATH COST <b>${analysis.cost}</b></span><span>VISITED <b>${analysis.visitedOrder.length}</b></span><span>HOPS <b>${state.route.length - 1}</b></span>`;
      } else {
        body.textContent = 'Dijkstra uses non-negative edge weights to find the lowest-cost route from your current node to the chosen destination.';
        stats.innerHTML = '<span>WEIGHTED GRAPH <b>READY</b></span><span>ROUTING <b>DIJKSTRA</b></span>';
      }
    } else {
      title.textContent = 'Mission logic';
      body.textContent = 'Configure a loadout with 0/1 Knapsack, then use Dijkstra to navigate the network with minimum total edge weight. Each traversed link increases trace exposure.';
      stats.innerHTML = '<span>KNAPSACK <b>READY</b></span><span>DIJKSTRA <b>READY</b></span>';
    }
  }

  function renderControls() {
    const active = state.status !== 'prep' && !['won', 'lost'].includes(state.status);
    const hasPendingHop = state.route.length > 1 && state.routeCursor < state.route.length - 1;
    $('playButton').disabled = !active || state.status === 'running' || !hasPendingHop;
    $('pauseButton').disabled = state.status !== 'running';
    $('stepButton').disabled = !active || state.status === 'running' || !hasPendingHop;
    $('resetButton').disabled = !active || (!state.route.length && !state.selectedEdge);
    $('restartButton').disabled = false;
    $('nextButton').disabled = state.status !== 'won';
    $('nextButton').textContent = state.levelIndex === LEVELS.length - 1 ? 'NEW CAMPAIGN ↗' : 'NEXT LEVEL ↗';
    $('resultNextButton').textContent = state.levelIndex === LEVELS.length - 1 ? 'NEW CAMPAIGN ↗' : 'NEXT LEVEL ↗';
    const statusMap = {
      prep: 'LOADOUT CONFIGURATION', ready: 'NETWORK LIVE', paused: 'ROUTE PAUSED', running: 'ROUTE EXECUTING', won: 'MISSION COMPLETE', lost: 'CONNECTION LOST'
    };
    $('headerStatus').textContent = statusMap[state.status];
    $('mapState').textContent = state.status === 'prep' ? 'AWAITING LOADOUT' : state.status === 'running' ? 'ROUTE EXECUTING' : state.status === 'lost' ? 'TRACE DETECTED' : 'NETWORK LIVE';
    $('mapState').classList.toggle('active', state.status !== 'prep' && state.status !== 'lost');
    $('controlIndicator').textContent = state.status === 'prep' ? 'STANDBY' : state.status === 'running' ? 'IN MOTION' : state.status === 'paused' ? 'PAUSED' : state.status === 'won' ? 'SECURED' : state.status === 'lost' ? 'OFFLINE' : 'READY';
    $('mapInstruction').textContent = state.status === 'prep'
      ? 'Choose your data packets, then deploy to unlock the network.'
      : state.status === 'running'
        ? 'Route executing. Pause to select a different destination.'
        : state.status === 'won'
          ? 'Vault accessed. Operation secured.'
          : state.status === 'lost'
            ? 'Connection isolated. Restart the mission to try again.'
            : 'Click a node to calculate its shortest route. Select an edge to inspect its weight.';
    $('footerHint').textContent = state.status === 'prep' ? 'Awaiting operative deployment' : state.status === 'running' ? 'Route execution in progress' : state.status === 'won' ? 'Extraction complete' : state.status === 'lost' ? 'Session terminated' : 'Select a destination on the network map';
  }

  function renderAll() {
    if (!state) return;
    renderThreatAndStats();
    renderObjectives();
    renderItemList();
    renderMap();
    renderRouteAnalysis();
    renderLearningPanel();
    renderControls();
    if (!state.selectedEdge) $('edgeInfo').textContent = 'Select a connection to inspect its weight.';
  }

  function bindEvents() {
    $('startButton').addEventListener('click', startGame);
    $('howToButton').addEventListener('click', () => {
      const panel = $('howToPanel');
      panel.hidden = !panel.hidden;
      $('howToButton').innerHTML = panel.hidden ? 'HOW TO PLAY <span class="button-plus">＋</span>' : 'CLOSE BRIEFING <span class="button-plus">−</span>';
    });
    $('optimizeButton').addEventListener('click', optimizeLoadout);
    $('applyButton').addEventListener('click', deployLoadout);
    $('playButton').addEventListener('click', startPlayback);
    $('pauseButton').addEventListener('click', pausePlayback);
    $('stepButton').addEventListener('click', stepPlayback);
    $('resetButton').addEventListener('click', resetRoute);
    $('restartButton').addEventListener('click', restartMission);
    $('nextButton').addEventListener('click', nextLevel);
    $('resultRestartButton').addEventListener('click', restartMission);
    $('resultNextButton').addEventListener('click', nextLevel);
  }

  function runStartupChecks() {
    // Fast invariants catch malformed mission data before the player starts.
    LEVELS.forEach((level, index) => {
      const ids = new Set(level.nodes.map(node => node.id));
      if (ids.size !== level.nodes.length) throw new Error(`Duplicate node ID in level ${index + 1}.`);
      level.edges.forEach(edge => {
        if (!ids.has(edge.from) || !ids.has(edge.to) || edge.weight < 0) throw new Error(`Invalid edge in level ${index + 1}.`);
      });
      level.items.forEach(item => {
        if (!ids.has(item.nodeId)) throw new Error(`Unknown item node in level ${index + 1}.`);
      });
      const routeCheck = dijkstra(level.nodes, level.edges, level.nodes[0].id, level.nodes.find(node => node.type === 'vault').id);
      if (!routeCheck.reachable) throw new Error(`Level ${index + 1} has no route to its vault.`);
      solveKnapsack(level.items, level.capacity);
    });
  }

  bindEvents();
  runStartupChecks();
})();
