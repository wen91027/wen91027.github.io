// UIHandlers.js

// ✅ 點擊選擇手牌卡牌
export const handleSelectEl = (i, selEls, setSelEls, setSelMol) => {
  setSelMol(null);
  if (selEls.includes(i)) {
    setSelEls(selEls.filter(x => x !== i));
  } else {
    setSelEls([...selEls, i]);
  }
};

// ✅ 點擊選擇我方分子卡牌
export const handleSelectMol = (i, setSelMol) => {
  setSelMol(i);
};

// ✅ 點擊選擇敵方分子卡牌
export const handleSelectEnemyMol = (i, setSelEnemyMol) => {
  setSelEnemyMol(i);
};

// ✅ 清除所有選擇狀態
export const clearSelections = ({ setSelMol, setSelEls, setSelEnemyMol, setCanCombine }) => {
  setSelMol(null);
  setSelEls([]);
  setSelEnemyMol(null);
  if (setCanCombine) setCanCombine(false);
};

// ✅ 根據目前選取的雙方分子，判斷是否可以中和
export const updateCanCombine = (selMol, selEnemyMol, pField, aField, canNeutralize, setCanCombine) => {
  if (selMol !== null && selEnemyMol !== null) {
    const selectedMol = pField[selMol];
    const enemyMol = aField[selEnemyMol];
    if (canNeutralize(selectedMol, enemyMol)) {
      setCanCombine(true);
    } else {
      setCanCombine(false);
    }
  } else {
    setCanCombine(false);
  }
};
