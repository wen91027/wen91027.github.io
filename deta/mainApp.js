// mainApp.js

import React, { useState, useEffect, useRef } from "https://esm.sh/react@17";
import ReactDOM from "https://esm.sh/react-dom@17";

// 模組匯入
import { ELEMENTS, ALKALI, METALS, MOLECULES, NEUTRALIZATION_RECIPES, WEIGHTS } from "https://wen91027.github.io/deta/molecules_full.js";
import { drawCard, findMol, corrodeMetals, clearCorrosion, sumAtoms, triggerRecovery } from "https://wen91027.github.io/deta/utils.js";
import { handleAiTurn } from "https://wen91027.github.io/deta/aiActions.js";
import { canNeutralize, handleNeutralize } from "https://wen91027.github.io/deta/neutralization.js";
import { applyDamage, useWaterRecovery, handleExplosion } from "https://wen91027.github.io/deta/CombatUtils.js";
import { useGameState, initializeGameState } from "https://wen91027.github.io/deta/StateManager.js";
import { handleEndTurn, useDrawPhase } from "https://wen91027.github.io/deta/TurnManager.js";
import { renderField, renderHand, renderControls, renderOverlay, renderLog, renderPrompt } from "https://wen91027.github.io/deta/UIHandlers.js";
import { animationStates, resetAnimations } from "https://wen91027.github.io/deta/AnimationUtils.js";

export const App = () => {
  // 初始化狀態
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

  // 初始與回合控制
  useEffect(() => initializeGameState(setP, setA, setPH, setAH, setPF, setAF, setSelEls, setSelMol, setLog, setGameOver, setTurn, firstDraw, addLog), []);

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
    handleAiTurn(aHand, setAH, aField, setAF, pHand, setPH, setP, setA, addLog, handleEnd, setAiThinking, gameOver);
  }, [turn, gameOver]);

  // UI渲染區段
  return (
    <div className="game-container">
      <div className="board">
        <h1>真實煉金：化合之戰</h1>
        {renderOverlay(gameOver, aiThinking, () => initializeGameState(setP, setA, setPH, setAH, setPF, setAF, setSelEls, setSelMol, setLog, setGameOver, setTurn, firstDraw, addLog))}
        <img src="https://wen91027.github.io/img/BN_top.jpeg" alt="遊戲首圖" className="bg-logo" />

        {renderField("對手手牌", aHand, true)}
        {renderField("對手分子區", aField, false, selEnemyMol, setSelEnemyMol)}
        {renderLog(log)}
        {renderField("我方分子區", pField, false, selMol, setSelMol)}
        <div className="hp-section">
          <span className="hp-label">玩家 HP</span>
          <div className="hp-bar">
            <div className="hp-inner" style={{ width: `${pHP / 128 * 100}%` }} />
          </div>
          <span>{pHP}</span>
        </div>
        {renderHand(pHand, selEls, setSelEls)}
        {renderPrompt(pHand)}
        {renderControls(turn, gameOver, selEls, selMol, canCombine, () => handleNeutralize(pField[selMol], aField[selEnemyMol], setPF, setAF, applyDamage, setP, setA, addLog, setSelMol, setSelEnemyMol, setTurn, resetAnimations))}
      </div>
    </div>
  );
};
