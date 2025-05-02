// AnimationUtils.js
// AnimationUtils.js

// 控制合成動畫流程
export function triggerCombineAnimation(selEls, newMol, setPH, setJustUsedIndices, setJustCombinedId) {
  setJustUsedIndices(selEls);
  setJustCombinedId(newMol.id);

  setTimeout(() => {
    setJustUsedIndices([]);
    setJustCombinedId(null);
    setPH(h => h.filter((_, i) => !selEls.includes(i)));
  }, 800); // 動畫長度對應 CSS 設定
}

// 控制抽牌動畫流程
export function triggerDrawAnimation(currentHandLength, count, setJustDrawnIndices) {
  const startIndex = currentHandLength;
  const indices = Array.from({ length: count }, (_, i) => startIndex + i);
  setJustDrawnIndices(indices);
  setTimeout(() => setJustDrawnIndices([]), 800);
}

// 清除動畫標記（可選，用於保險）
export function clearAnimationFlags(setJustUsedIndices, setJustCombinedId, setJustDrawnIndices) {
  setJustUsedIndices([]);
  setJustCombinedId(null);
  setJustDrawnIndices([]);
}
