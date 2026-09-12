let pass=0, fail=0;
const ok=(c,m)=>{ if(c){pass++;} else {fail++; console.log('FAIL:',m);} };
const approx=(a,b,tol,m)=>ok(Math.abs(a-b)<=tol, m+' got '+a+' want '+b);

// helper: fresh state + a plant of given variety/strain, measure hours to maturity
function hoursToMature(setup){
  S=freshState(); ensurePlants();
  const p=makePlant(null); // Generic
  setup&&setup(p);
  S.plants[0]=p; S.sel=0;
  let h=0;
  while(p.growthH<GROWTH_H-1e-9&&h<200){
    // keep it watered
    p.hydAtH=p.gH;
    advancePlant(p,0,0.25); h+=0.25;
    if(p.buffUntil>0&&p.buffUntil<=p.gH&&p._rebuff){ p.buffUntil=p.gH+FERT_DUR_H; } // sustain buff for full-gear test
  }
  return h;
}

// 1. common sprout base = 24h
approx(hoursToMature(), 24/0.92, 0.3, 'common sprout base ~26h');

// 2. fastest natural seed (Flipper 1.33) ≈ 18h
approx(hoursToMature(p=>{ p.vtype='Cat'; }), 24/1.33, 0.3, 'Cat ~18h (fastest)');
approx(hoursToMature(p=>{ p.vtype='Flipper'; }), 24/1.26, 0.3, 'Flipvine ~19h (fastest Hoodie)');
ok(Math.abs(24/1.33-18)<0.1, 'Cat base time is ~18h ('+(24/1.33).toFixed(2)+')');
{ const hs=['Collector','Hodler','Builder','Flipper'].map(k=>VARIETIES[k].speed);
  ok(new Set(hs).size===4, 'Hoodies speeds all distinct');
  ok(hs[0]===1.00&&hs[3]===1.26, 'Curatorix 24h and Flipvine ~19h endpoints');
  ok(hs.every((v,i)=>i===0||v>hs[i-1]), 'Hoodies ladder strictly increasing'); }

// 3. all varieties within [18,24]h base
for(const k of Object.keys(VARIETIES)){
  const v=VARIETIES[k]; const t=24/v.speed;
  if(k==='Generic') ok(t>25.9&&t<26.3, 'Generic ~26h, got '+t.toFixed(1));
  else ok(t<=24.001&&t>=17.9, 'variety '+k+' base '+t.toFixed(1)+'h in [18,24]');
}
// Normies ladder: all 5 distinct, Human 24h -> Cat 18h
{ const sp=['Human','Zombie','Alien','Agent','Cat'].map(k=>VARIETIES[k].speed);
  ok(new Set(sp).size===5, 'Normies speeds all distinct');
  ok(sp[0]===1.00&&sp[4]===1.33, 'Human 24h and Cat 18h endpoints');
  ok(sp.every((v,i)=>i===0||v>sp[i-1]), 'Normies ladder strictly increasing'); }

// 4. full gear on a common: soil + enriched fert + lamp III → 8h
function fullGear(vt, strain){
  S=freshState(); ensurePlants();
  S.inv.lampLvlAt[0]=3; S.inv.lampOnArr[0]=true; S.inv.genLvlRoom[0]=3; S.inv.energyRoom[0]=999;
  const p=makePlant(null);
  if(strain){ S.strains[strain.id]=strain; p.strain=strain.id; p.vtype=null; }
  else if(vt) p.vtype=vt;
  p.soil=true; p.buffMult=FERT_FX.fertPlus.mult; p.buffUntil=1e9;
  S.plants[0]=p; S.sel=0;
  let h=0;
  while(p.growthH<GROWTH_H-1e-9&&h<100){ p.hydAtH=p.gH; S.inv.energyRoom[0]=999; advancePlant(p,0,0.1); h+=0.1; }
  return h;
}
approx(fullGear(), 24/0.92/3, 0.2, 'common sprout full gear ~8.7h');
// upgrade product: 1.25*1.5*1.60 = 3.0 exactly, capped at 3
ok(Math.abs(1.25*FERT_FX.fertPlus.mult*lampGrow(3)-3)<1e-9, 'upgrade product = 3.0');

// 5. best strain speed 2.0 full gear → 4h
const st={id:'x',name:'X',accent:'#fff',ink:'#000',speed:2.0,yield:1,seedLuck:0,woodMult:1,hydMult:1,rar:'rare',comm:'normies'};
approx(fullGear(null,st), 4, 0.15, 'speed-2 strain full gear 4h');

// 6. cap holds: even with an out-of-band buff the total can't beat ×3
S=freshState(); ensurePlants();
{ const p=makePlant(null); p.soil=true; p.buffMult=5; p.buffUntil=1e9; S.plants[0]=p;
  S.inv.lampLvlAt[0]=3; S.inv.lampOnArr[0]=true; S.inv.genLvlRoom[0]=3; S.inv.energyRoom[0]=999;
  ok(Math.abs(speedMult(p,0)-vOf(p).speed*3)<1e-9, 'UPGRADE_CAP clamps runaway stacks to ×3'); }

// 7. breeding clamp [1,2]
S=freshState();
for(let k=0;k<40;k++){
  const s2=mkStrain('Human','Cat');
  ok(s2.speed>=1&&s2.speed<=2, 'strain speed '+s2.speed+' in [1,2]');
}

// 8. flowers at maturity ≈ 3 for a base plant (bloom 80%→100% = 4.8 growth-h, F=1.6)
S=freshState(); ensurePlants();
{ const p=makePlant(null); S.plants[0]=p;
  let h=0; while(p.growthH<GROWTH_H-1e-9&&h<60){ p.hydAtH=p.gH; advancePlant(p,0,0.1); h+=0.1; }
  ok(p.pending.length>=2&&p.pending.length<=4, 'flowers at maturity = '+p.pending.length+' (~3)'); }

// 9. migration: old save (GROWTH 120 scale) rescaled ÷5, strains re-clamped
{ const _st={};
  localStorage.setItem=(k,v)=>{_st[k]=String(v);};
  localStorage.getItem=k=>(_st[k]!==undefined?_st[k]:null);
  const old=freshState(); delete old.balV;
  old.plants=[Object.assign(makePlant(null),{growthH:60,bloomAccH:4})];
  old.strains={a:Object.assign({},st,{id:'a',speed:2.2}), b:Object.assign({},st,{id:'b',speed:0.6})};
  old.gardens={hoodies:{plants:[Object.assign(makePlant(null),{growthH:120,bloomAccH:0})],seedsVar:{}}};
  _st[LS_KEY]=JSON.stringify(old);
  load();
  approx(S.plants[0].growthH, 12, 1e-6, 'active plant growthH 60→12');
  approx(S.plants[0].bloomAccH, 0.8, 1e-6, 'bloomAccH 4→0.8');
  approx(S.gardens.hoodies.plants[0].growthH, 24, 1e-6, 'parked plant 120→24 (mature stays mature)');
  approx(S.strains.a.speed, 2, 1e-6, 'strain 2.2→2');
  approx(S.strains.b.speed, 1, 1e-6, 'strain 0.6→1');
  ok(S.balV===2, 'balV set');
  // idempotent: load again
  _st[LS_KEY]=JSON.stringify(S); load();
  approx(S.plants[0].growthH, 12, 1e-6, 'migration idempotent');
}

// 10. tuto steps: only the two onboarding tutorials remain (first plot, then thirst)
ok(TUTO0_STEPS.length===5, 'TUTO0_STEPS has 5 steps, got '+TUTO0_STEPS.length);
ok(TUTO0_STEPS.map(s=>s.key).join()==='z0,z1,z4,z2,z3', 'TUTO0_STEPS order: plant, water, hand, uproot, menu');
ok(typeof TUTO0_STEPS[0].rect==='function'&&TUTO0_STEPS[1].targetSel==='[data-sbg="water"]'&&TUTO0_STEPS[2].targetSel==='[data-sbg="harv"]'&&TUTO0_STEPS[3].targetSel==='[data-eq="uproot"]', 'each step rings the thing it explains');
ok(!!I18N.en.tuto.z4&&!!I18N.fr.tuto.z4, 'z4 texts exist in EN+FR');
ok(freshState().mode==='alpha', 'a fresh game starts in alpha ×500 mode');
{ const m=S.mode; S.mode='alpha'; ok(timeMult()===500, 'alpha mode = ×500'); S.mode='fast'; ok(timeMult()===720, 'fast mode = ×720'); S.mode=m; }
ok(!!I18N.en.tuto.z0&&!!I18N.fr.tuto.z0, 'z0 texts exist in EN+FR');
ok(!!I18N.en.tuto.y0&&!!I18N.fr.tuto.y0, 'y0 texts exist in EN+FR');
ok(typeof maybeTuto0==='function', 'maybeTuto0 exists');
ok(typeof maybeTutoHyd==='function', 'maybeTutoHyd exists');
ok(TUTOPX_STEPS.length===3&&TUTOPX_STEPS[0].targetSel==='[data-rid="workbench"]', '50-pixel tuto: workbench → craft → market');
ok(!!I18N.en.tuto.x2&&!!I18N.fr.tuto.x2, 'x2 texts exist in EN+FR');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
