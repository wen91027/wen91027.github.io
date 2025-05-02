//腐蝕相關函式
function corrodeMetals(hand, setHand, count = 2) {  // <--- 加一個 count = 2 預設
  const metals = METALS;
  const metalIndices = hand
    .map((c, i) => (metals.includes(c.el) && !c.corroded ? i : -1))
    .filter(i => i !== -1);

  if (metalIndices.length > 0) {
    const shuffle = [...metalIndices].sort(() => Math.random() - 0.5);
    const selected = shuffle.slice(0, Math.min(count, shuffle.length));
    const newHand = [...hand];
    selected.forEach(i => newHand[i] = { ...newHand[i], corroded: true });
    setHand(newHand);
    return selected.length;
  }
  return 0;
}
//清除腐蝕
    function clearCorrosion(hand, setHand) {
  const newHand = hand.map(c => c.corroded ? { ...c, corroded: false } : c);
  setHand(newHand);
}
