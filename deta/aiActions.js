// aiActions.js
// 本檔案負責 AI 的整體行動邏輯，包括合成分子、使用卡牌、棄牌與結束回合

import { sumAtoms, corrodeMetals, applyDamage } from './utils';
import { MOLECULES, ELEMENTS } from './molecules_full';

/**
 * AI 的主要行動函式
  * 此函式會在 AI 回合觸發，內部邏輯包含：
 * - 嘗試以現有手牌合成分子（選擇原子序總和最高者）
 * - 若為酸性分子會腐蝕玩家金屬卡
 * - 根據使用的元素計算並造成傷害
 * - 有機率進行第二次以上連續合成行動
 * - 若無可行動，則選擇結束回合或隨機棄牌
 *
 * @param {object} params - 傳入所有必要的狀態與控制函式
 * @param {Array} params.aHand - AI 當前手牌
 * @param {Function} params.setAH - 更新 AI 手牌的函式
 * @param {Array} params.aField - AI 分子區
 * @param {Function} params.setAF - 更新 AI 分子區的函式
 * @param {Array} params.pHand - 玩家手牌（腐蝕判斷用）
 * @param {Function} params.setPH - 更新玩家手牌（腐蝕後）
 * @param {Function} params.addLog - 新增遊戲紀錄用
 * @param {Function} params.setAiThinking - 控制 AI 思考遮罩
 * @param {Function} params.applyDamage - 傷害套用函式
 * @param {Function} params.handleEnd - 結束回合函式
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
