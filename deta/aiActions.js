// aiActions.js
// 本檔案負責 AI 的整體行動邏輯，包括合成分子、使用卡牌、棄牌與結束回合

import { sumAtoms, corrodeMetals, applyDamage } from './utils';
import { MOLECULES, ELEMENTS } from './molecules_full';

/**
 * AI 的主要行動函式
 * @param {object} params - 所有狀態與控制函式作為參數傳入
 */
export async function aiTakeAction({
  aHand,
  setAH,
  aField,
  setAF,
  pHand,
  setPH,
  addLog,
  setAiThinking,
  applyDamage,
  handleEnd
}) {
  setAiThinking(true); // 顯示 AI 思考中遮罩
  await new Promise(resolve => setTimeout(resolve, 600));

  let hand = [...aHand];
  let field = [...aField];

  // 篩選可合成分子
  const possible = MOLECULES.filter(m => {
    const cnt = {};
    hand.forEach(c => cnt[c.el] = (cnt[c.el] || 0) + 1);
    return Object.entries(m.formula || {}).every(([el, n]) => cnt[el] >= n);
  });

  if (possible.length > 0 && Math.random() >= 0.3) {
    // 優先選擇原子序總和最高的分子
    possible.sort((a, b) => sumAtoms(b.formula) - sumAtoms(a.formula));
    const m = possible[0];
    const used = [];

    // 從手牌中取出需要的元素
    Object.entries(m.formula).forEach(([el, n]) => {
      for (let i = hand.length - 1; i >= 0 && n > 0; i--) {
        if (hand[i].el === el) {
          used.push(el);
          hand.splice(i, 1);
          n--;
        }
      }
    });

    setAH([...hand]);
    setAF(f => [m, ...f]);
    addLog(`AI 合成 ${m.name}`);

    // 如果合成的是酸，腐蝕玩家手牌金屬
    if ((m.kind || '').includes('acid')) {
      const corroded = corrodeMetals(pHand, setPH);
      if (corroded > 0) addLog(`敵方酸性分子腐蝕了你 ${corroded} 張金屬卡`);
    }

    // 計算傷害：每張使用的元素按原子序加總
    const dmg = used.reduce((s, el) => s + (ELEMENTS.indexOf(el) + 1), 0);
    applyDamage('player', dmg);
    addLog(`你受到 ${dmg} 傷`);

    // 嘗試額外合成第二張分子（機率決定）
    let continueAction = true;
    while (continueAction) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const cnt = {};
      hand.forEach(c => cnt[c.el] = (cnt[c.el] || 0) + 1);
      const next = MOLECULES.filter(m => Object.entries(m.formula || {}).every(([el, n]) => cnt[el] >= n));
      if (next.length > 0 && Math.random() > 0.5) {
        next.sort((a, b) => sumAtoms(b.formula) - sumAtoms(a.formula));
        const m = next[0];
        const used = [];
        Object.entries(m.formula).forEach(([el, n]) => {
          for (let i = hand.length - 1; i >= 0 && n > 0; i--) {
            if (hand[i].el === el) {
              used.push(el);
              hand.splice(i, 1);
              n--;
            }
          }
        });
        setAH([...hand]);
        setAF(f => [m, ...f]);
        addLog(`AI 合成 ${m.name}`);
        if ((m.kind || '').includes('acid')) {
          const corroded = corrodeMetals(pHand, setPH);
          if (corroded > 0) addLog(`敵方酸性分子腐蝕了你 ${corroded} 張金屬卡`);
        }
        const dmg = used.reduce((s, el) => s + (ELEMENTS.indexOf(el) + 1), 0);
        applyDamage('player', dmg);
        addLog(`你受到 ${dmg} 傷`);
      } else {
        continueAction = false;
      }
    }

    handleEnd();
  } else {
    // 無法合成則選擇結束或棄牌
    if (Math.random() < 0.5) {
      addLog('AI 選擇結束回合');
    } else {
      let toDiscard = hand.length > 8 ? 3 : hand.length > 5 ? 2 : 1;
      const idxs = [];
      while (idxs.length < toDiscard && hand.length > 0) {
        const i = Math.floor(Math.random() * hand.length);
        if (!idxs.includes(i)) idxs.push(i);
      }
      const names = idxs.map(i => hand[i].el).join(',');
      idxs.sort((a, b) => b - a).forEach(i => hand.splice(i, 1));
      setAH([...hand]);
      addLog(`AI 棄牌: ${names}`);
    }
    handleEnd();
  }
  setAiThinking(false);
}

