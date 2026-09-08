let pass=0, fail=0;
const ok=(c,m)=>{ if(c){pass++;} else {fail++; console.log('FAIL:',m);} };
S=freshState(); ensurePlants();
ok(Math.abs(glovesChance()-0.12)<1e-9, 'no upgrade: 12%');
S.inv.tools.gloves=true;
ok(Math.abs(glovesChance()-0.12)<1e-9, 'gloves I: 12%');
S.inv.tools.glovesUp2=true;
ok(Math.abs(glovesChance()-0.25)<1e-9, 'gloves II: 25%');
const r=RECIPES.find(x=>x.id==='glovesUp2');
ok(!!r&&r.needs==='gloves', 'upgrade requires gloves');
ok(RESEARCH_BLOCKS.find(b=>b.id==='b_harv2').recipes.includes('glovesUp2'), 'in Harvest II block');
// migration: old save without glovesUp2 gets the field
{ const _st={};
  localStorage.setItem=(k,v)=>{_st[k]=String(v);};
  localStorage.getItem=k=>(_st[k]!==undefined?_st[k]:null);
  const old=freshState(); delete old.inv.tools.glovesUp2; old.inv.tools.gloves=true;
  _st[LS_KEY]=JSON.stringify(old); load();
  ok(S.inv.tools.glovesUp2===false, 'old save patched with glovesUp2=false');
  ok(Math.abs(glovesChance()-0.12)<1e-9, 'old gloves nerfed to 12%'); }
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
