// neutralization.js
import { MOLECULES, NEUTRALIZATION_RECIPES, ELEMENTS } from './molecules_full.js';

/**
 * 判斷是否為有效的酸鹼中和組合
 */
export function canNeutralize(m1, m2) {
  return m1 && m2 && (
    ((m1.kind || '').includes('base') && (m2.kind || '').includes('acid')) ||
    ((m1.kind || '').includes('acid') && (m2.kind || '').includes('base'))
  );
}

/**
 * 根據分子名稱取得中和反應產物（鹽 + 水）
 */
export function getNeutralizationProducts(m1, m2) {
  const key1 = `${m1.name}+${m2.name}`;
  const key2 = `${m2.name}+${m1.name}`;
  const saltName = NEUTRALIZATION_RECIPES[key1] || NEUTRALIZATION_RECIPES[key2];
  const salt = MOLECULES.find(m => m.name === saltName);
  const water = MOLECULES.find(m => m.name === '水');
  return salt && water ? { salt, water } : null;
}

/**
 * 計算鹽類造成的額外傷害（依元素原子序和）
 */
export function computeSaltDamage(saltMol) {
  return Object.entries(saltMol.formula || {}).reduce(
    (sum, [el, n]) => sum + (ELEMENTS.indexOf(el) + 1) * n,
    0
  );
}
