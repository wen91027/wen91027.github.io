    const ELEMENTS = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca"]; //所有元素
    const ALKALI = ["Li","Na","K"]; // 1A族
    const METALS = ["Li", "Na", "K", "Be", "Mg", "Ca", "Al"]; // 金屬元素
    const WEIGHTS = {H:16,C:10,O:12,N:8,Na:5,He:2,Ne:1,Ar:0.5}; //機率比重
    

    const drawPool = []; //卡池機率
    ELEMENTS.forEach(e => {
      const w = WEIGHTS[e]||3;
      for (let i=0;i<Math.round(w*2);i++) drawPool.push(e);
    });


//分子合成表
export const MOLECULES = [
  { name: "一氧化氮",  formula: { N: 1, O: 1 },        kind: "none",         effect: "poison"     },
  { name: "一氧化碳",  formula: { C: 1, O: 1 },        kind: "none",         effect: "poison"     },
  { name: "乙炔",      formula: { C: 2, H: 2 },        kind: "organic",      effect: "burn"       },
  { name: "乙烯",      formula: { C: 2, H: 4 },        kind: "organic",      effect: "burn"       },
  { name: "二氧化碳",  formula: { C: 1, O: 2 },        kind: "none",         effect: "none"       },
  { name: "水",        formula: { H: 2, O: 1 },        kind: "none",         effect: "recover"    },
  { name: "甲烷",      formula: { C: 1, H: 4 },        kind: "organic",      effect: "burn"       },
  { name: "光氣",      formula: { C: 1, O: 1, Cl: 2 }, kind: "organic",      effect: "poison"     },
  { name: "氟化鈉",    formula: { Na: 1, F: 1 },       kind: "salt",         effect: "none"       },
  { name: "氟化鈹",    formula: { Be: 1, F: 2 },       kind: "salt",         effect: "none"       },
  { name: "氟化鉀",    formula: { K: 1, F: 1 },        kind: "salt",         effect: "none"       },
  { name: "氟化鋁",    formula: { Al: 1, F: 3 },       kind: "salt",         effect: "none"       },
  { name: "氟化鋰",    formula: { Li: 1, F: 1 },       kind: "salt",         effect: "none"       },
  { name: "氟化鎂",    formula: { Mg: 1, F: 2 },       kind: "salt",         effect: "none"       },
  { name: "氧化鈉",    formula: { Na: 2, O: 1 },       kind: "salt",         effect: "none"       },
  { name: "氧化鈣",    formula: { Ca: 1, O: 1 },       kind: "salt",         effect: "none"       },
  { name: "氧化鈹",    formula: { Be: 1, O: 1 },       kind: "salt",         effect: "none"       },
  { name: "氧化鉀",    formula: { K: 2, O: 1 },        kind: "salt",         effect: "none"       },
  { name: "氧化鋁",    formula: { Al: 2, O: 3 },       kind: "salt",         effect: "none"       },
  { name: "氧化鋰",    formula: { Li: 2, O: 1 },       kind: "salt",         effect: "none"       },
  { name: "氧化鎂",    formula: { Mg: 1, O: 1 },       kind: "salt",         effect: "none"       },
  { name: "氧氣",      formula: { O: 2 },             kind: "none",         effect: "none"       },
  { name: "臭氧",      formula: { O: 3 },             kind: "none",         effect: "poison"     },
  { name: "氫氟酸",    formula: { H: 1, F: 1 },       kind: "strong_acid",  effect: "corrosion" },
  { name: "氫氣",      formula: { H: 2 },             kind: "none",         effect: "none"       },
  { name: "氫氧化鈉",  formula: { Na: 1, O: 1, H: 1},  kind: "strong_base", effect: "alkali"    },
  { name: "氫氧化鈣",  formula: { Ca: 1, O: 2, H: 2},  kind: "base",        effect: "alkali"    },
  { name: "氫氧化鉀",  formula: { K: 1, O: 1, H: 1},  kind: "strong_base", effect: "alkali"    },
  { name: "氫氧化鋁",  formula: { Al: 1, O: 3, H: 3},  kind: "none",         effect: "none"       },
  { name: "氫氧化鋰",  formula: { Li: 1, O: 1, H: 1},  kind: "strong_base", effect: "alkali"    },
  { name: "氫氧化鎂",  formula: { Mg: 1, O: 2, H: 2},  kind: "base",        effect: "alkali"    },
  { name: "氮化鈉",    formula: { Na: 3, N: 1 },       kind: "salt",         effect: "none"       },
  { name: "氮化鉀",    formula: { K: 3, N: 1 },        kind: "salt",         effect: "none"       },
  { name: "氮化鋁",    formula: { Al: 1, N: 1 },       kind: "salt",         effect: "none"       },
  { name: "氮化鋰",    formula: { Li: 3, N: 1 },       kind: "salt",         effect: "none"       },
  { name: "氮氣",      formula: { N: 2 },             kind: "none",         effect: "none"       },
  { name: "氯化鈉",    formula: { Na: 1, Cl: 1 },      kind: "salt",         effect: "none"       },
  { name: "氯化鈹",    formula: { Be: 1, Cl: 2 },      kind: "salt",         effect: "none"       },
  { name: "氯化鉀",    formula: { K: 1, Cl: 1 },       kind: "salt",         effect: "none"       },
  { name: "氯化鋁",    formula: { Al: 1, Cl: 3 },      kind: "salt",         effect: "none"       },
  { name: "氯化鋰",    formula: { Li: 1, Cl: 1 },      kind: "salt",         effect: "none"       },
  { name: "氯化鎂",    formula: { Mg: 1, Cl: 2 },      kind: "salt",         effect: "none"       },
  { name: "氯仿",      formula: { C: 1, H: 1, Cl: 3},  kind: "organic",      effect: "poison"     },
  { name: "氯氣",      formula: { Cl: 2 },            kind: "none",         effect: "poison"     },
  { name: "氰酸",      formula: { H: 1, C: 1, N: 1, O: 1}, kind: "acid",      effect: "corrosion" },
  { name: "硝酸",      formula: { H: 1, N: 1, O: 3},  kind: "strong_acid", effect: "corrosion" },
  { name: "硫化鈉",    formula: { Na: 2, S: 1 },       kind: "salt",         effect: "none"       },
  { name: "硫化鈹",    formula: { Be: 1, S: 1 },       kind: "salt",         effect: "none"       },
  { name: "硫化鉀",    formula: { K: 2, S: 1 },        kind: "salt",         effect: "none"       },
  { name: "硫化鋁",    formula: { Al: 2, S: 3 },       kind: "salt",         effect: "none"       },
  { name: "硫化鋰",    formula: { Li: 2, S: 1 },       kind: "salt",         effect: "none"       },
  { name: "硫化鎂",    formula: { Mg: 1, S: 1 },       kind: "salt",         effect: "none"       },
  { name: "硫酸",      formula: { H: 2, S: 1, O: 4},  kind: "strong_acid", effect: "corrosion" },
  { name: "溴化鈉",    formula: { Na: 1, Br: 1 },      kind: "salt",         effect: "none"       },
  { name: "溴化鉀",    formula: { K: 1, Br: 1 },       kind: "salt",         effect: "none"       },
  { name: "溴化鋰",    formula: { Li: 1, Br: 1 },      kind: "salt",         effect: "none"       },
  { name: "溴化鎂",    formula: { Mg: 1, Br: 2 },      kind: "salt",         effect: "none"       },
  { name: "碘化鈉",    formula: { Na: 1, I: 1 },       kind: "salt",         effect: "none"       },
  { name: "碘化鉀",    formula: { K: 1, I: 1 },        kind: "salt",         effect: "none"       },
  { name: "碳化矽",    formula: { C: 1, Si: 1 },       kind: "none",         effect: "poison"     },
  { name: "磷化鈉",    formula: { Na: 3, P: 1 },       kind: "salt",         effect: "none"       },
  { name: "磷化鉀",    formula: { K: 3, P: 1 },        kind: "salt",         effect: "none"       },
  { name: "磷化鋁",    formula: { Al: 1, P: 1 },       kind: "salt",         effect: "none"       },
  { name: "磷化鋰",    formula: { Li: 3, P: 1 },       kind: "salt",         effect: "none"       },
  { name: "鹽酸",      formula: { H: 1, Cl: 1 },      kind: "strong_acid",  effect: "corrosion" },
  { name: "硝酸鈉",    formula: { Na: 1, N: 1, O: 3 }, kind: "salt", effect: "none" },
  { name: "硫酸鈣",    formula: { Ca: 1, S: 1, O: 4 }, kind: "salt", effect: "none" },
{ name: "氰酸鎂", formula: { Mg: 1, C: 1, N: 1, O: 1 }, kind: "salt", effect: "none" },
    { name: "硝酸鉀", formula: { K: 1, N: 1, O: 3 }, kind: "salt", effect: "none" },
{ name: "硝酸鋰", formula: { Li: 1, N: 1, O: 3 }, kind: "salt", effect: "none" },
{ name: "氰酸鈉", formula: { Na: 1, C: 1, N: 1, O: 1 }, kind: "salt", effect: "none" },
{ name: "氰酸鉀", formula: { K: 1, C: 1, N: 1, O: 1 }, kind: "salt", effect: "none" },
{ name: "氰酸鋰", formula: { Li: 1, C: 1, N: 1, O: 1 }, kind: "salt", effect: "none" },
{ name: "氯化鈣", formula: { Ca: 1, Cl: 2 }, kind: "salt", effect: "none" }
];

//酸鹼中和表
export const NEUTRALIZATION_RECIPES = {
  "氫氧化鈉+鹽酸": "氯化鈉",
  "氫氧化鈉+硝酸": "硝酸鈉",
  "氫氧化鉀+鹽酸": "氯化鉀",
  "氫氧化鋰+氫氟酸": "氟化鋰",
  "氫氧化鈣+硫酸": "硫酸鈣",
  "氫氧化鎂+氰酸": "氰酸鎂",
    "氫氧化鈉+硝酸": "硝酸鈉",
"氫氧化鈣+硫酸": "硫酸鈣",
"氫氧化鎂+氰酸": "氰酸鎂",
    "氫氧化鈉+氫氟酸": "氟化鈉",
"氫氧化鉀+氫氟酸": "氟化鉀",
"氫氧化鋰+鹽酸": "氯化鋰",
"氫氧化鉀+硝酸": "硝酸鉀",
"氫氧化鋰+硝酸": "硝酸鋰",
"氫氧化鈉+氰酸": "氰酸鈉",
"氫氧化鉀+氰酸": "氰酸鉀",
"氫氧化鋰+氰酸": "氰酸鋰",
"氫氧化鈣+鹽酸": "氯化鈣",
"氫氧化鎂+鹽酸": "氯化鎂"
  // 可以擴充更多條目
};

//水的恢復量設定
export const RECOVER_CONFIG = {
  '水': { immediate: 7, perTurn: 1 }
};
