// utils.js：遊戲邏輯工具箱

import { ELEMENTS, MOLECULES, METALS, RECOVER_CONFIG, MAX_HP } from './molecules_full.js';

  export  const drawPool = []; //卡池機率
    ELEMENTS.forEach(e => {
      const w = WEIGHTS[e]||3;
      for (let i=0;i<Math.round(w*2);i++) drawPool.push(e);
    });

// 抽卡邏輯：依照 drawPool 機率抽出一張元素卡
export function drawCard(drawPool, ELEMENTS) {
  const el = drawPool[Math.floor(Math.random() * drawPool.length)];
  return { el, corroded: false, usable: ['He', 'Ne', 'Ar'].includes(el) };
}

// 分子判定邏輯：找出是否可組成分子
export function findMol(sel, MOLECULES) {
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

// 腐蝕：腐蝕手牌中的金屬
export function corrodeMetals(hand, setHand, METALS, count = 2) {
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

// 清除腐蝕：移除所有腐蝕狀態
export function clearCorrosion(hand, setHand) {
  const newHand = hand.map(c => c.corroded ? { ...c, corroded: false } : c);
  setHand(newHand);
}

// 原子序加總：計算一個分子的總原子序加權
export function sumAtoms(formula, ELEMENTS) {
  return Object.entries(formula).reduce(
    (sum, [el, n]) => sum + (ELEMENTS.indexOf(el) + 1) * n,
    0
  );
}

// 觸發回血邏輯
export function triggerRecovery(target, molName, trigger, setP, setA, addLog) {
  const cfg = RECOVER_CONFIG[molName];
  if (!cfg || !cfg[trigger]) return;
  const heal = cfg[trigger];
  const setter = target === 'player' ? setP : setA;
  setter(hp => Math.min(MAX_HP, hp + heal));
  addLog(`${molName}${trigger === 'immediate' ? ' 合成回復' : ' 每回合回復'} ${heal} HP`);
}
