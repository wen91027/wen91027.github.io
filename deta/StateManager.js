// StateManager.js

// 遊戲初始設定
export const MAX_HP = 128;

// 建立初始狀態
export function getInitialState(drawCardFn) {
  return {
    turn: 'player',
    pHP: MAX_HP,
    aHP: MAX_HP,
    pHand: Array.from({ length: 5 }, drawCardFn),
    aHand: Array.from({ length: 5 }, drawCardFn),
    pField: [],
    aField: [],
    selEls: [],
    selMol: null,
    selEnemyMol: null,
    justCombinedId: null,
    justDrawnIndices: [],
    justUsedIndices: [],
    gameOver: null,
    log: ['遊戲初始化'],
    aiThinking: false,
    canCombine: false,
  };
}

// 重置遊戲狀態
export function resetGameState(setters, drawCardFn) {
  const {
    setTurn, setP, setA,
    setPH, setAH, setPF, setAF,
    setSelEls, setSelMol, setSelEnemyMol,
    setLog, setGameOver,
    setJustCombinedId, setJustDrawnIndices, setJustUsedIndices,
    setCanCombine
  } = setters;

  setTurn('player');
  setP(MAX_HP);
  setA(MAX_HP);
  setPH(Array.from({ length: 5 }, drawCardFn));
  setAH(Array.from({ length: 5 }, drawCardFn));
  setPF([]);
  setAF([]);
  setSelEls([]);
  setSelMol(null);
  setSelEnemyMol(null);
  setLog(['遊戲重置，玩家先手']);
  setGameOver(null);
  setJustCombinedId(null);
  setJustDrawnIndices([]);
  setJustUsedIndices([]);
  setCanCombine(false);
}
