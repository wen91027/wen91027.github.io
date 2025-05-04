(function () {
  const { ELEMENTS, MOLECULES, METALS, RECOVER_CONFIG, MAX_HP, WEIGHTS } = window;

  const drawPool = [];
  ELEMENTS.forEach(e => {
    const w = WEIGHTS[e] || 3;
    for (let i = 0; i < Math.round(w * 2); i++) drawPool.push(e);
  });

  function drawCard(drawPool, ELEMENTS) {
    const el = drawPool[Math.floor(Math.random() * drawPool.length)];
    return { el, corroded: false, usable: ['He', 'Ne', 'Ar'].includes(el) };
  }

  function findMol(sel, MOLECULES) {
    const cnt = {};
    sel.forEach(c => c && c.el && (cnt[c.el] = (cnt[c.el] || 0) + 1));
    for (const m of MOLECULES) {
      const f = m.formula;
      if (Object.values(f).reduce((a, b) => a + b, 0) !== sel.length) continue;
      let ok = true;
      for (const k in f) if (cnt[k] !== f[k]) ok = false;
      for (const k in cnt) if (!f[k]) ok = false;
      if (ok) return m;
    }
    return null;
  }

  function corrodeMetals(hand, setHand, METALS, count = 2) {
    const metalIndices = hand
      .map((c, i) => (METALS.includes(c.el) && !c.corroded ? i : -1))
      .filter(i => i !== -1);
    if (metalIndices.length > 0) {
      const shuffled = [...metalIndices].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);
      const newHand = [...hand];
      selected.forEach(i => newHand[i] = { ...newHand[i], corroded: true });
      setHand(newHand);
      return selected.length;
    }
    return 0;
  }

  function clearCorrosion(hand, setHand) {
    const newHand = hand.map(c => c.corroded ? { ...c, corroded: false } : c);
    setHand(newHand);
  }

  function sumAtoms(formula, ELEMENTS) {
    return Object.entries(formula).reduce(
      (sum, [el, n]) => sum + (ELEMENTS.indexOf(el) + 1) * n,
      0
    );
  }

  function triggerRecovery(target, molName, trigger, setP, setA, addLog) {
    const cfg = RECOVER_CONFIG[molName];
    if (!cfg || !cfg[trigger]) return;
    const heal = cfg[trigger];
    const setter = target === 'player' ? setP : setA;
    setter(hp => Math.min(MAX_HP, hp + heal));
    addLog(`${molName}${trigger === 'immediate' ? ' 合成回復' : ' 每回合回復'} ${heal} HP`);
  }

  // 掛載到 window
  window.drawPool = drawPool;
  window.drawCard = drawCard;
  window.findMol = findMol;
  window.corrodeMetals = corrodeMetals;
  window.clearCorrosion = clearCorrosion;
  window.sumAtoms = sumAtoms;
  window.triggerRecovery = triggerRecovery;
})();
