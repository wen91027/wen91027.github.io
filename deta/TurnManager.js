// TurnManager.js
// 專責處理遊戲回合相關的流程控制與回合切換副作用

(function () {
  function handleEndTurn({
    setSelEls,
    setSelMol,
    setTurn,
    addLog,
    gameOver
  }) {
    if (gameOver) return;
    setSelEls([]);
    setSelMol(null);
    setTurn(t => t === 'player' ? 'ai' : 'player');
    addLog('結束回合');
  }
 
  function handleStartPlayerTurn({
    drawCardsTo,
    pHand,
    setPH,
    aField,
    clearCorrosion,
    corrodeMetals,
    addLog,
    setP,
    MAX_HP,
    pField,
    RECOVER_CONFIG,
    ELEMENTS
  }) {
    const newHand = drawCardsTo(pHand, setPH, 2, '玩家');

    const acidCount = aField.filter(m => (m.kind || '').includes('acid')).length;
    const strongAcidCount = aField.filter(m => (m.kind || '').includes('strong_acid')).length;

    if (acidCount === 0) clearCorrosion(newHand, setPH);
    if (strongAcidCount > 0) {
      const corroded = corrodeMetals(newHand, setPH, 1);
      if (corroded > 0) addLog(`敵方強酸腐蝕了你 ${corroded} 張金屬卡`);
    }

    const waterCount = pField.filter(m => m.name === '水').length;
    if (waterCount > 0) {
      const heal = waterCount * RECOVER_CONFIG['水'].perTurn;
      setP(h => Math.min(MAX_HP, h + heal));
      addLog(`每回合回復 ${heal} HP`);
    }
  }

  function handleStartAITurn({
    drawCardsTo,
    aHand,
    setAH,
    pField,
    clearCorrosion,
    corrodeMetals,
    addLog,
    aiTakeAction
  }) {
    const newHand = drawCardsTo(aHand, setAH, 2, 'AI');

    const acidCount = pField.filter(m => (m.kind || '').includes('acid')).length;
    const strongAcidCount = pField.filter(m => (m.kind || '').includes('strong_acid')).length;

    if (acidCount === 0) clearCorrosion(newHand, setAH);
    if (strongAcidCount > 0) {
      const corroded = corrodeMetals(newHand, setAH, 1);
      if (corroded > 0) addLog(`你方強酸腐蝕了敵方 ${corroded} 張金屬卡`);
    }

    setTimeout(() => aiTakeAction(), 600);
  }

  // 掛載到全域物件 window 上
  window.handleEndTurn = handleEndTurn;
  window.handleStartPlayerTurn = handleStartPlayerTurn;
  window.handleStartAITurn = handleStartAITurn;
})();
