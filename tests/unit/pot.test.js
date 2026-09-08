let pass=0, fail=0;
const ok=(c,m)=>{ if(c){pass++;} else {fail++; console.log('FAIL:',m);} };

// fresh state: 1 clay pot
S=freshState(); ensurePlants();
ok(potCount()===1, 'fresh: 1 pot');
ok(potType(0)==='clay', 'fresh: pot 1 is clay');

// potUp goes through the pot picker (clay pots only)
ok(!!POT_EQUIP.potUp, 'potUp is a per-pot install');
ok(POT_EQUIP.potUp.ok(0), 'potUp ok on clay pot');
S.inv.stone=100; S.inv.tools.workbench=true; S.inv.research={b_stone:true};
const rUp=RECIPES.find(r=>r.id==='potUp');
applyPotEquip('potUp',0,false);
ok(potType(0)==='ceramic', 'pot 1 upgraded to ceramic');
ok(S.inv.stone===75, 'upgrade cost 25 stone');
ok(S.inv.ceramicCount===1, 'ceramicCount derived');
ok(!POT_EQUIP.potUp.ok(0), 'potUp refuses an already-ceramic pot');

// add pot: new slot arrives ceramic
const rAdd=RECIPES.find(r=>r.id==='pot');
ok(POT_EQUIP.pot.ok(2)&&!POT_EQUIP.pot.ok(0), 'clay pot targets a FREE slot only');
applyPotEquip('pot',2,false); // place it on slot 3, leaving slot 2 empty (sparse)
ok(potCount()===2, 'add: 2 pots');
ok(hasPot(2)&&!hasPot(1), 'sparse: pot on slot 3, slot 2 still free');
ok(potType(2)==='clay', 'added pot is a plain clay pot');
ok(S.sel===2, 'new pot selected');
ok(potList().join()==='0,2', 'potList lists real pots only');
S.inv.stone+=40; applyPotEquip('pot',1,false); // fill slot 2 too for the upgrade checks below
ok(potCount()===3&&S.inv.potCrafts===2, 'potCrafts derived = pots-1');
ok(POT_EQUIP.potUp.ok(1), 'the new pot can be upgraded individually');
applyPotEquip('potUp',1,false);
ok(potType(1)==='ceramic', 'individual upgrade works on the new pot');
ok(S.inv.stone===10, 'add 40 + second upgrade 25 paid');

// caps: additions limited to slots-1; upgrades limited to existing pots
ok(multiMax(rAdd)===potSlots()-1, 'add cap = slots-1');
ok(multiMax(rUp)===potCount(), 'upgrade cap = existing pots');

// flower cap bonus applies via potType
{ const p=makePlant(null); p.vtype='Human'; S.plants[0]=p;
  S.inv.potMatAt[0]='ceramicBig'; recomputeEquipCounts();
  const c0=flowerCap(p,0);
  S.inv.potMatAt[0]='clay'; recomputeEquipCounts();
  const c1=flowerCap(p,0);
  ok(c0===c1+2, 'big ceramic +2 flower cap ('+c0+' vs '+c1+')');
  S.inv.potMatAt[0]='ceramic'; recomputeEquipCounts();
  ok(flowerCap(p,0)===c1+1, 'ceramic +1 flower cap');
  S.inv.potMatAt[0]='ceramicBig'; recomputeEquipCounts(); }
// pot materials: water reserve & growth
{ const p=makePlant(null); p.vtype='Human'; S.plants[0]=p;
  S.inv.potMatAt[0]='clay'; const h0=hydCapH(p);
  S.inv.potMatAt[0]='selfWater'; ok(Math.abs(hydCapH(p)-h0*1.40)<1e-6, 'self-watering ×1.40 water');
  S.inv.potMatAt[0]='plastic'; ok(Math.abs(hydCapH(p)-h0*1.25)<1e-6, 'plastic ×1.25 water');
  S.inv.potMatAt[0]='concrete'; ok(Math.abs(hydCapH(p)-h0*1.15)<1e-6, 'concrete ×1.15 water');
  S.inv.potMatAt[0]='terracotta'; ok(Math.abs(hydCapH(p)-h0*0.80/1.05)<1e-6, 'terracotta: ×0.80 water and growth 1.05 dries more (Human)');
  ok(Math.abs(upgradeMult(p,0)-1.05)<1e-9, 'terracotta growth ×1.05 for Human');
  const cat=makePlant({type:'Cat',id:2,px:400}); S.plants[0]=cat;
  ok(Math.abs(upgradeMult(cat,0)-1.15)<1e-9, 'terracotta growth ×1.15 for Cat');
  S.inv.potMatAt[0]='plastic'; ok(Math.abs(upgradeMult(cat,0)-0.90)<1e-9, 'plastic growth ×0.90 for Cat');
  S.plants[0]=p; ok(Math.abs(upgradeMult(p,0)-1.0)<1e-9, 'plastic growth ×1.00 for Human');
  S.inv.potMatAt[0]='clay'; }

// migration: old save potCrafts=3 (upgrade + 2 adds) → 3 ceramic pots, potCrafts=2
{ const _st={};
  localStorage.setItem=(k,v)=>{_st[k]=String(v);};
  localStorage.getItem=k=>(_st[k]!==undefined?_st[k]:null);
  const old=freshState();
  old.inv.potCrafts=3; delete old.inv.ceramicAt; delete old.inv.ceramicCount; delete old.inv.potMatAt; delete old.inv.potAt;
  old.inv.roomCount=1; // 6 slots so 3 pots fit
  _st[LS_KEY]=JSON.stringify(old);
  load();
  ok(S.inv.potCrafts===2, 'migration: potCrafts 3 → 2 adds, got '+S.inv.potCrafts);
  ok(potCount()===3, 'migration: still 3 pots, got '+potCount());
  ok(potType(0)==='ceramicBig'&&potType(1)==='ceramicBig'&&potType(2)==='ceramicBig', 'migration: all 3 big ceramic (old +2 upgrade)');
  // ceramicAt-era save → potMatAt
  const mid=freshState(); mid.inv.ceramicAt=[true,false,false,false,false,false,false,false,false]; delete mid.inv.potMatAt; delete mid.inv.potAt;
  _st[LS_KEY]=JSON.stringify(mid); load();
  ok(potType(0)==='ceramicBig'&&potType(1)==='clay', 'migration: ceramicAt true → ceramicBig, false → clay');
  // old save potCrafts=0 → clay pot
  const old0=freshState(); old0.inv.potCrafts=0; delete old0.inv.ceramicAt; delete old0.inv.potMatAt; delete old0.inv.potAt;
  _st[LS_KEY]=JSON.stringify(old0); load();
  ok(potCount()===1&&potType(0)==='clay', 'migration: potCrafts 0 → 1 clay pot');
}
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
