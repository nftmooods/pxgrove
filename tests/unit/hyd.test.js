// hydration coherence suite
let pass=0,fail=0; const ok=(c,m)=>{ if(c){pass++;} else {fail++; console.log('✗',m);} };
S=freshState(); S.inv.lampLvlAt=[0,0,0]; S.inv.lampOnArr=[true,true,true];
S.inv.potMatAt[0]='clay'; // this suite calibrates the base hydration multiplier itself, so pin a neutral (clay) pot rather than the fresh-game ground plot
const mk=(type)=>{ const p=makePlant(type?{type,id:1,px:400}:null); return p; };
const H=p=>+hydCapH(p).toFixed(2);
let p=mk('Human'); S.plants[0]=p; ok(H(p)===8, 'Human base 8h got '+H(p));
p=mk(null); S.plants[0]=p; ok(Math.abs(H(p)-8/0.92)<0.01, 'Common sprout 8/0.92 got '+H(p));
p=mk('Cat'); S.plants[0]=p; ok(Math.abs(H(p)-8/1.33)<0.01, 'Cat 8/1.33 got '+H(p));
p=mk('Human'); p.soil=true; S.plants[0]=p; ok(Math.abs(H(p)-8/1.25)<0.01, 'soil 6.4h got '+H(p));
p=mk('Human'); p.buffUntil=p.gH+12; p.buffMult=1.5; S.plants[0]=p; ok(Math.abs(H(p)-8/1.5)<0.01, 'fertPlus 5.33h got '+H(p));
// lamp: needs lampAt/lampOn/gen/energy
p=mk('Human'); S.plants[0]=p; S.inv.lampCount=1; S.inv.lampLvlAt=[3,0,0]; S.inv.genLvlRoom=[1,0,0]; S.inv.energyRoom=[10,0,0];
ok(lampActive(0), 'lamp active precondition');
ok(Math.abs(H(p)-6)<0.01, 'lamp III → 6h got '+H(p));
S.inv.lampLvlAt=[1,0,0]; ok(Math.abs(H(p)-7.36)<0.01, 'lamp I → 7.36h got '+H(p));
S.inv.lampLvlAt=[2,0,0]; ok(Math.abs(H(p)-6.72)<0.01, 'lamp II → 6.72h got '+H(p));
S.inv.energyRoom=[0,0,0]; ok(H(p)===8, 'lamp without power → 8h got '+H(p));
console.log(pass+' passed, '+fail+' failed');
