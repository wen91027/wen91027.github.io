// aiActions.js
// 本檔案負責 AI 的整體行動邏輯，包括合成分子、使用卡牌、棄牌與結束回合

(function () {
  const { sumAtoms, corrodeMetals } = window.utils;
  const { MOLECULES, ELEMENTS } = window.moleculesData;

  window.aiTakeAction = async function ({
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
    setAiThinking(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    let hand = [...aHand];
    let field = [...aField];

    const possible = MOLECULES.filter(m => {
      const cnt = {};
      hand.forEach(c => cnt[c.el] = (cnt[c.el] || 0) + 1);
      return Object.entries(m.formula || {}).every(([el, n]) => cnt[el] >= n);
    });

    if (possible.length > 0 && Math.random() >= 0.3) {
      possible.sort((a, b) => sumAtoms(b.formula) - sumAtoms(a.formula));
      const m = possible[0];
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
  };
})();
