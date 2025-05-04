(function () {
  const {
    ELEMENTS, ALKALI, METALS, MOLECULES, NEUTRALIZATION_RECIPES, WEIGHTS
  } = window;

  const {
    drawCard, findMol, corrodeMetals, clearCorrosion, sumAtoms, triggerRecovery
  } = window;

  const { handleAiTurn } = window;
  const { canNeutralize, handleNeutralize } = window;
  const { applyDamage, useWaterRecovery, handleExplosion } = window;
  const { useGameState, initializeGameState } = window;
  const { handleEndTurn, useDrawPhase } = window;
  const {
    renderField, renderHand, renderControls, renderOverlay, renderLog, renderPrompt
  } = window;
  const { animationStates, resetAnimations } = window;

  const { useState, useEffect, useRef } = React;

  window.App = function App() {
    const {
      turn, setTurn,
      pHP, setP,
      aHP, setA,
      pHand, setPH,
      aHand, setAH,
      pField, setPF,
      aField, setAF,
      selEls, setSelEls,
      selMol, setSelMol,
      selEnemyMol, setSelEnemyMol,
      log, setLog,
      gameOver, setGameOver,
      justCombinedId, setJustCombinedId,
      justDrawnIndices, setJustDrawnIndices,
      justUsedIndices, setJustUsedIndices,
      aiThinking, setAiThinking,
      canCombine, setCanCombine
    } = useGameState();

    const addLog = (msg) => setLog((l) => [msg, ...l]);
    const firstDraw = useRef(true);

    useEffect(() => {
      initializeGameState(
        setP, setA, setPH, setAH, setPF, setAF,
        setSelEls, setSelMol, setLog, setGameOver, setTurn,
        firstDraw, addLog
      );
    }, []);

    useEffect(() => {
      if (gameOver) return;
      if (turn === 'player') useDrawPhase(pHand, setPH, aField, setPH, setP, addLog);
      else useDrawPhase(aHand, setAH, pField, setAH, setA, addLog);
    }, [turn, gameOver]);

    useEffect(() => {
      if (pHP <= 0) setGameOver('lose');
      else if (aHP <= 0) setGameOver('win');
    }, [pHP, aHP]);

    useEffect(() => {
      if (gameOver || turn !== 'ai') return;
      handleAiTurn(
        aHand, setAH, aField, setAF,
        pHand, setPH, setP, setA,
        addLog, handleEndTurn,
        setAiThinking, gameOver
      );
    }, [turn, gameOver]);

    return React.createElement("div", { className: "game-container" },
      React.createElement("div", { className: "board" },
        React.createElement("h1", null, "真實煉金：化合之戰"),
        renderOverlay(gameOver, aiThinking, () =>
          initializeGameState(
            setP, setA, setPH, setAH, setPF, setAF,
            setSelEls, setSelMol, setLog, setGameOver, setTurn,
            firstDraw, addLog
          )),
        React.createElement("img", {
          src: "https://wen91027.github.io/img/BN_top.jpeg",
          alt: "遊戲首圖",
          className: "bg-logo"
        }),
        renderField("對手手牌", aHand, true),
        renderField("對手分子區", aField, false, selEnemyMol, setSelEnemyMol),
        renderLog(log),
        renderField("我方分子區", pField, false, selMol, setSelMol),
        React.createElement("div", { className: "hp-section" },
          React.createElement("span", { className: "hp-label" }, "玩家 HP"),
          React.createElement("div", { className: "hp-bar" },
            React.createElement("div", {
              className: "hp-inner",
              style: { width: `${pHP / 128 * 100}%` }
            })
          ),
          React.createElement("span", null, pHP)
        ),
        renderHand(pHand, selEls, setSelEls),
        renderPrompt(pHand),
        renderControls(turn, gameOver, selEls, selMol, canCombine, () =>
          handleNeutralize(
            pField[selMol],
            aField[selEnemyMol],
            setPF, setAF,
            applyDamage, setP, setA,
            addLog, setSelMol, setSelEnemyMol,
            setTurn, resetAnimations
          )
        )
      )
    );
  };

  // 掛載 React App
  ReactDOM.render(React.createElement(window.App), document.getElementById("root"));
})();
