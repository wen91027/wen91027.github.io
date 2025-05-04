// CombatUtils.js (IIFE + 掛載到 window)

(function () {
  /**
   * 計算元素原子序和，作為攻擊力或傷害值的依據。
   * @param {Object} formula - 分子的 formula，例如 { Na: 1, Cl: 1 }
   * @param {Array} ELEMENTS - 元素表，依序排列的元素符號
   * @returns {number} - 元素原子序加權總和
   */
  function sumAtoms(formula, ELEMENTS) {
    return Object.entries(formula || {}).reduce(
      (total, [el, n]) => total + (ELEMENTS.indexOf(el) + 1) * n,
      0
    );
  }

  /**
   * 對目標造成指定傷害，考慮惰性氣體抵擋。
   * @param {string} target - 'player' 或 'ai'
   * @param {number} dmg - 傷害值
   * @param {Function} getField - 回傳目前分子區陣列
   * @param {Function} setField - 設定分子區陣列
   * @param {Function} setHp - 設定目標的生命值
   * @param {Array} ELEMENTS - 元素表
   * @param {Function} showToast - 顯示提示訊息用的函式
   */
  function applyDamage(target, dmg, getField, setField, setHp, ELEMENTS, showToast) {
    const field = getField();
    const idx = field.findIndex(c => c.usable);

    if (idx >= 0) {
      const card = field[idx];
      const block = ELEMENTS.indexOf(card.el) + 1;
      dmg = Math.max(0, dmg - block);
      setField(f => f.filter((_, i) => i !== idx));
      showToast(`惰性氣體阻擋 ${block} 點傷害`);
    }

    setHp(hp => Math.max(0, hp - dmg));
  }

  /**
   * 回復生命值，限制最大生命值。
   * @param {Function} setHp - 設定生命值的方法
   * @param {number} heal - 回復值
   * @param {number} MAX_HP - 最大生命值
   */
  function applyHeal(setHp, heal, MAX_HP) {
    setHp(hp => Math.min(MAX_HP, hp + heal));
  }

  // 掛載到 window 物件上
  window.sumAtoms = sumAtoms;
  window.applyDamage = applyDamage;
  window.applyHeal = applyHeal;
})();

