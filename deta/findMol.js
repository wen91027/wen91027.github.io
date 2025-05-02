   //可合成分子判定
   export function findMol(sel){
      const cnt={}; sel.forEach(c=>c&&c.el&&(cnt[c.el]=(cnt[c.el]||0)+1));
      for(const m of MOLECULES){ const f=m.formula;
        if(Object.values(f).reduce((a,b)=>a+b,0)!==sel.length) continue;
        let ok=true; for(const k in f) if(cnt[k]!==f[k]) ok=false;
        for(const k in cnt) if(!f[k]) ok=false;
        if(ok) return m;
      }
      return null;
    }
