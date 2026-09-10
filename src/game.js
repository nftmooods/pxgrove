'use strict';
const BUILD_STAMP='__BUILD_STAMP__'; // last update (Europe/Brussels) — refreshed by /tmp/stamp.py before every publish
/* ════════════════ PxGrove — MVP Step 1 · multi-pot garden ════════════════ */

/* ── Varieties: Normie Type → plant ── */
const VARIETIES = {
  Human:  {name:'Graminelle',  accent:'#7fb069', ink:'#1d2417', speed:1.00, yield:1.00, seedLuck:0.10, rar:'common'},
  Zombie: {name:'Necroflora',  accent:'#d4707f', ink:'#2a1418', speed:1.07, yield:1.25, seedLuck:0.12, rar:'widespread'},
  Agent:  {name:'Cryptovine',  accent:'#5fb3c9', ink:'#0f2228', speed:1.23, yield:1.10, seedLuck:0.15, rar:'rare'},
  Cat:    {name:'Felicaria',   accent:'#e8a14f', ink:'#2b1e0d', speed:1.33, yield:1.15, seedLuck:0.18, rar:'rare'},
  Alien:  {name:'Xenosprout',  accent:'#9b7fd4', ink:'#1e1730', speed:1.14, yield:1.50, seedLuck:0.25, rar:'veryRare'},
  Generic:{name:'commonSprout',accent:'#8fa78b', ink:'#23261f', speed:0.92, yield:0.80, seedLuck:0.05, woodMult:0.5, rar:'noNormie'}, // no token: ~26h growth + 2 flowers max + half wood
  /* OnChain Hoodies varieties (traits.hoodie) */
  Builder:  {name:'Fabricaule', accent:'#e8894f', ink:'#2b1a0d', speed:1.17, yield:1.05, seedLuck:0.12, woodMult:1.3, rar:'widespread'},
  Collector:{name:'Curatorix',  accent:'#5fc98f', ink:'#0f281a', speed:1.00, yield:1.10, seedLuck:0.20, rar:'common'},
  Flipper:  {name:'Flipvine',   accent:'#c95f8e', ink:'#280f1c', speed:1.26, yield:0.95, seedLuck:0.15, rar:'rare'},
  Hodler:   {name:'Diamantia',  accent:'#5f8ec9', ink:'#0f1a28', speed:1.08, yield:1.35, seedLuck:0.10, hydMult:1.25, rar:'widespread'},
  /* Hybrids: bought with coins, consumable seeds — STERILE (no seed on harvest or death) */
  HybridBloom: {name:'Prismabloom', accent:'#d4b35f', ink:'#2b230d', speed:1.15, yield:2.00, seedLuck:0, woodMult:1,   sterile:true, rar:'hybrid'},
  HybridTimber:{name:'Lignivora',   accent:'#b08d5e', ink:'#241b10', speed:1.00, yield:0.90, seedLuck:0, woodMult:2.5, sterile:true, rar:'hybrid'},
};
const HYBRIDS = { hybridBloom:{v:'HybridBloom', price:300}, hybridTimber:{v:'HybridTimber', price:200} };

/* ── Communities: each pixel-NFT collection with an API becomes a plantation ── */
const COMMUNITIES={
  normies:{name:'Normies',         token:'Normie', ic:'🟩', idMax:9999, pxMax:1600, pxCap:1600, apiHost:'api.normies.art',
    types:['Human','Zombie','Agent','Cat','Alien'],
    api:id=>'https://api.normies.art/normie/'+id+'/metadata',
    theme:{}}, // Normies keep the monochrome default look
  hoodies:{name:'OnChain Hoodies', token:'Hoodie', ic:'🧥', idMax:5999, pxMax:250,  pxCap:400, apiHost:'api.onchainhoodies.xyz',
    types:['Builder','Collector','Flipper','Hodler'],
    api:id=>'https://api.onchainhoodies.xyz/v1/token/'+id,
    // brand chart: Robinhood green on near-black, as used by OnChain Hoodies
    theme:{ground:'#0b0e0c',panel:'#121613',panel2:'#181d19',line:'#2a3a2e',
           paper:'#e8f0e9',muted:'#9fb3a4',faint:'#6f826f',ok:'#00c805',
           brand:'#00c805',brandInk:'#032310',sky:'#0e120f',sky2:'#121814',
           panelA:'rgba(8,12,10,.86)', night:true,
           // night garden in Robinhood green
           skyTop:'#06100b',skyBot:'#123422',cloud:'#1c4a30',treeD:'#0a2214',treeL:'#12381f',treeHi:'#1c5a2e',
           grass:'#1c4a2a',grassD:'#133621',grassL:'#27643a',flower:'#7fe09a',flower2:'#00c805',
           fence:'#26342a',fenceD:'#17221b',fenceL:'#35483a',stone:'#3a4a3e',stoneD:'#25302a',stoneL:'#4d6052',
           soil:'#1a1410',soilL:'#241c16',barrel:'#2e3a30',barrelD:'#1d261f',barrelBand:'#0f1a12',lantern:'#00c805',post:'#1f2a22'}},
};
/* per-community theme: a new project can ship its own color chart */
const THEME_DEFAULTS={ground:'#2a2d2b',panel:'#3f4143',panel2:'#48494b',line:'#5a5c5e',
  paper:'#e3e5e4',muted:'#a8abad',faint:'#7c7f81',ok:'#7fb069',
  brand:'#8fa78b',brandInk:'#23261f',sky:'#3b3d3f',sky2:'#3e4042',
  panelA:'rgba(28,31,30,.86)',
  // painted-garden scene (daylight): sky gradient, distant trees, fence, grass, stone beds
  skyTop:'#5d7f9c',skyBot:'#a9c6d6',cloud:'#d8e6ee',treeD:'#3c6437',treeL:'#5f8f4a',treeHi:'#7fae62',
  grass:'#6a9a45',grassD:'#527d35',grassL:'#86b35a',flower:'#f2e8c8',flower2:'#e8c85a',
  fence:'#9a7449',fenceD:'#6f5233',fenceL:'#b58d5e',stone:'#a39d90',stoneD:'#6e6a60',stoneL:'#c4beb0',
  soil:'#3a2a20',soilL:'#4c382a',barrel:'#7a5535',barrelD:'#553a24',barrelBand:'#4a4a4a',lantern:'#ffd75e',post:'#5c4630'};
function activeTheme(){ return Object.assign({},THEME_DEFAULTS,C().theme||{}); }
function applyCommTheme(){
  const th=activeTheme(), r=document.documentElement.style;
  r.setProperty('--panel-a',th.panelA||'rgba(28,31,30,.86)');
  r.setProperty('--ground',th.ground); r.setProperty('--panel',th.panel); r.setProperty('--panel-2',th.panel2);
  r.setProperty('--line',th.line);     r.setProperty('--paper',th.paper); r.setProperty('--muted',th.muted);
  r.setProperty('--faint',th.faint);   r.setProperty('--ok',th.ok);
  r.setProperty('--brand',th.brand);   r.setProperty('--brand-ink',th.brandInk);
}
function C(){ return COMMUNITIES[S.comm]||COMMUNITIES.normies; }
/* sample verified via api.onchainhoodies.xyz on 2026-09-03: id → [hoodie, blackPixels] */
const HOODIE_SNAPSHOT={0:['Hodler',157],1:['Builder',106],42:['Hodler',110],500:['Flipper',210],
  777:['Builder',115],1234:['Collector',99],1500:['Flipper',97],2222:['Collector',94],
  2500:['Hodler',146],3210:['Builder',139],3500:['Collector',100],4242:['Builder',98],
  4500:['Collector',96],5500:['Collector',144],5999:['Hodler',111]};
function commSnapshot(){ return S.comm==='hoodies'?HOODIE_SNAPSHOT:SNAPSHOT; }
/* ── API snapshot (api.normies.art, taken 2026-08-30): id → [Type, Pixel Count, Level] ── */
const SNAPSHOT = {
  0:['Human',460,119],1:['Zombie',1272,151],2:['Zombie',1370,1],3:['Zombie',1309,1],4:['Human',596,1],
  5:['Human',584,1],6:['Human',696,1],7:['Human',332,1],8:['Human',562,1],9:['Human',486,1],
  10:['Zombie',1427,1],42:['Human',577,1],69:['Human',537,1],100:['Zombie',1394,1],123:['Human',570,1],
  250:['Human',540,1],500:['Human',536,1],555:['Human',460,1],777:['Human',390,1],1000:['Zombie',1518,1],
  1111:['Human',642,1],1337:['Human',524,1],1500:['Human',645,1],2000:['Human',409,1],2500:['Human',305,1],
  3000:['Zombie',1439,1],3333:['Human',528,1],3500:['Human',548,1],4000:['Human',409,1],4444:['Human',609,1],
  4500:['Human',489,1],5000:['Human',467,1],5555:['Human',334,1],6000:['Human',445,15],6666:['Human',606,7],
  7000:['Human',575,1],7777:['Human',408,1],8000:['Human',524,1],8888:['Human',402,1],9000:['Human',774,1],
  9999:['Agent',615,33],
};

/* ── v1 numbers (GAME hours; ×720 in fast mode) ── */
const GROWTH_H = 24; // balance v2 (09/2026): common seeds mature in 24h, fastest in 18h
const BLOOM_P  = 0.8;
const HYD_CAP_H = 8;             // base plant (speed ×1.00): full → dry in 8 h
function lampDry(l){ return l>=3?0.75:(l===2?0.84:(l===1?0.92:1)); } // a lamp dries even more: 7.4 h / 6.7 h / 6 h on a base plant
const WITHER_GRACE_H = 24;
const FLOWER_BASE_H = 1.6; // in GROWTH-hours (bloomAccH follows speedMult): ~3 flowers at maturity
const HAND_FILL = 0.5;
/* Wood scales with the plant's AGE: (6 + 3×size) wood per game-day grown, capped at 8 days.
   Base rate (≥7.8/day) always beats one generator's burn (5/day) → base plants are profitable
   by construction; size, shears and Lignivora create the surplus. */
const WOOD_DAY_BASE = 6, WOOD_DAY_SIZE = 3, WOOD_DAYS_CAP = 8;
function woodYield(p){ return Math.round((WOOD_DAY_BASE+WOOD_DAY_SIZE*sizeF(p))*Math.min(p.gH/24,WOOD_DAYS_CAP)); }
const GEN_WOOD_PER_DAY = 5;      // recharge cost: 5 wood per 24h of energy
const EN_CAP_H = 24;             // battery hours per coal-generator level
function lampDraw(l){ return 0.5+0.5*l; }   // lvl1: 1 h/h · lvl2: 1.5 · lvl3: 2 — bigger lamps drink more
function lampGrow(l){ return l>=3?1.60:(l===2?1.45:(l===1?1.30:1)); } // GROWTH ×1.30 / ×1.45 / ×1.60
/* BALANCE INVARIANT: the product of every growth upgrade is capped at ×3 — so a fully
   equipped plant matures in 24/3=8h (common) down to 24/(2×3)=4h (best bred strain).
   Adding a new growth upgrade later REQUIRES re-splitting the ×3 budget between items. */
const UPGRADE_CAP = 3;
const PUMP_DRAW = 0.5;           // the electronic drip pump draws half that
const WOOD_PER_ENERGY = GEN_WOOD_PER_DAY/24;
const FERT_DUR_H = 12;
const MAX_POTS = 9; // 3 slots per room, base room + up to 2 built rooms
const ROOM_SLOTS = 3;
const TANK_CAP_H = 72;          // drip tank: 72 plant-hours of water
const SHEARS_WOOD_MULT = 1.40;  // shears I: +40% wood on harvest
const SHEARS_WOOD_MULT2 = 1.75; // shears II (the former single shears): +75%
function shearsMult(){ return S.inv.tools.shearsUp2?SHEARS_WOOD_MULT2:SHEARS_WOOD_MULT; }
const GLOVES_NO_CUT = 0.12;     // gloves I: 12% chance the plant is NOT cut
const GLOVES_NO_CUT2 = 0.25;    // gloves II: 25% — the old flat 35% was too strong
function glovesChance(){ return S.inv.tools.glovesUp2?GLOVES_NO_CUT2:GLOVES_NO_CUT; }
const FERT_FX = { compost:{mult:1.15,luck:0}, fert:{mult:1.30,luck:0}, fertPlus:{mult:1.50,luck:0.05},
  fertHuman:{mult:1.40,luck:0,only:'Human'}, fertZombie:{mult:1.40,luck:0,only:'Zombie'},
  fertAgent:{mult:1.40,luck:0,only:'Agent'}, fertCat:{mult:1.40,luck:0,only:'Cat'}, fertAlien:{mult:1.40,luck:0,only:'Alien'} };
const UPROOT_WOOD_RATIO = 1/3;
/* Mutations: rolled at planting, revealed at 25% growth. Mostly cosmetic + almanac; double = +1 flower cap */
const MUTATIONS={ gold:{p:0.03}, twist:{p:0.025}, double:{p:0.02}, glow:{p:0.005} };
function rollMutation(){
  const r=Math.random(); let acc=0;
  for(const k of ['glow','double','twist','gold']){ acc+=MUTATIONS[k].p; if(r<acc)return k; }
  return 'none';
}
const QUEST_POOL=[
  {id:'water3', key:'water', target:3},
  {id:'harvest1', key:'harvest', target:1},
  {id:'grind100', key:'px', target:100},
  {id:'craft2', key:'craft', target:2},
  {id:'try1', key:'try', target:1},
  {id:'fert1', key:'fert', target:1},
  {id:'sell1', key:'sell', target:1},
  {id:'plant1', key:'plant', target:1},
];
const QUEST_REWARD_PX=20;   // per quest
/* ── 15 badges (achievements) ── */
const BADGES=[
 {id:'firstHarvest', ic:'🌾', chk:s=>(s.stats.harvest||0)>=1},
 {id:'waters100',    ic:'💧', chk:s=>(s.stats.water||0)>=100},
 {id:'wood500',      ic:'🪓', chk:s=>(s.stats.woodEarned||0)>=500},
 {id:'machines',     ic:'🏭', chk:s=>s.inv.tools.workbench&&s.inv.tools.furnace&&s.inv.genCount>0},
 {id:'research3',    ic:'🔬', chk:s=>s.inv.research.t1&&s.inv.research.t2&&s.inv.research.t3},
 {id:'discover5',    ic:'🧪', chk:s=>(s.inv.discovered||[]).length>=5},
 {id:'mutation1',    ic:'✨', chk:s=>Object.keys(s.almanac.seen).some(k=>!k.endsWith(':none'))},
 {id:'almanacRow',   ic:'📗', chk:s=>['Human','Cat','Alien','Agent','Zombie','Generic','HybridBloom','HybridTimber'].some(v=>['none','gold','twist','double','glow'].every(m=>s.almanac.seen[v+':'+m]))},
 {id:'varieties5',   ic:'🌿', chk:s=>new Set(Object.keys(s.almanac.seen).map(k=>k.split(':')[0])).size>=5},
 {id:'firstSell',    ic:'🪙', chk:s=>(s.stats.sell||0)>=1},
 {id:'coins1000',    ic:'💰', chk:s=>(s.stats.coinsEarned||0)>=1000},
 {id:'hybridCut',    ic:'⚗️', chk:s=>(s.stats.hybridHarvests||0)>=1},
 {id:'streak7',      ic:'🔥', chk:s=>s.streak.count>=7},
 {id:'perfectDay',   ic:'✅', chk:s=>(s.stats.perfectDays||0)>=1},
 {id:'gardenFull',   ic:'🏡', chk:s=>potCount()>=3&&s.plants.filter(p=>p&&!p.dead&&!p.cut).length>=3},
];
function checkBadges(){
  const t=T();
  for(const b of BADGES){
    if(S.badges[b.id])continue;
    let ok=false; try{ ok=b.chk(S); }catch(e){}
    if(ok){ S.badges[b.id]=Date.now(); showToast('🏅 '+t.badgeUnlocked+' — '+b.ic+' '+t.badges[b.id].nm); save(); }
  }
}
let toastTimer=null;
let stagePopTimer=0;
function stagePop(html,ms){ // one notification line: the newest message replaces whatever was showing
  const el=$('stagePop'); if(!el)return;
  { const t=$('toast'); if(t){ t.classList.remove('on'); clearTimeout(toastTimer); } }
  el.innerHTML=html; el.classList.add('on');
  clearTimeout(stagePopTimer); stagePopTimer=setTimeout(()=>el.classList.remove('on'),ms||7000);
}
function showToast(msg){ // one notification line: the newest message replaces whatever was showing
  const el=$('toast'); if(!el)return;
  { const p=$('stagePop'); if(p){ p.classList.remove('on'); clearTimeout(stagePopTimer); } }
  el.textContent=msg; el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('on'),4000); // gone after a few seconds
}
const QUEST_ALL_SEED=1;     // all 3 done → bonus seed // uprooting a dead plant yields 1/3 of harvest wood
/* Market: buy at full price, selling pays 2/3 (1/3 sales fee).
   Prices track crafting costs so the market can't undercut the chains. */
const MARKET_FEE = 1/3;
const MARKET = { px:1, wood:2, stone:30, metal:200, mineral:800 };
function sellNet(k,q){ return Math.round(MARKET[k]*q*(1-MARKET_FEE)*10)/10; } // to 1 decimal: 1 pixel sells for 0.7 $, not 0
function fmtCoins(c){ c=Math.round((c||0)*10)/10; return Number.isInteger(c)?String(c):c.toFixed(1); }
/* Seed resale value: rarity only — properties never change the price. */
const SEED_PRICE={noNormie:1,common:2,widespread:3,uncommon:4,rare:5,hybrid:6,veryRare:8,epic:8,legendary:12};

/* ── Recipe data pack (mirrors the Notion tables — the engine only reads this) ── */
const RECIPES = [
  {id:'workbench',  tier:0, cat:'build', kind:'tool',       ic:'🧰', cost:{wood:20}, noBench:true},
  {id:'bucketWood', tier:0, cat:'plant', kind:'tool',       ic:'🪣', cost:{wood:10,px:20}},
  {id:'soil',       tier:0, cat:'plant', kind:'consumable', ic:'🪴', cost:{wood:15,px:10}, gives:{soil:1}},
  {id:'compost',    tier:0, cat:'plant', kind:'consumable', ic:'🍂', cost:{px:10,wood:5},  gives:{compost:1}},
  {id:'fert',       tier:0, cat:'plant', kind:'consumable', ic:'🧪', cost:{px:30,wood:5},  gives:{fert:1}},
  {id:'stone',      tier:1, cat:'build', kind:'resource',   ic:'🪨', cost:{px:25},         gives:{stone:1}},
  {id:'shears',     tier:1, cat:'plant', kind:'tool',       ic:'✂️', cost:{wood:10,stone:15}, equip:true},
  {id:'potUp',      tier:1, cat:'build', kind:'multi',      ic:'🏺', cost:{stone:25}, cnt:'ceramicCount', max:9, capFn:()=>potSlots()},
  {id:'potBig',     tier:2, cat:'build', kind:'multi',      ic:'🏺', cost:{stone:20,metal:5}, cnt:'ceramicBigCount', max:9, capFn:()=>potSlots()},
  {id:'potTerra',   tier:1, cat:'build', kind:'multi',      ic:'🟠', cost:{stone:30,wood:10}, cnt:'terraCount', max:9, capFn:()=>potSlots()},
  {id:'potPlastic', tier:2, cat:'build', kind:'multi',      ic:'🟢', cost:{px:60,metal:2}, cnt:'plasticCount', max:9, capFn:()=>potSlots()},
  {id:'potConcrete',tier:2, cat:'build', kind:'multi',      ic:'⬜', cost:{stone:45,mineral:5}, cnt:'concreteCount', max:9, capFn:()=>potSlots()},
  {id:'potSelfWater',tier:2,cat:'build', kind:'multi',      ic:'🫗', cost:{stone:30,metal:8,mineral:5}, cnt:'selfWaterCount', max:9, capFn:()=>potSlots()},
  {id:'pot',        tier:1, cat:'build', kind:'multi',      ic:'🪴', cost:{stone:40}, cnt:'potCrafts', max:8, capFn:()=>potSlots()-1},
  {id:'room',       tier:2, cat:'build', kind:'multi',      ic:'🏠', cost:{wood:60,stone:40,metal:10}, cnt:'roomCount', max:2},
  {id:'controlDesk',tier:2, cat:'build', kind:'multi',      ic:'🖥️', cost:{wood:100,stone:80,metal:30,mineral:10}, cnt:'controlDesk', max:1},
  {id:'furnace',    tier:1, cat:'build', kind:'machine',    ic:'🔥', cost:{stone:30,wood:10}},
  {id:'metal',      tier:2, cat:'build', kind:'resource',   ic:'⚙️', cost:{stone:5,wood:5}, gives:{metal:1}, needs:'furnace', bonus:{res:'mineral',n:1,chance:0.10}},
  {id:'bucketMetal',tier:2, kind:'tool',       ic:'🪣', cost:{metal:8}},
  {id:'gloves',     tier:2, cat:'plant', kind:'tool',       ic:'🧤', cost:{wood:5,metal:3}, equip:true},
  {id:'glovesUp2',  tier:2, cat:'plant', kind:'tool',       ic:'🧤', cost:{metal:8,mineral:2}, needs:'gloves'},
  {id:'shearsUp2',  tier:2, cat:'plant', kind:'tool',       ic:'✂️', cost:{metal:6,stone:10}, needs:'shears'},
  {id:'arrosoir',   tier:2, cat:'plant', kind:'tool',       ic:'🚿', cost:{metal:6,wood:10}},
  {id:'tank',       tier:2, cat:'build', kind:'multi',      ic:'🛢️', cost:{metal:10,stone:10}, cnt:'tankCount', max:3, capFn:()=>roomsCount()},
  {id:'breedlab',   tier:2, cat:'build', kind:'machine',    ic:'🧬', cost:{wood:20,stone:10,metal:5}, needs:'furnace'},
  {id:'fertPlus',   tier:2, cat:'plant', kind:'consumable', ic:'💠', cost:{fert:1,mineral:2}, gives:{fertPlus:1}},
  {id:'fertHuman',  tier:2, cat:'plant', kind:'consumable', ic:'🟢', cost:{px:40,wood:10,mineral:1}, gives:{fertHuman:1}},
  {id:'fertZombie', tier:2, cat:'plant', kind:'consumable', ic:'🌹', cost:{px:40,wood:10,mineral:1}, gives:{fertZombie:1}},
  {id:'fertAgent',  tier:2, cat:'plant', kind:'consumable', ic:'🔷', cost:{px:40,wood:10,mineral:1}, gives:{fertAgent:1}},
  {id:'fertCat',    tier:2, cat:'plant', kind:'consumable', ic:'🟠', cost:{px:40,wood:10,mineral:1}, gives:{fertCat:1}},
  {id:'fertAlien',  tier:2, cat:'plant', kind:'consumable', ic:'🟣', cost:{px:40,wood:10,mineral:1}, gives:{fertAlien:1}},
  {id:'generator',  tier:2, cat:'build', kind:'multi',      ic:'⚡', cost:{metal:15,stone:20,wood:10}, cnt:'genCount', max:3, capFn:()=>roomsCount()},
  {id:'genUp2',     tier:2, cat:'build', kind:'multi',      ic:'🔋', cost:{metal:10,stone:10}, cnt:'genLvl2Count', max:9, needs:'generator', capBy:'genCount'},
  {id:'genUp3',     tier:2, cat:'build', kind:'multi',      ic:'🪫', cost:{metal:20,mineral:3}, cnt:'genLvl3Count', max:9, needs:'generator', capBy:'genLvl2Count'},
  {id:'drip',       tier:3, cat:'build', kind:'multi',      ic:'💧', cost:{metal:8,wood:15}, cnt:'dripCount', max:9, needs:'tank'},
  {id:'dripPlus',   tier:3, cat:'build', kind:'multi',      ic:'💦', cost:{metal:10,mineral:3}, cnt:'dripPlusCount', max:9, needs:'drip', capBy:'dripCount'},
  {id:'dripElec',   tier:3, cat:'build', kind:'multi',      ic:'🚰', cost:{metal:15,mineral:5}, cnt:'dripElecCount', max:9, needs:'generator', capBy:'dripPlusCount'},
  {id:'lamp',       tier:3, cat:'build', kind:'multi',      ic:'💡', cost:{metal:10,mineral:5}, cnt:'lampCount', max:9, needs:'generator'},
  {id:'lampUp2',    tier:3, cat:'build', kind:'multi',      ic:'🔆', cost:{metal:12,mineral:6}, cnt:'lampLvl2Count', max:9, needs:'lamp', capBy:'lampCount'},
  {id:'lampUp3',    tier:3, cat:'build', kind:'multi',      ic:'🌟', cost:{metal:20,mineral:10}, cnt:'lampLvl3Count', max:9, needs:'lamp', capBy:'lampLvl2Count'},
];
/* Research: pay coins to reveal a tier's recipes (details + crafting).
   The experiment table can discover any recipe for free instead. */
/* Research BLOCKS: each tier is split into themed categories; every block of a tier
   must be researched before the next tier opens. Costs in coins (mirrors the Notion table). */
const RESEARCH_BLOCKS=[
  {id:'b_stone', tier:1, ic:'🪨', cost:30,  recipes:['stone','pot','potUp','potTerra']},
  {id:'b_heat',  tier:1, ic:'🔥', cost:40,  recipes:['furnace']},
  {id:'b_harv1', tier:1, ic:'✂️', cost:30,  recipes:['shears']},
  {id:'b_metal', tier:2, ic:'⚙️', cost:60,  recipes:['metal','bucketMetal']},
  {id:'b_serum', tier:2, ic:'🧪', cost:60,  recipes:['fertPlus','fertHuman','fertZombie','fertAgent','fertCat','fertAlien']},
  {id:'b_water', tier:2, ic:'💦', cost:60,  recipes:['arrosoir','tank']},
  {id:'b_harv2', tier:2, ic:'🧤', cost:40,  recipes:['gloves','glovesUp2','shearsUp2']},
  {id:'b_energy',tier:2, ic:'⚡', cost:50,  recipes:['generator','genUp2','genUp3']},
  {id:'b_breed', tier:2, ic:'🧬', cost:30,  recipes:['breedlab']},
  {id:'b_build', tier:2, ic:'🏠', cost:40,  recipes:['room','controlDesk','potBig','potPlastic','potConcrete','potSelfWater']},
  {id:'b_irrig', tier:3, ic:'🚰', cost:450, recipes:['drip','dripPlus','dripElec']},
  {id:'b_light', tier:3, ic:'💡', cost:350, recipes:['lamp','lampUp2','lampUp3']},
];
const BLOCK_OF={}; RESEARCH_BLOCKS.forEach(b=>b.recipes.forEach(r=>BLOCK_OF[r]=b.id));

/* ── i18n ── */
const I18N = {
en:{
  sub:'update '+BUILD_STAMP, real:'Real time', fast:'Fast ×720',
  plantTitle:'Plant your Normie',
  plantTitleC:tok=>'Plant your '+tok,
  commLbl:'NFT collection',
  plantP1C:(tok,mx)=>'Enter your '+tok+'\'s number (<strong>0 to '+mx+'</strong>). Its <strong>Type</strong> decides your plant\'s variety, its <strong>Pixel Count</strong> decides its size and flower production — locked in at planting time.',
  randomHintC:(n,tok,host)=>'“Random” picks from the embedded sample ('+n+' '+tok+'s verified via '+host+').',
  varTitleC:n=>n+' types → '+n+' varieties',
  switchTok:tok=>'Switch '+tok,
  errNumC:mx=>'Invalid number — enter a number between 0 and '+mx+'.',
  plantP1:'Enter your Normie\'s number (<strong>0 to 9999</strong>). Its <strong>Type</strong> decides your plant\'s variety, its <strong>Pixel Count</strong> decides its size and flower production — locked in at planting time.',
  idPh:'no. 0-9999', find:'Find', random:'Random',
  randomHint:'“Random” picks from the embedded sample (42 Normies verified via api.normies.art on 2026-08-30).',
  manualP1:'<strong>This Normie isn\'t in the embedded sample.</strong> Grab its real data in 2 clicks:',
  manualP2a:'1. Open ', manualP2b:' (new tab)<br>2. Copy the whole page content and paste it here:',
  importBtn:'Import', noNormie:'No Normie at hand?', noTokC:tok=>'No '+tok+' at hand?', genericBtn:'Plant a common sprout',
  genericHint:'⚠ The common sprout is weaker than collection varieties: ~26h to mature (instead of 24-18h), 2 flowers max (instead of 6+) and 50% of the wood of the humblest project seeds. Enough to play — but owning a token really pays off.',
  back:'← Back to the garden',
  varTitle:'5 types → 5 varieties',
  varHint:'Speed = growth time · Flowers = pixel richness of the flowers. The rarer the type, the more generous the variety.',
  varLine:(t,v)=>t+' · speed ×'+v.speed.toFixed(2)+' · flowers ×'+v.yield.toFixed(2)+' · 2-seed '+Math.round(v.seedLuck*100)+'%',
  rar:{common:'common',widespread:'widespread',rare:'rare',veryRare:'very rare',noNormie:'no Normie',hybrid:'hybrid',uncommon:'uncommon',epic:'epic',legendary:'legendary'},
  breedTitle:'Breeding lab', breedBtn:'🧬 Breed', breedBtn10:'🧬 ×10', breedParentA:'Parent A', breedParentB:'Parent B',
  breedBatchMsg:(ok,fail,names)=>'Batch: '+ok+' success'+(ok>1?'es':'')+' · '+fail+' failure'+(fail>1?'s':'')+(names.length?(' — '+names.slice(0,4).join(', ')+(names.length>4?'…':'')):''),
  breedHint:'Cross two varieties: each stat is inherited from one parent, then mutates a little. Hunt for rare, fast, or hardy seeds — every cross is unique.',
  breedCost:(fee,pct)=>'Cost: 1 seed of each parent + '+fee+' 🪙 · success '+pct+'%',
  breedNeedLab:'You need to craft the Breeding lab first (tier 2, workshop).',
  breedPick:'Pick two parents.', breedNoSeeds:'Not enough seeds of the chosen parents.', breedNoCoins:'Not enough coins.',
  breedFail:'The cross failed… the seeds were lost. Try again!',
  breedOk:(nm,rar)=>'✨ New strain: '+nm+' ('+rar+') — 1 seed added. Plant it from the carnet or the seed picker.',
  strainsTitle:'Strains created', strainParents:(a,b)=>a+' × '+b,
  strainLine:s=>'speed ×'+s.speed.toFixed(2)+' · flowers ×'+s.yield.toFixed(2)+' · wood ×'+s.woodMult.toFixed(2)+' · resist ×'+s.hydMult.toFixed(2)+' · 2-seed '+Math.round(s.seedLuck*100)+'%',
  seedVaultTitle:'Seed vault', seedVaultBtn:'🌰 Seeds',
  seedVaultHint:'Each seed keeps its own properties. Resale price depends ONLY on the seed\'s rarity — never on its properties.',
  seedPickHint:'Click a seed to plant it in the selected pot.',
  vaultEmpty:'No seeds in the vault. Harvest, breed, or buy hybrids at the market.',
  commLock:'other plantation',
  sellFor:p=>'Sell '+p+' 🪙', pickerMatch:'✓ matches the pot',
  fltRarity:'Rarity: all', fltSort:'Sort: none', sortSpeed:'Sort: speed', sortYield:'Sort: flowers', sortSeed:'Sort: 2-seed', sortResist:'Sort: resist', sortWood:'Sort: wood', sortRar:'Sort: rarity',
  resetBtn:()=>'↺ Full reset',
  resetConfirm:()=>'⚠ Click again to confirm — EVERYTHING restarts from zero: plantations, resources, inventory, tools, research, strains, badges. A backup of the old save is kept in this browser.',
  resetDone:()=>'↺ Full reset done — the game starts from scratch!',
  commonSprout:'Common Sprout',
  growth:'Growth', hydration:'Hydration',
  waterHand:'💧 Water by hand (50%)', waterBucket:'🪣 Water (bucket, 100%)', waterAll:'🚿 Water all pots (100%)',
  harvest:'✂ Harvest & grind', harvestDead:'🪵 Collect dead wood', deadWoodNotice:(n,w,sd)=>'🪵 Dead '+n+': <b>'+w+' wood</b>'+(sd?' · <b>1 seed</b>':'')+' — pot free', harvestShears:'✂️ Harvest (shears)', harvestGloves:'🧤 Harvest (gloves)',
  equipTitle:'Active gear', equipHarvest:'Harvest tool — click to switch', equipWater:'Watering gear',
  equipHands:'Bare hands', invMore:'Expand inventory ▾', invLess:'Collapse inventory ▴',
  bookSearchPh:'Search…', fltOwned:'🎒 Owned', fltHide:'Hide ❓', tierAll:'All',
  catAll:'🔨 All', craftSub:'Craft useful items for your garden', craftInfo:'ℹ️ Unlock new recipes in the 🧪 Laboratory!',
  craftOnce:'Craftable once', craftMats:'REQUIRED MATERIALS', craftNone:'No recipe matches these filters.',
  invSub:'All your resources and materials', invInfo:'ℹ️ Collect, explore, grow and craft to earn more resources!', invSoon:'More resources coming soon!',
  invSort:'Name', invCats:{all:'All',ess:'Essentials',cult:'Growing',min:'Minerals',craft:'Craft',spec:'Special'},
  seedsGroup:'Special seeds', invBtn:'🎒 Inventory',
  tipHands:'Standard harvest — normal wood, plant is cut.',
  tipHandWater:'Free at the river — fills the tank to 50% only.',
  tipFertGroup:'Click a fertilizer to use it on the selected plant.',
  tipLocked:'🔒 Locked — click to open the Laboratory and research it.',
  tipCraftable:'🛠 Researched — click to open Crafting on this item.',
  dripToggleOn:'ON — click to pause', dripToggleOff:'PAUSED — click to resume',
  tankLbl:'Tank', refill:'Refill', dripOn:'drip running', dripDry:'tank empty!', roomN:n=>'Room '+n,
  ctrlTitle:'Control desk', ctrlNoGen:'no generator', ctrlNoTank:'no tank', ctrlView:'View', ctrlReady:'ready!', ctrlRename:'Rename room',
  firstWoodToast:'🪵 21 wood — first full-grown harvest always yields 21: enough to craft the Workbench.',
  stFlowers:'Flowers ready', stNext:'Next flower',
  resTitle:'Resources',
  res:{coins:'Coins',px:'Pixels',wood:'Wood',stone:'Stone',metal:'Metal',mineral:'Minerals',seeds:'Seeds',soil:'Soil',compost:'Compost',fert:'Fertilizer',fertPlus:'Enriched fert.'},
  resIc:{coins:'🪙',px:'🟩',wood:'🪵',stone:'🪨',metal:'⚙️',mineral:'💎',seeds:'🌱',soil:'🪴',compost:'🍂',fert:'🧪',fertPlus:'💠'},
  market:'🪙 Market', marketFee:'Selling fee: 33% — you pocket 2/3 of the price. Buying is full price: sell 3 pixels, and the coins buy back only 2.',
  have:'you have', sell:'Sell', buy:'Buy', unit:p=>p+' $ each',
  hybTitle:'Hybrid seeds — consumables, coins only',
  hybNote:'Hybrid varieties are STERILE: no seed back when cut — and none if they die. One planting, big output.',
  hyb:{hybridBloom:'Prismabloom — flowers ×2, growth ×1.15. The pixel machine.',
       hybridTimber:'Lignivora — wood ×2.5 when cut. The timber plant.'},
  plantBtn:'Plant', badgeSterile:'⚗ hybrid · sterile',
  workshop:'Workshop', inventory:'Inventory', book:'🛠️ Crafting', buildBtn:'🏠 Layout',
  catPlant:'🌿 Plants', catBuild:'🏠 Layout',
  cheat:'Cheat code', cheatOk:'✔ 999 of every resource granted.', cheatBad:'Wrong code.',
  workshopHint:'Open the recipe book to craft. Build the Workbench first — it unlocks everything else. Tools and machines land in your inventory; soil and fertilizer are consumed.',
  wsOpen:'Open',
  wsDesc:{book:'Grind flowers into pixels and craft tools, machines and consumables.',
    build:'Pots, rooms and per-pot equipment — expand and outfit your grove.',
    market:'Sell flowers and resources, buy seeds and hybrids for coins.',
    lab:'Research, breeding and the experiment table.',
    almanac:'Your collection: every variety, strain and mutation you have seen.',
    seeds:'Every seed you own — filter, plant, sell.'},
  tierNames:['Tier 0 — basic tools','Tier 1 — stone','Tier 2 — metal','Tier 3 — electricity'],
  craft:'Craft', compress:'Compress', smelt:'Smelt', use:'Use',
  lockedBench:'requires the Workbench', lockedMachine:m=>'requires the '+m,
  owned:'owned', maxed:'max',
  recipes:{
    workbench:{nm:'Workbench',fx:'unlocks all other recipes'},
    bucketWood:{nm:'Wooden bucket',fx:'watering fills to 100% (hand: 50%)'},
    soil:{nm:'Soil',fx:'+25% growth & +25% water tank — used up at EACH planting'},
    compost:{nm:'Compost',fx:'+15% growth for 12h — the cheap fertilizer, single use'},
    fert:{nm:'Fertilizer',fx:'+30% growth for 12h — single use'},
    stone:{nm:'Stone',fx:'compress 25 pixels into 1 stone'},
    shears:{nm:'Cutting shears',fx:'equip to harvest: +40% wood when cutting'},
    shearsUp2:{nm:'Cutting shears — level II',fx:'hardened blades: +75% wood when cutting (instead of 40%). Requires the cutting shears.'},
    gloves:{nm:'Harvest gloves',fx:'equip to harvest: 12% chance to pick the flowers WITHOUT cutting the plant (no wood, no seed — but it keeps blooming)'},
    glovesUp2:{nm:'Harvest gloves — level II',fx:'reinforced gloves: the no-cut chance rises to 25% (instead of 12%). Requires the harvest gloves.'},
    arrosoir:{nm:'Watering can',fx:'one action waters ALL pots to 100%'},
    tank:{nm:'Water tank',fx:'ONE per room: stores 72h of water for the room\'s drip lines — each tank refills separately, free at the river'},
    room:{nm:'New planting zone',fx:'opens a new zone: +3 pot spaces, its own generator and tank. Layout is per plantation.'},
    controlDesk:{nm:'Control desk',fx:'builds the control tower: manage power, water and harvests of every room from one screen (🖥️ button in the room navigator). One per plantation.'},
    breedlab:{nm:'Breeding lab',fx:'cross two seed varieties to create brand-new strains — unique stats every time'},
    drip:{nm:'Drip irrigation',fx:'fits ONE pot (drip N ↔ pot N) — the shared tank drains once per served plant, so 3 drips empty it 3× faster (max 3). Refill the tank by hand'},
    dripPlus:{nm:'Drip — upgrade',fx:'upgrades ONE drip line: its water use −30%. One upgrade per base drip owned (1 drip → 1 upgrade max).'},
    dripElec:{nm:'Drip — electronic upgrade',fx:'upgrades ONE improved line: −50% water AND its pump refills the tank while a generator runs. One per improved drip owned.'},
    pot:{nm:'Clay pot',fx:'a plain clay pot placed on a FREE slot of your choice (6 flowers). Change its material afterwards (ceramic, terracotta, plastic, concrete, self-watering).'},
    potUp:{nm:'Ceramic pot',fx:'on a free slot or an existing pot — glazed ceramic: +1 max flower, holds water a little better (×1.10) — you pick the pot'},
    potBig:{nm:'Big ceramic pot',fx:'+2 max flowers (8 instead of 6), same glaze, larger body. On a free slot, or to widen an existing Ceramic pot.'},
    potTerra:{nm:'Terracotta pot',fx:'breathing clay: growth ×1.15 for dry-loving varieties (Cat, Alien, Flipper), ×1.05 for the others — but water goes 20% faster'},
    potPlastic:{nm:'Plastic pot',fx:'holds humidity: water reserve ×1.25 — dry-loving varieties (Cat, Alien, Flipper) grow 10% slower in it'},
    potConcrete:{nm:'Concrete pot',fx:'thick and cool: water reserve ×1.15, thermal insulation against the seasons (coming later)'},
    potSelfWater:{nm:'Self-watering pot',fx:'a small reservoir under the pot: hydration drops much slower (reserve ×1.40)'},
    furnace:{nm:'Furnace',fx:'smelts stone into metal (chance of minerals)'},
    metal:{nm:'Metal',fx:'5 stone + 5 wood → 1 metal · 10% bonus mineral'},
    bucketMetal:{nm:'Metal bucket',fx:'watering 100% + water tank +10%'},
    fertPlus:{nm:'Enriched fertilizer',fx:'+50% growth 12h + double-seed chance +5% on this plant'},
    fertHuman:{nm:'Graminelle serum',fx:'+40% growth 12h — works ONLY on a Graminelle (Human)'},
    fertZombie:{nm:'Necroflora serum',fx:'+40% growth 12h — works ONLY on a Necroflora (Zombie)'},
    fertAgent:{nm:'Cryptovine serum',fx:'+40% growth 12h — works ONLY on a Cryptovine (Agent)'},
    fertCat:{nm:'Felicaria serum',fx:'+40% growth 12h — works ONLY on a Felicaria (Cat)'},
    fertAlien:{nm:'Xenosprout serum',fx:'+40% growth 12h — works ONLY on a Xenosprout (Alien)'},
    generator:{nm:'Coal generator',fx:'ONE per room: its battery (24h) powers the room\'s lamps and drip pumps — pick any pot of the room. Each generator recharges separately with wood.'},
    genUp2:{nm:'Coal generator — battery II',fx:'upgrades ONE generator: capacity 48h. One per level-1 generator.'},
    genUp3:{nm:'Coal generator — battery III',fx:'upgrades ONE level-II generator: capacity 72h. One per level-II generator.'},
    lampUp2:{nm:'Grow lamp — level II',fx:'upgrades ONE lamp: bigger, growth ×1.45 (instead of ×1.30) — but drinks 1.5 energy/h. One per level-1 lamp.'},
    lampUp3:{nm:'Grow lamp — level III',fx:'upgrades ONE level-II lamp: huge, growth ×1.60 — but drinks 2 energy/h. One per level-II lamp.'},
    lamp:{nm:'Grow lamp',fx:'one lamp per pot: growth ×1.30 for that pot while its generator runs (max 3)'},
  },
  genOn:'RUNNING', genOff:'STOPPED', genStart:'Start', genStop:'Stop',
  rechargeBtn:'⚡ Recharge', genHint:'One coal generator per room, recharged separately: 5 wood per 24h of energy. Lamps drink 1h/h each — switch a pot\'s lamp off to save power.',
  lampBadgeOn:'💡 lamp ON', lampBadgeOff:'🌑 lamp OFF', lampToggleTip:'Click to switch this pot\'s lamp',
  lampBtnOff:'💡 Turn lamp off', lampBtnOn:'🌑 Turn lamp on',
  genLine:n=>'Generators — each burns 5 wood/24h ('+n*5+'/day total). Lamp of pot N needs generator N.',
  genNoWood:'out of wood!',
  uproot:'⛏ Uproot',
  researchBtn:c=>'🔬 Research — '+c+' $', researchNeed:'previous tier required', researchedTag:'researched',
  hiddenNm:'? ? ?', hiddenFx:'Unknown recipe — research this tier with coins, or discover it at the try table below.',
  tryTitle:'🧪 Try table — experiment', tryBtn:'Try',
  tryHint:'Pick ingredients and quantities from your stock. An exact match crafts the item AND reveals its recipe — a failed try costs nothing.',
  tryNone:'— none —', tryFail:'Nothing happens…', tryStock:'Not enough of that in stock to try.',
  tryBench:'Build the Workbench first.', tryNeeds:'Something reacts… but a machine is missing to finish it.',
  tryOwned:'You already own that (or it\'s maxed).',
  trySuccess:nm=>'✨ Discovered & crafted: '+nm+'!',
  labTabTry:'Experiment', tryComponents:'Components', tryTableLbl:'Trial table',
  tryDnDHint:'Drag components onto the + table (clicking a block adds it too). Only the KIND of ingredients matters — not quantities. A right combination reveals the recipe (and crafts it if you have the stock); a failed try costs nothing.',
  tryHintLine:(pct,ing)=>'🧭 Closeness: '+pct+'% — '+ing+' right ingredient'+(ing>1?'s':'')+'.',
  tryAllFound:'Every recipe is already known!',
  tryRevealed:nm=>'📜 Recipe revealed: '+nm+' — gather the materials to craft it!',
  pageLbl:(i,n,nm)=>'Page '+i+'/'+n+' — '+nm,
  pickerTitle:'🌱 Plant what?',
  pickerNormie:n=>'🌱 Normie seed — plant '+n,
  pickerNoSeed:'no seed in stock',
  pickerChange:'🔁 Pick another Normie…',
  introTitle:'🌱 Welcome to PxGrove',
  introBody:'<p><strong>Why does this game exist?</strong> PxGrove is a <strong>playful experiment around NFT APIs</strong>: take the on-chain data of a pixel collection and turn it into something you can actually <em>play</em> with.</p><p>The goals: craft a real <strong>game experience</strong>, encourage NFT projects to include <strong>pixel traits you can play with</strong>, and push beyond simple $$ rewards — with mechanics of <strong>discovery, crafting and breeding</strong>. Plugging in web3 financial features later isn\'t ruled out, but all the energy goes first into one thing: <strong>a fun game you want to come back to, day after day</strong>.</p><p style="color:var(--muted)">This experiment is <strong>not affiliated with any NFT project</strong>. It\'s built by <a href="https://x.com/nftmooods" target="_blank" rel="noopener"><strong>@nftmooods</strong></a> — feel free to send comments or ideas by DM, or drop a little encouragement on X to say what you think!</p>',
  introGo:'Let\'s grow!',
  tuto:{
    next:'Next ▸', skip:'Skip', done:'Let\'s grow! ✓',
    t0:'🌱 Welcome! PxGrove is a <b>BETA</b>: a chance to discover the mechanics, hunt down recipes… and simply have a good time watching your cultures grow. For now your save lives in this browser\'s cache — a login / wallet-connect system may come later.',
    t1:'Here is <b>your pot</b>, with your plant inside — it has already started growing!',
    t2:'<b>Double-click the plant</b> to water it. Come back from time to time: without water, your plant will die of thirst.',
    t3:'Once the plant is mature and full of flowers, <b>double-clicking it harvests</b>: you collect the flowers and the wood, and flowers grind into <b>pixels</b> — the resource that crafts your upgrades.',
    tw:'The <b>Workshop</b>: this panel gathers everything you can open — Crafting, Layout, the Market, the Laboratory, the Almanac and your Seeds. Let\'s look at the two main ones.',
    t4:'The <b>Laboratory</b>: run research first — then the crafting tables (Crafting / Layout) fill up with recipes you can build.',
    t5:'<b>Crafting</b>: grind your flowers into pixels, collect wood, and build tools, machines and rooms — every unlocked recipe opens new possibilities.',
    w0:'First harvest! Your flowers were ground into <b>pixels</b> and you picked up <b>wood</b> — your resources live up here.',
    w1:'Time to build the <b>Workbench</b>: 20 wood. It unlocks every other recipe in the game.',
    w2:'Press <b>Craft</b> as soon as you have the wood — then harvest again: every cycle funds the next machine. 🌱',
    t6:'Up here: every day three <b>quests</b> (🗓️) await you, and your feats fill the <b>Badges</b> (🏅) — they will unlock rewards in the final version. Thanks for trying PxGrove… have a great game! 🌱',
    w0b:'Double-clicking a plant full of flowers harvests it. From <b>80% growth</b>, once the first flowers are out, you can already harvest — but the plant gives <b>fewer resources</b>. At <b>100% with every flower</b>, the yield is at its best.',
    g0:'<b>80% grown!</b> Remember: <b>double-click the pot</b> to water the plant at any moment of its growth.',
    g1:'The same double-click <b>harvests</b> — but <b>only at 100% growth with every flower out</b>. Until then it just waters.',
    h0:'<b>Second harvest: 2 seeds!</b> From now on you can also plant <b>straight in the ground</b>: click a <b>free slot</b> (dotted footprint) and pick a seed — no pot needed.',
    h1:'A plant in the ground gives <b>2 flowers max</b> plus its wood, and is <b>more fragile</b>: it dries faster and will be exposed to weather and events. Pots protect — the ground is free.',
    e0:'Your first tool! It lives <b>here, on the left of the stage</b>. This slot opens the group it belongs to.',
    e1:'Click the tool to <b>equip</b> it — the highlighted slot is the one in use.',
    e2:'Once equipped it stays <b>active permanently</b>: no need to select it again before each harvest or watering.',
    f0:'Your first fertilizer! Your boosters live <b>here, on the left of the stage</b>. This slot opens the group.',
    f1:'Click a fertilizer to <b>apply it to the selected plant</b> — it is consumed, and the bonus starts right away.',
    f2:'The active bonus shows <b>here, under the plant name</b>: its icon, its effect and the time left.'
  },
  notifBody:(nm,i)=>'💧 Your '+nm+' (pot '+(i+1)+') is down to 10% hydration — water it before it withers!',
  notifDry:(nm,i)=>'🥀 Your '+nm+' (pot '+(i+1)+') is bone dry — growth has stopped, it dies in 24h without water!',
  researchTitle:'🔬 Research', researchMenuHint:'unlock in the 🧪 Laboratory',
  labTitle:'Laboratory', labTabResearch:'Research', labTabBreed:'Breeding',
  tierLockHint:'research every block of the previous tier first',
  blocks:{b_stone:{nm:'Stonework'},b_heat:{nm:'Furnace & heat'},b_harv1:{nm:'Harvest I'},
    b_metal:{nm:'Metallurgy'},b_serum:{nm:'Serums'},b_water:{nm:'Watering'},b_harv2:{nm:'Harvest II'},
    b_energy:{nm:'Energy'},b_breed:{nm:'Genetics'},b_build:{nm:'Construction'},b_irrig:{nm:'Irrigation'},b_light:{nm:'Grow lights'}},
  almanacTitle:'📗 Almanac', almProgress:'Collection', almHarvests:'Harvests', almBest:'Best harvest', almLost:'Plants lost',
  muts:{none:'common form',gold:'Golden foliage',twist:'Twisted stem',double:'Double bloom',glow:'Night glow'},
  mutIc:{none:'🌿',gold:'✨',twist:'🌀',double:'🌸',glow:'🌟'},
  questsTitle:'Daily quests',
  quests:{water3:'Water 3 times',harvest1:'Harvest a plant',grind100:'Grind 100 pixels',craft2:'Craft 2 items',try1:'Attempt 1 experiment',fert1:'Use a fertilizer',sell1:'Sell at the market',plant1:'Plant a seed'},
  questAllHint:'Complete all 3 → +1 seed 🌱',
  questAllDone:'✅ All done — bonus seed earned!',
  streakLbl:(n,j)=>n+' day streak · '+j+' joker',
  streakNone:j=>'no streak yet · '+j+' joker',
  journalTitle:'Journal', tabGarden:'Garden',
  jlDay:d=>'Day '+d,
  jl:{planted:v=>'planted 🌱'+(v?' — '+v:''),leaf:()=>'first leaves unfurled',bloom:()=>'started blooming ✿',saved:()=>'rescued from wilting 💧',died:()=>'died of thirst 💀',harvest:px=>'harvested — '+px+' px',gentle:px=>'gently picked — '+px+' px 🧤',mutation:m=>'a mutation appeared!',named:v=>'its pot was named “'+v+'”'},
  toDiscover:n=>n+' recipe'+(n>1?'s':'')+' still to discover — research the tier or use the try table.',
  invEmpty:'Nothing crafted yet.',
  rBase:'starting knowledge', rDone:'✓ researched', rLocked:'🔒 requires the previous tier',
  rBaseNm:'Basic tools', rGoBtn:'Research', rFootPts:'coins available for research',
  rFootHint:'Unlock the tiers in order — every block of a tier opens the next one.',
  badgesTitle:'Badges', badgeUnlocked:'Badge unlocked', badgeLocked:'not earned yet', questsBtn:'Quests',
  mlTime:'Speed', mlLang:'Language', mlInfo:'Info',
  potPickTitle:nm=>'Install: '+nm+' — pick a pot', potN:n=>'Pot '+n,
  slotPickTitle:nm=>'Place: '+nm+' — pick a slot', matPickOk:'click to change this pot to that material', slotN:n=>'Slot '+n, slotEmpty:'free slot', slotPickOk:'click to place the pot here', slotPickTaken:'a pot already stands here',
  zonePickTitle:nm=>'Install: '+nm+' — pick a zone', zonePickOk:'click to install in this zone', zoneGenLvl:l=>'generator lvl '+l, zoneLbl:'Zone',
  potEmpty:'empty pot', plotEmpty:'bare plot', plotDefault:n=>'Plot '+n, groundMade:n=>'🟫 Plot '+n+' in the ground — pick a seed',
  pcLockedTitle:'Locked', pcLockedSub:'Upgrade your garden', pcEmptyTitle:'Empty', pcEmptySub:'Choose a seed',
  pcUnlockFreeQ:'Unlock this plot?', pcUnlockCostQ:cost=>'Unlock this plot for '+cost+'?', pcUnlockFree:'Unlock — free', pcUnlockCost:cost=>'Unlock — '+cost,
  pcNoRes:'Not enough resources to unlock this plot.',
  pcUnlockTitle:'Unlock the plot', pcUnlockTxt:'Unlock this plot to grow your garden.', pcReqLbl:'REQUIRED RESOURCES', pcUnlockFreeBtn:'Unlock for free', pcUnlockBtn:'Unlock the plot',
  secondSeedToast:'🌰 2nd harvest: guaranteed 2nd seed — plant it in the ground!', potPickOk:'click to install here', potPickNo:'not a valid target for this device',
  potPickRepl:'♻ will REPLACE the current device — half its materials come back to your inventory',
  potPickConfirm:'⚠ Click again to confirm: the old device is recycled (50% of materials) and the new one installed.',
  badges:{
    firstHarvest:{nm:'First harvest',fx:'Harvest your first plant.'},
    waters100:{nm:'Green thumb',fx:'Water 100 times.'},
    wood500:{nm:'Lumberjack',fx:'Collect 500 wood in total.'},
    machines:{nm:'Industrialist',fx:'Own the Workbench, the Furnace and a Generator.'},
    research3:{nm:'Scholar',fx:'Research all 3 tiers.'},
    discover5:{nm:'Mad scientist',fx:'Discover 5 recipes at the try table.'},
    mutation1:{nm:'Lucky sprout',fx:'Witness your first mutation.'},
    almanacRow:{nm:'Completionist',fx:'Complete a full almanac row (all 5 forms of one variety).'},
    varieties5:{nm:'Botanist',fx:'Grow 5 different varieties.'},
    firstSell:{nm:'Merchant',fx:'Make your first market sale.'},
    coins1000:{nm:'Tycoon',fx:'Earn 1000 $ in total at the market.'},
    hybridCut:{nm:'Alchemist',fx:'Harvest a hybrid plant.'},
    streak7:{nm:'Devoted gardener',fx:'Hold a 7-day quest streak.'},
    perfectDay:{nm:'Perfect day',fx:'Finish all 3 daily quests in one day.'},
    gardenFull:{nm:'Full house',fx:'3 pots, 3 living plants at the same time.'},
  },
  soilNext:n=>'Next planting will use 1 soil ('+n+' in stock).',
  soilNone:'No soil in stock — next planting in plain dirt.',
  noSeed:'No seed available — harvest a plant first.',
  noFreePot:'All pots are busy — harvest a plant first.',
  potLbl:(i,n)=>'Pot '+(i+1)+'/'+n, potDefault:n=>'Pot '+n, seedDefault:n=>'Seed '+n,
  emptyTitle:'Empty pot', emptyNotice:'This pot is empty — <b>Replant</b> a seed here.',
  badgeSoil:'🪴 soil applied', badgeFert:t=>'🧪 fertilizer '+t+' left', badgeFertPlus:t=>'💠 enriched fert. '+t+' left',
  badgeFertX:(ic,pct,t)=>ic+' +'+pct+'% growth \u00b7 '+t+' left',
  info:{title:'ℹ️ How it works', hint:'Tap a feature to read what it does.', items:{
    plant:{nm:'🌱 Planting',tx:'Enter a Normie or Hoodie number: its type sets the plant variety (growth speed, flower richness) and its pixel count sets its size. No token? Plant a Common Sprout — slower, fewer flowers.'},
    water:{nm:'💧 Watering & hydration',tx:'A base plant goes from full to dry in 8 h — and whatever speeds its growth (variety, soil, fertilizer) dries it just as much faster; a lamp dries it even more (down to 6 h on a base plant). Water by hand (50%), or better with a bucket / watering can. Double-click a pot to water it. At 10% you get a warning, at 0% the plant dies.'},
    grow:{nm:'🌼 Growth & flowers',tx:'Growth runs on real time (24 h base for a common seed, 18–19 h for the fastest varieties). Flowers bloom as the plant grows, up to the pot\'s flower cap.'},
    harvest:{nm:'✂ Harvest & grind',tx:'When the pot is full of flowers (double-click works then), harvest: flowers are ground into pixels, the plant is cut and gives wood and a seed. Gloves can pick without cutting.'},
    workbench:{nm:'🧰 Workbench & crafting',tx:'Craft the Workbench first (20 wood — your first full-grown harvest always yields 21). It unlocks the recipe book: tools, machines, consumables. Click a resource to open the book filtered on it.'},
    layout:{nm:'🏠 Layout',tx:'Build pots and choose each pot\'s material — clay, ceramic (+1 flower), big ceramic (+2), terracotta (faster growth for dry lovers, dries faster), plastic (holds water), concrete (insulated), self-watering (reserve ×1.40) — plus extra rooms (+3 pots each) and the Control desk. Layout is per plantation.'},
    market:{nm:'🪙 Market',tx:'Sell pixels and seeds for coins, buy what you lack. Prices are listed in the Market window.'},
    lab:{nm:'🧪 Laboratory',tx:'Spend coins on research blocks, tier by tier. Each block unlocks new recipes. The tree shows what is done, available or locked.'},
    almanac:{nm:'📗 Almanac',tx:'Your records: harvests, best yields, discovered varieties and mutations.'},
    seeds:{nm:'🌰 Seed vault',tx:'Every seed you own, by variety and strain. Filter, then plant, sell or destroy. Replant opens the same vault in pick mode.'},
    fert:{nm:'🧫 Fertilizers & serums',tx:'Compost +15%, fertilizer +30%, enriched +50% growth for 12 h (enriched also gives +5% double-seed chance until harvest). Serums give +40% but only on their own variety. The badge on the plant card shows the active one.'},
    soil:{nm:'🪴 Soil',tx:'Craft soil to plant in it: +25% growth for the whole life of the plant. It is consumed at planting.'},
    lamp:{nm:'💡 Lamps & generators',tx:'A lamp on a pot speeds growth (+30/45/60% by level) but drinks energy. One coal generator per room powers it — recharge each room separately with wood.'},
    tank:{nm:'🛢️ Water tank & drip',tx:'One tank per room feeds the drip system on its pots so you water less by hand. Refill each room\'s tank separately.'},
    tools:{nm:'🪣 Tools',tx:'Bucket and watering can water more per action; shears give more wood (2 levels: +40% / +75%); gloves (2 levels: 12% / 25%) may pick flowers without cutting. Active gear is shown on the left of the stage.'},
    rooms:{nm:'🏠 Rooms',tx:'The stage shows one room of 3 pots. Switch rooms with the 🏠 buttons on the right; a red ! means something needs you there (thirsty or dead plant, lamp without power).'},
    desk:{nm:'🖥️ Control desk',tx:'An expensive Layout build. Opens a control-tower view: energy, water and harvest state of every room on one screen, with recharge / refill / rename buttons.'},
    quests:{nm:'🗓️ Quests & badges',tx:'Daily quests reward coins and resources; badges record milestones. Both live in the top bar.'},
    hybrid:{nm:'🧬 Hybrids & strains',tx:'The try table lets you cross two seeds into a strain with mixed stats. Strains live in the seed vault and improve with harvests.'},
    time:{nm:'⏱️ Speed & language',tx:'The ⚙️ menu switches real time / fast ×720 (for testing) and English / French.'},
    save:{nm:'💾 Saving',tx:'Progress is saved automatically in this browser only. Clearing site data erases it.'}
  }},
  badgeLuck:'💠 +5% double seed \u00b7 until harvest', badgeLamp:'💡 lamp on this pot',
  phases:{seed:'seed',germ:'germination',young:'young sprout',mature:'mature',bloom:'blooming',wither:'withered!',dead:'dead',cut:'harvested'},
  thirst:'· DYING OF THIRST', waterIt:'· water it!',
  growthLeft:t=>'growth: '+t+' left', grown:'fully grown', deadClock:'plant dead',
  cutClock:'plant harvested — replant a seed',
  driesIn:t=>' · dries out in '+t, diesIn:t=>' · DIES in '+t,
  grindFirst:'harvest first',
  deathNotice:(n,st)=>'💀 Your '+n+' died of thirst. <b>Collect the dead wood</b> to clear the pot — you salvage <b>1/3 of the wood</b>'+(st?' (no seed: hybrids are sterile)':' and recover <b>the seed</b>')+'.',
  cutShort:'✂ Harvested — <b>replant</b> a seed when ready.',
  cutNotice:(n,px,wood,seeds,dbl)=>'✂ Your '+n+' was cut: <b>'+px+' pixels</b> ground, <b>'+wood+' wood</b> collected'+(seeds===0?' — <b>no seed</b>: hybrid varieties are sterile.':(dbl?' and <b>DOUBLE SEED</b> — 2 seeds recovered!':' and 1 seed recovered.'))+' <b>Replant</b> when ready.',
  gentleNotice:(n,px)=>'🧤 Gentle harvest! <b>'+px+' pixels</b> ground and your '+n+' was <b>NOT cut</b> — it keeps blooming.',
  errNum:'Invalid number — a Normie has a number between 0 and 9999.',
  searching:'Searching via the API…',
  apiDown:'API unreachable from this page — use the manual import below.',
  errJson:'Unreadable JSON — paste the entire metadata page content (braces included).',
  units:{d:'d',h:'h',m:'min',s:'s'},
  footer:'PxGrove — MVP Step 1 (discovery mode, no wallet). Loop: plant → water → flowers → harvest (cuts the plant) → grind & craft → replant.<br>Normie data: snapshot at planting time, via <a href="https://api.normies.art" target="_blank" rel="noopener">api.normies.art</a> (embedded sample + manual import). Progress is saved locally in this browser only.',
},
fr:{
  sub:'màj '+BUILD_STAMP, real:'Temps réel', fast:'Accéléré ×720',
  plantTitle:'Plante ton Normie',
  plantTitleC:tok=>'Plante ton '+tok,
  commLbl:'Collection NFT',
  plantP1C:(tok,mx)=>'Entre le numéro de ton '+tok+' (<strong>0 à '+mx+'</strong>). Son <strong>Type</strong> décide de la variété de ta plante, son <strong>Pixel Count</strong> décide de sa taille et de sa production de fleurs — figés au moment de la plantation.',
  randomHintC:(n,tok,host)=>'« Au hasard » pioche dans l\'échantillon embarqué ('+n+' '+tok+'s vérifiés via '+host+').',
  varTitleC:n=>n+' types → '+n+' variétés',
  switchTok:tok=>'Changer de '+tok,
  errNumC:mx=>'Numéro invalide — entre un numéro entre 0 et '+mx+'.',
  plantP1:'Entre le numéro de ton Normie (<strong>0 à 9999</strong>). Son <strong>Type</strong> décide de la variété de ta plante, son <strong>Pixel Count</strong> décide de sa taille et de sa production de fleurs — figés au moment de la plantation.',
  idPh:'n° 0-9999', find:'Chercher', random:'Au hasard',
  randomHint:'« Au hasard » pioche dans l\'échantillon embarqué (42 Normies vérifiés via api.normies.art le 30/08/2026).',
  manualP1:'<strong>Ce Normie n\'est pas dans l\'échantillon embarqué.</strong> Récupère ses vraies données en 2 clics :',
  manualP2a:'1. Ouvre ', manualP2b:' (nouvel onglet)<br>2. Copie tout le contenu de la page et colle-le ici :',
  importBtn:'Importer', noNormie:'Pas de Normie sous la main ?', noTokC:tok=>'Pas de '+tok+' sous la main ?', genericBtn:'Planter une pousse commune',
  genericHint:'⚠ La pousse commune est plus faible que les variétés de collection : ~26 h de pousse (au lieu de 24-18 h), 2 fleurs max (au lieu de 6+) et 50 % du bois des plus modestes graines des autres projets. De quoi jouer — mais détenir un token paie vraiment.',
  back:'← Retour au jardin',
  varTitle:'5 types → 5 variétés',
  varHint:'Vitesse = temps de pousse · Fleurs = richesse en pixels des fleurs. Plus le type est rare, plus la variété est généreuse.',
  varLine:(t,v)=>t+' · vitesse ×'+v.speed.toFixed(2)+' · fleurs ×'+v.yield.toFixed(2)+' · 2 graines '+Math.round(v.seedLuck*100)+' %',
  rar:{common:'commun',widespread:'répandu',rare:'rare',veryRare:'très rare',noNormie:'sans Normie',hybrid:'hybride',uncommon:'peu commun',epic:'épique',legendary:'légendaire'},
  breedTitle:'Labo de croisement', breedBtn:'🧬 Croiser', breedBtn10:'🧬 Croiser ×10', breedParentA:'Parent A', breedParentB:'Parent B',
  breedBatchMsg:(ok,fail,names)=>'Série : '+ok+' réussite'+(ok>1?'s':'')+' · '+fail+' échec'+(fail>1?'s':'')+(names.length?(' — '+names.slice(0,4).join(', ')+(names.length>4?'…':'')):''),
  breedHint:'Croise deux variétés : chaque stat est héritée d\'un parent puis mute légèrement. Pars à la chasse aux graines rares, rapides ou résistantes — chaque croisement est unique.',
  breedCost:(fee,pct)=>'Coût : 1 graine de chaque parent + '+fee+' 🪙 · réussite '+pct+' %',
  breedNeedLab:'Il faut d\'abord fabriquer le Labo de croisement (palier 2, atelier).',
  breedPick:'Choisis deux parents.', breedNoSeeds:'Pas assez de graines des parents choisis.', breedNoCoins:'Pas assez de pièces.',
  breedFail:'Le croisement a échoué… les graines sont perdues. Retente !',
  breedOk:(nm,rar)=>'✨ Nouvelle souche : '+nm+' ('+rar+') — 1 graine ajoutée. Plante-la depuis le carnet ou le choix de graine.',
  strainsTitle:'Souches créées', strainParents:(a,b)=>a+' × '+b,
  strainLine:s=>'vitesse ×'+s.speed.toFixed(2)+' · fleurs ×'+s.yield.toFixed(2)+' · bois ×'+s.woodMult.toFixed(2)+' · résist ×'+s.hydMult.toFixed(2)+' · 2 graines '+Math.round(s.seedLuck*100)+' %',
  seedVaultTitle:'Coffre à graines', seedVaultBtn:'🌰 Graines',
  seedVaultHint:'Chaque graine garde ses propres propriétés. Le prix de revente dépend UNIQUEMENT de la rareté de la graine — jamais de ses propriétés.',
  seedPickHint:'Clique une graine pour la planter dans le pot sélectionné.',
  vaultEmpty:'Aucune graine dans le coffre. Récolte, croise, ou achète des hybrides au marché.',
  commLock:'autre plantation',
  sellFor:p=>'Vendre '+p+' 🪙', pickerMatch:'✓ assorti au pot',
  fltRarity:'Rareté : toutes', fltSort:'Tri : aucun', sortSpeed:'Tri : vitesse', sortYield:'Tri : fleurs', sortSeed:'Tri : 2 graines', sortResist:'Tri : résistance', sortWood:'Tri : bois', sortRar:'Tri : rareté',
  resetBtn:()=>'↺ Reset complet',
  resetConfirm:()=>'⚠ Reclique pour confirmer — TOUT repart de zéro : plantations, ressources, inventaire, outils, recherches, souches, badges. Une copie de l\'ancienne sauvegarde est gardée dans ce navigateur.',
  resetDone:()=>'↺ Reset complet effectué — le jeu repart de rien !',
  commonSprout:'Pousse commune',
  growth:'Croissance', hydration:'Hydratation',
  waterHand:'💧 Arroser à la main (50 %)', waterBucket:'🪣 Arroser (seau, 100 %)', waterAll:'🚿 Arroser tous les pots (100 %)',
  harvest:'✂ Récolter et broyer', harvestDead:'🪵 Récolter le bois mort', deadWoodNotice:(n,w,sd)=>'🪵 '+n+' morte : <b>'+w+' bois</b>'+(sd?' · <b>1 graine</b>':'')+' — pot libre', harvestShears:'✂️ Récolter (pince)', harvestGloves:'🧤 Récolter (gants)',
  equipTitle:'Équipement actif', equipHarvest:'Outil de récolte — clique pour changer', equipWater:'Matériel d\'arrosage',
  equipHands:'Mains nues', invMore:'Étendre l\'inventaire ▾', invLess:'Replier l\'inventaire ▴',
  bookSearchPh:'Rechercher…', fltOwned:'🎒 Possédés', fltHide:'Masquer ❓', tierAll:'Tout',
  catAll:'🔨 Tous', craftSub:'Créez des objets utiles pour votre jardin', craftInfo:'ℹ️ Débloquez de nouvelles recettes dans le 🧪 Laboratoire !',
  craftOnce:'Fabricable une seule fois', craftMats:'MATÉRIAUX REQUIS', craftNone:'Aucune recette ne correspond à ces filtres.',
  invSub:'Toutes vos ressources et matériaux', invInfo:'ℹ️ Collectez, explorez, cultivez et craftez pour obtenir plus de ressources !', invSoon:'Bientôt d\'autres ressources !',
  invSort:'Nom', invCats:{all:'Toutes',ess:'Essentielles',cult:'Culture',min:'Minéraux',craft:'Craft',spec:'Spéciales'},
  seedsGroup:'Graines spéciales', invBtn:'🎒 Inventaire',
  tipHands:'Récolte standard — bois normal, la plante est coupée.',
  tipHandWater:'Gratuit à la rivière — ne remplit le réservoir qu\'à 50 %.',
  tipFertGroup:'Clique un engrais pour l\'utiliser sur la plante sélectionnée.',
  tipLocked:'🔒 Verrouillé — clique pour ouvrir le Laboratoire et le rechercher.',
  tipCraftable:'🛠 Recherché — clique pour ouvrir la Fabrication sur cet objet.',
  dripToggleOn:'ACTIF — clique pour mettre en pause', dripToggleOff:'EN PAUSE — clique pour relancer',
  tankLbl:'Réservoir', refill:'Remplir', dripOn:'goutte-à-goutte actif', dripDry:'réservoir vide !', roomN:n=>'Salle '+n,
  ctrlTitle:'Bureau de contrôle', ctrlNoGen:'aucun générateur', ctrlNoTank:'aucun réservoir', ctrlView:'Voir', ctrlReady:'à récolter !', ctrlRename:'Renommer la salle',
  firstWoodToast:'🪵 21 bois — la 1ère récolte à maturité donne toujours 21 bois : de quoi fabriquer l\'Établi.',
  stFlowers:'Fleurs prêtes', stNext:'Prochaine fleur',
  resTitle:'Ressources',
  res:{coins:'Pièces',px:'Pixels',wood:'Bois',stone:'Cailloux',metal:'Métal',mineral:'Minéraux',seeds:'Graines',soil:'Terreau',compost:'Compost',fert:'Engrais',fertPlus:'Engrais enrichi'},
  resIc:{coins:'🪙',px:'🟩',wood:'🪵',stone:'🪨',metal:'⚙️',mineral:'💎',seeds:'🌱',soil:'🪴',compost:'🍂',fert:'🧪',fertPlus:'💠'},
  market:'🪙 Marché', marketFee:'Frais de vente : 33 % — tu empoches 2/3 du prix. L\'achat est plein tarif : vends 3 pixels, et les pièces n\'en rachètent que 2.',
  have:'en stock', sell:'Vendre', buy:'Acheter', unit:p=>p+' $ pièce',
  hybTitle:'Graines hybrides — consommables, en pièces uniquement',
  hybNote:'Les variétés hybrides sont STÉRILES : aucune graine à la coupe — ni à la mort. Une plantation, gros rendement.',
  hyb:{hybridBloom:'Prismabloom — fleurs ×2, pousse ×1,15. La machine à pixels.',
       hybridTimber:'Lignivora — bois ×2,5 à la coupe. La plante à bois.'},
  plantBtn:'Planter', badgeSterile:'⚗ hybride · stérile',
  workshop:'Atelier', inventory:'Inventaire', book:'🛠️ Fabrication', buildBtn:'🏠 Aménagement',
  catPlant:'🌿 Plantes', catBuild:'🏠 Aménagement',
  cheat:'Cheat code', cheatOk:'✔ 999 de chaque ressource ajoutés.', cheatBad:'Mauvais code.',
  workshopHint:'Ouvre le carnet de recettes pour fabriquer. L\'Établi d\'abord — il débloque tout le reste. Outils et machines arrivent dans ton inventaire ; terreau et engrais se consomment.',
  wsOpen:'Ouvrir',
  wsDesc:{book:'Broie les fleurs en pixels et fabrique outils, machines et consommables.',
    build:'Pots, salles et équipements par pot — agrandis et équipe ta serre.',
    market:'Vends fleurs et ressources, achète graines et hybrides contre des pièces.',
    lab:'Recherches, croisements et table d\'expérience.',
    almanac:'Ta collection : toutes les variétés, souches et mutations déjà vues.',
    seeds:'Toutes tes graines — filtrer, planter, vendre.'},
  tierNames:['Palier 0 — outils de base','Palier 1 — pierre','Palier 2 — métal','Palier 3 — électricité'],
  craft:'Fabriquer', compress:'Compresser', smelt:'Fondre', use:'Utiliser',
  lockedBench:'nécessite l\'Établi', lockedMachine:m=>'nécessite le '+m,
  owned:'possédé', maxed:'max',
  recipes:{
    workbench:{nm:'Établi',fx:'débloque toutes les autres recettes'},
    bucketWood:{nm:'Seau en bois',fx:'l\'arrosage remplit à 100 % (main : 50 %)'},
    soil:{nm:'Terreau',fx:'+25 % pousse & +25 % réservoir — consommé à CHAQUE plantation'},
    compost:{nm:'Compost',fx:'+15 % pousse pendant 12 h — l\'engrais pas cher, usage unique'},
    fert:{nm:'Engrais',fx:'+30 % pousse pendant 12 h — usage unique'},
    stone:{nm:'Caillou',fx:'compresse 25 pixels en 1 caillou'},
    shears:{nm:'Pince de coupe',fx:'à équiper pour récolter : +40\x20% de bois à la coupe'},
    shearsUp2:{nm:'Pince de coupe — niveau II',fx:'lames trempées : +75\x20% de bois à la coupe (au lieu de 40\x20%). Nécessite la pince de coupe.'},
    gloves:{nm:'Gants de récolte',fx:'à équiper pour récolter : 12 % de chance de cueillir les fleurs SANS couper la plante (ni bois ni graine — mais elle continue de fleurir)'},
    glovesUp2:{nm:'Gants de récolte — niveau II',fx:'gants renforcés : la chance de ne pas couper passe à 25 % (au lieu de 12 %). Nécessite les gants de récolte.'},
    arrosoir:{nm:'Arrosoir',fx:'une seule action arrose TOUS les pots à 100 %'},
    tank:{nm:'Réservoir d\'eau',fx:'UN par salle : stocke 72 h d\'eau pour les goutte-à-goutte de la salle — chaque réservoir se remplit séparément, gratuit à la rivière'},
    room:{nm:'Nouvelle zone de plantation',fx:'ouvre une nouvelle zone : +3 emplacements de pots, son propre générateur et son réservoir. L\'aménagement est propre à chaque plantation.'},
    controlDesk:{nm:'Bureau de contrôle',fx:'construit la tour de contrôle : gère l\'électricité, l\'eau et les récoltes de toutes les salles depuis un seul écran (bouton 🖥️ dans la navigation des salles). Un par plantation.'},
    breedlab:{nm:'Labo de croisement',fx:'croise deux variétés de graines pour créer des souches inédites — stats uniques à chaque fois'},
    drip:{nm:'Goutte-à-goutte',fx:'équipe UN pot (goutte-à-goutte N ↔ pot N) — le réservoir partagé se vide une fois par plante servie : 3 systèmes le vident 3× plus vite (max 3). Remplissage manuel du réservoir'},
    dripPlus:{nm:'Goutte-à-goutte — amélioration',fx:'améliore UNE ligne de goutte-à-goutte : sa consommation d\'eau −30 %. Une amélioration par goutte-à-goutte de base possédé (1 goutte-à-goutte → 1 amélioration max).'},
    dripElec:{nm:'Goutte-à-goutte — amélioration électronique',fx:'améliore UNE ligne déjà améliorée : −50 % d\'eau ET sa pompe remplit le réservoir tant qu\'un générateur tourne. Une par goutte-à-goutte amélioré possédé.'},
    pot:{nm:'Pot en argile',fx:'un pot en argile posé sur un emplacement LIBRE de ton choix (6 fleurs). Change ensuite sa matière (céramique, terre cuite, plastique, béton, auto-arrosant).'},
    potUp:{nm:'Pot en céramique',fx:'sur un emplacement libre ou un pot existant — céramique émaillée : +1 fleur max, retient un peu mieux l\'eau (×1.10) — tu choisis le pot'},
    potBig:{nm:'Grand pot en céramique',fx:'+2 fleurs max (8 au lieu de 6), même émail, corps plus large. Sur un emplacement libre, ou pour élargir un pot en céramique existant.'},
    potTerra:{nm:'Pot en terre cuite',fx:'argile qui respire : pousse ×1.15 pour les variétés qui aiment le sec (Cat, Alien, Flipper), ×1.05 pour les autres — mais l\'eau part 20\x20% plus vite'},
    potPlastic:{nm:'Pot en plastique',fx:'retient l\'humidité : réserve d\'eau ×1.25 — les variétés qui aiment le sec (Cat, Alien, Flipper) y poussent 10\x20% moins vite'},
    potConcrete:{nm:'Pot en béton',fx:'épais et frais : réserve d\'eau ×1.15, isolation thermique contre les saisons (à venir)'},
    potSelfWater:{nm:'Pot auto-arrosant',fx:'une petite réserve d\'eau sous le pot : l\'hydratation baisse bien plus lentement (réserve ×1.40)'},
    furnace:{nm:'Four',fx:'fond les cailloux en métal (chance de minéraux)'},
    metal:{nm:'Métal',fx:'5 cailloux + 5 bois → 1 métal · 10 % minéral bonus'},
    bucketMetal:{nm:'Seau en métal',fx:'arrosage 100 % + réservoir +10 %'},
    fertPlus:{nm:'Engrais enrichi',fx:'+50 % pousse 12 h + chance double graine +5 % sur cette plante'},
    fertHuman:{nm:'Sérum Graminelle',fx:'+40 % pousse 12 h — fonctionne UNIQUEMENT sur une Graminelle (Human)'},
    fertZombie:{nm:'Sérum Necroflora',fx:'+40 % pousse 12 h — fonctionne UNIQUEMENT sur une Necroflora (Zombie)'},
    fertAgent:{nm:'Sérum Cryptovine',fx:'+40 % pousse 12 h — fonctionne UNIQUEMENT sur une Cryptovine (Agent)'},
    fertCat:{nm:'Sérum Felicaria',fx:'+40 % pousse 12 h — fonctionne UNIQUEMENT sur une Felicaria (Cat)'},
    fertAlien:{nm:'Sérum Xenosprout',fx:'+40 % pousse 12 h — fonctionne UNIQUEMENT sur une Xenosprout (Alien)'},
    generator:{nm:'Générateur à charbon',fx:'UN par salle : sa batterie (24 h) alimente les lampes et pompes de la salle — choisis n\'importe quel pot de la salle. Chaque générateur se recharge séparément au bois.'},
    genUp2:{nm:'Générateur à charbon — batterie II',fx:'améliore UN générateur : capacité 48 h. Un par générateur niveau 1.'},
    genUp3:{nm:'Générateur à charbon — batterie III',fx:'améliore UN générateur niveau II : capacité 72 h. Un par générateur niveau II.'},
    lampUp2:{nm:'Lampe de pousse — niveau II',fx:'améliore UNE lampe : plus grande, pousse ×1,45 (au lieu de ×1,30) — mais boit 1,5 énergie/h. Une par lampe niveau 1.'},
    lampUp3:{nm:'Lampe de pousse — niveau III',fx:'améliore UNE lampe niveau II : immense, pousse ×1,60 — mais boit 2 énergie/h. Une par lampe niveau II.'},
    lamp:{nm:'Lampe horticole',fx:'une lampe par pot : pousse ×1,30 pour ce pot quand SON générateur tourne (max 3)'},
  },
  genOn:'EN MARCHE', genOff:'ARRÊTÉ', genStart:'Démarrer', genStop:'Arrêter',
  rechargeBtn:'⚡ Recharger', genHint:'Un générateur à charbon par salle, rechargé séparément : 5 bois par 24 h d\'énergie. Chaque ampoule boit 1 h/h — éteins la lampe d\'un pot pour économiser.',
  lampBadgeOn:'💡 lampe ON', lampBadgeOff:'🌑 lampe OFF', lampToggleTip:'Clique pour allumer/éteindre la lampe de ce pot',
  lampBtnOff:'💡 Éteindre la lampe', lampBtnOn:'🌑 Allumer la lampe',
  genLine:n=>'Générateurs — chacun brûle 5 bois/24 h ('+n*5+'/jour au total). La lampe du pot N exige le générateur N.',
  genNoWood:'plus de bois !',
  uproot:'⛏ Déraciner',
  researchBtn:c=>'🔬 Rechercher — '+c+' $', researchNeed:'palier précédent requis', researchedTag:'recherché',
  hiddenNm:'? ? ?', hiddenFx:'Recette inconnue — recherche ce palier avec des pièces, ou découvre-la à la table d\'essai ci-dessous.',
  tryTitle:'🧪 Table d\'essai — expérimente', tryBtn:'Essayer',
  tryHint:'Choisis des ingrédients et des quantités depuis ton stock. Une combinaison exacte fabrique l\'objet ET révèle sa recette — un essai raté ne coûte rien.',
  tryNone:'— aucun —', tryFail:'Rien ne se passe…', tryStock:'Stock insuffisant pour tenter ça.',
  tryBench:'Fabrique d\'abord l\'Établi.', tryNeeds:'Quelque chose réagit… mais il manque une machine pour finir.',
  tryOwned:'Tu le possèdes déjà (ou c\'est au max).',
  trySuccess:nm=>'✨ Découvert et fabriqué : '+nm+' !',
  labTabTry:'Expérience', tryComponents:'Composants', tryTableLbl:'Table d\'essai',
  tryDnDHint:'Glisse des composants sur la table en + (cliquer un bloc l\'ajoute aussi). Seule la NATURE des ingrédients compte — pas les quantités. Une bonne combinaison révèle la recette (et la fabrique si tu as le stock) ; un essai raté ne coûte rien.',
  tryHintLine:(pct,ing)=>'🧭 Proximité : '+pct+' % — '+ing+' bon'+(ing>1?'s':'')+' ingrédient'+(ing>1?'s':'')+'.',
  tryAllFound:'Toutes les recettes sont déjà connues !',
  tryRevealed:nm=>'📜 Recette révélée : '+nm+' — rassemble les matériaux pour la fabriquer !',
  pageLbl:(i,n,nm)=>'Page '+i+'/'+n+' — '+nm,
  pickerTitle:'🌱 Planter quoi ?',
  pickerNormie:n=>'🌱 Graine de Normie — planter '+n,
  pickerNoSeed:'aucune graine en stock',
  pickerChange:'🔁 Choisir un autre Normie…',
  introTitle:'🌱 Bienvenue dans PxGrove',
  introBody:'<p><strong>Pourquoi ce jeu existe-t-il ?</strong> PxGrove est une <strong>expérimentation ludique autour des API NFT</strong> : prendre les données on-chain d\'une collection pixel et en faire quelque chose avec quoi on peut vraiment <em>jouer</em>.</p><p>Les objectifs : créer une vraie <strong>expérience de jeu</strong>, encourager les projets NFT à inclure des <strong>traits pixel avec lesquels il est possible de jouer</strong>, et pousser l\'expérience au-delà des simples récompenses en $$ — avec des mécaniques de <strong>découverte, de craft et de croisement</strong>. Y connecter plus tard des fonctionnalités web3 financières n\'est pas exclu, mais toute l\'énergie est d\'abord concentrée sur une chose : <strong>un jeu fun, qui donne envie de revenir jour après jour</strong>.</p><p style="color:var(--muted)">Cette expérimentation n\'est <strong>liée à aucun projet NFT</strong>. Elle est développée par <a href="https://x.com/nftmooods" target="_blank" rel="noopener"><strong>@nftmooods</strong></a> — n\'hésite pas à envoyer tes commentaires ou idées en DM, ou un petit message d\'encouragement sur X pour dire ce que tu en as pensé !</p>',
  introGo:'C\'est parti !',
  tuto:{
    next:'Suivant ▸', skip:'Passer', done:'C\'est parti ! ✓',
    t0:'🌱 Bienvenue ! PxGrove est une <b>BÊTA</b> : l\'occasion de découvrir les mécaniques, dénicher les recettes… et surtout passer un chouette moment à voir grandir tes cultures. Pour le moment la sauvegarde se fait dans le cache de ce navigateur — un système de login / wallet connect pourrait être implanté par la suite.',
    t1:'Ici, <b>ton pot</b>, avec ta plante dedans — elle a déjà commencé à pousser !',
    t2:'<b>Double-clique la plante</b> pour l\'arroser. N\'oublie pas de revenir de temps en temps : sans eau, ta plante finit par mourir de soif.',
    t3:'Quand la plante est mûre et pleine de fleurs, <b>un double-clic la récolte</b> : tu récolteras les fleurs et le bois, et les fleurs se broient en <b>pixels</b> — la ressource qui fabrique tes améliorations.',
    tw:'L\'<b>Atelier</b> : ce panneau regroupe tout ce que tu peux ouvrir — Fabrication, Aménagement, Marché, Laboratoire, Almanach et tes Graines. Regardons ensemble les deux principaux.',
    t4:'Le <b>Laboratoire</b> : effectue d\'abord des recherches — ensuite les tables de fabrication (Fabrication / Aménagement) se remplissent de recettes à construire.',
    t5:'La <b>Fabrication</b> : broie tes fleurs en pixels, récupère du bois, et fabrique outils, machines et aménagements — chaque recette débloquée ouvre de nouvelles possibilités.',
    w0:'Première récolte ! Tes fleurs ont été broyées en <b>pixels</b> et tu as ramassé du <b>bois</b> — tes ressources vivent juste ici.',
    w1:'C\'est le moment de fabriquer l\'<b>Établi</b> : 20 bois. Il débloque toutes les autres recettes du jeu.',
    w2:'Appuie sur <b>Fabriquer</b> dès que tu as le bois — puis reviens récolter : chaque cycle finance la machine suivante. 🌱',
    t6:'Tout en haut : chaque jour, trois <b>quêtes</b> (🗓️) t\'attendent, et tes exploits remplissent les <b>badges</b> (🏅) — ils débloqueront des récompenses dans la version finale. Merci d\'essayer PxGrove… bon jeu ! 🌱',
    w0b:'Un double-clic sur une plante pleine de fleurs la récolte. Dès <b>80\x20% de croissance</b>, quand les premières fleurs apparaissent, tu peux déjà récolter — mais la plante donne <b>moins de ressources</b>. À <b>100\x20% avec toutes les fleurs</b>, le rendement est maximal.',
    g0:'<b>80\x20% de croissance !</b> Rappel : <b>double-clique sur le pot</b> pour arroser la plante à tout moment de sa pousse.',
    g1:'Le même double-clic <b>récolte</b> — mais <b>uniquement à 100\x20% de croissance avec toutes les fleurs sorties</b>. Avant ça, il ne fait qu\'arroser.',
    h0:'<b>Deuxième récolte : 2 graines !</b> Tu peux désormais planter <b>directement en terre</b> : clique un <b>emplacement libre</b> (pointillés) et choisis une graine — sans pot.',
    h1:'Une plante en terre donne <b>2 fleurs max</b> et son bois, mais elle est <b>plus fragile</b> : elle sèche plus vite et sera exposée à la météo et aux événements. Les pots protègent — la terre est gratuite.',
    e0:'Ton premier outil ! Il vit <b>ici, à gauche de la scène</b>. Cette case ouvre le groupe auquel il appartient.',
    e1:'Clique sur l\'outil pour <b>l\'équiper</b> — la case en surbrillance est celle en service.',
    e2:'Une fois équipé, il reste <b>actif en permanence</b> : inutile de le resélectionner avant chaque récolte ou arrosage.',
    f0:'Ton premier engrais ! Tes bonus vivent <b>ici, à gauche de la scène</b>. Cette case ouvre le groupe.',
    f1:'Clique sur un engrais pour <b>l\'appliquer à la plante sélectionnée</b> — il est consommé, et le bonus démarre aussitôt.',
    f2:'Le bonus actif s\'affiche <b>ici, sous le nom de la plante</b> : son icône, son effet et le temps restant.'
  },
  notifBody:(nm,i)=>'💧 Ta '+nm+' (pot '+(i+1)+') est à 10 % d\'hydratation — arrose-la avant qu\'elle ne flétrisse !',
  notifDry:(nm,i)=>'🥀 Ta '+nm+' (pot '+(i+1)+') est à sec — la croissance est stoppée, mort dans 24 h sans arrosage !',
  researchTitle:'🔬 Recherches', researchMenuHint:'à débloquer dans le 🧪 Laboratoire',
  labTitle:'Laboratoire', labTabResearch:'Recherches', labTabBreed:'Croisements',
  tierLockHint:'recherche d\'abord tous les blocs du palier précédent',
  blocks:{b_stone:{nm:'Taille de pierre'},b_heat:{nm:'Four & chaleur'},b_harv1:{nm:'Récolte I'},
    b_metal:{nm:'Métallurgie'},b_serum:{nm:'Sérums'},b_water:{nm:'Arrosage'},b_harv2:{nm:'Récolte II'},
    b_energy:{nm:'Énergie'},b_breed:{nm:'Génétique'},b_build:{nm:'Construction'},b_irrig:{nm:'Irrigation'},b_light:{nm:'Lampes de pousse'}},
  almanacTitle:'📗 Herbier', almProgress:'Collection', almHarvests:'Récoltes', almBest:'Meilleure récolte', almLost:'Plantes perdues',
  muts:{none:'forme commune',gold:'Feuillage doré',twist:'Tige torsadée',double:'Double floraison',glow:'Lueur nocturne'},
  mutIc:{none:'🌿',gold:'✨',twist:'🌀',double:'🌸',glow:'🌟'},
  questsTitle:'Quêtes du jour',
  quests:{water3:'Arroser 3 fois',harvest1:'Récolter une plante',grind100:'Broyer 100 pixels',craft2:'Fabriquer 2 objets',try1:'Tenter 1 expérience',fert1:'Utiliser un engrais',sell1:'Vendre au marché',plant1:'Planter une graine'},
  questAllHint:'Les 3 terminées → +1 graine 🌱',
  questAllDone:'✅ Tout est fait — graine bonus gagnée !',
  streakLbl:(n,j)=>'série de '+n+' j · '+j+' joker',
  streakNone:j=>'pas encore de série · '+j+' joker',
  journalTitle:'Journal', tabGarden:'Jardin',
  jlDay:d=>'Jour '+d,
  jl:{planted:v=>'plantée 🌱'+(v?' — '+v:''),leaf:()=>'premières feuilles dépliées',bloom:()=>'début de floraison ✿',saved:()=>'sauvée du flétrissement 💧',died:()=>'morte de soif 💀',harvest:px=>'récoltée — '+px+' px',gentle:px=>'cueillie délicatement — '+px+' px 🧤',mutation:m=>'une mutation est apparue !',named:v=>'son pot a été baptisé « '+v+' »'},
  toDiscover:n=>n+' recette'+(n>1?'s':'')+' encore à découvrir — recherche le palier ou passe par la table d\'essai.',
  invEmpty:'Rien de fabriqué pour l\'instant.',
  rBase:'connaissances de départ', rDone:'✓ recherché', rLocked:'🔒 palier précédent requis',
  rBaseNm:'Outils de base', rGoBtn:'Rechercher', rFootPts:'pièces disponibles pour la recherche',
  rFootHint:'Débloque les paliers dans l\'ordre — tous les blocs d\'un palier ouvrent le suivant.',
  badgesTitle:'Badges', badgeUnlocked:'Badge débloqué', badgeLocked:'pas encore obtenu', questsBtn:'Quêtes',
  mlTime:'Vitesse', mlLang:'Langue', mlInfo:'Infos',
  potPickTitle:nm=>'Installer : '+nm+' — choisis un pot', potN:n=>'Pot '+n,
  slotPickTitle:nm=>'Poser : '+nm+' — choisis un emplacement', matPickOk:'clique pour passer ce pot dans cette matière', slotN:n=>'Emplacement '+n, slotEmpty:'emplacement libre', slotPickOk:'clique pour poser le pot ici', slotPickTaken:'un pot occupe déjà cet emplacement',
  zonePickTitle:nm=>'Installer : '+nm+' — choisis une zone', zonePickOk:'clique pour installer dans cette zone', zoneGenLvl:l=>'générateur niv. '+l, zoneLbl:'Zone',
  potEmpty:'pot vide', plotEmpty:'parcelle nue', plotDefault:n=>'Parcelle '+n, groundMade:n=>'🟫 Parcelle '+n+' en pleine terre — choisis une graine',
  pcLockedTitle:'Verrouillé', pcLockedSub:'Améliore ton jardin', pcEmptyTitle:'Vide', pcEmptySub:'Choisis une graine',
  pcUnlockFreeQ:'Déverrouiller cet emplacement ?', pcUnlockCostQ:cost=>'Déverrouiller cet emplacement pour '+cost+' ?', pcUnlockFree:'Déverrouiller — gratuit', pcUnlockCost:cost=>'Déverrouiller — '+cost,
  pcNoRes:'Pas assez de ressources pour déverrouiller cet emplacement.',
  pcUnlockTitle:'Débloquer la parcelle', pcUnlockTxt:'Débloquez cette parcelle pour agrandir votre jardin.', pcReqLbl:'RESSOURCES REQUISES', pcUnlockFreeBtn:'Débloquer gratuitement', pcUnlockBtn:'Débloquer la parcelle',
  secondSeedToast:'🌰 2ᵉ récolte : 2ᵉ graine garantie — plante-la en pleine terre !', potPickOk:'clique pour installer ici', potPickNo:'cible invalide pour cet équipement',
  potPickRepl:'♻ REMPLACERA l\'équipement actuel — la moitié de ses matériaux retourne dans l\'inventaire',
  potPickConfirm:'⚠ Reclique pour confirmer : l\'ancien est recyclé (50 % des matériaux) et le nouveau installé.',
  badges:{
    firstHarvest:{nm:'Première récolte',fx:'Récolte ta première plante.'},
    waters100:{nm:'Main verte',fx:'Arrose 100 fois.'},
    wood500:{nm:'Bûcheron',fx:'Récupère 500 bois au total.'},
    machines:{nm:'Industriel',fx:'Possède l\'Établi, le Four et un Générateur.'},
    research3:{nm:'Érudit',fx:'Recherche les 3 paliers.'},
    discover5:{nm:'Savant fou',fx:'Découvre 5 recettes à la table d\'essai.'},
    mutation1:{nm:'Pousse chanceuse',fx:'Observe ta première mutation.'},
    almanacRow:{nm:'Complétionniste',fx:'Complète une ligne entière de l\'herbier (les 5 formes d\'une variété).'},
    varieties5:{nm:'Botaniste',fx:'Fais pousser 5 variétés différentes.'},
    firstSell:{nm:'Marchand',fx:'Réalise ta première vente au marché.'},
    coins1000:{nm:'Magnat',fx:'Gagne 1000 $ au total au marché.'},
    hybridCut:{nm:'Alchimiste',fx:'Récolte une plante hybride.'},
    streak7:{nm:'Jardinier dévoué',fx:'Tiens une série de quêtes de 7 jours.'},
    perfectDay:{nm:'Journée parfaite',fx:'Termine les 3 quêtes d\'une même journée.'},
    gardenFull:{nm:'Maison pleine',fx:'3 pots, 3 plantes vivantes en même temps.'},
  },
  soilNext:n=>'La prochaine plantation utilisera 1 terreau ('+n+' en stock).',
  soilNone:'Pas de terreau en stock — prochaine plantation en terre nue.',
  noSeed:'Pas de graine disponible — récolte d\'abord une plante.',
  noFreePot:'Tous les pots sont occupés — récolte d\'abord une plante.',
  potLbl:(i,n)=>'Pot '+(i+1)+'/'+n, potDefault:n=>'Pot '+n, seedDefault:n=>'Seed '+n,
  emptyTitle:'Pot vide', emptyNotice:'Ce pot est vide — <b>Replanter</b> une graine ici.',
  badgeSoil:'🪴 terreau appliqué', badgeFert:t=>'🧪 engrais '+t+' restant', badgeFertPlus:t=>'💠 engrais enrichi '+t+' restant',
  badgeFertX:(ic,pct,t)=>ic+' +'+pct+'\x20% pousse \u00b7 '+t+' restant',
  info:{title:'ℹ️ Comment ça marche', hint:'Clique sur une fonctionnalité pour lire ce qu\'elle fait.', items:{
    plant:{nm:'🌱 Planter',tx:'Entre un numéro de Normie ou de Hoodie : son type fixe la variété de la plante (vitesse de pousse, richesse des fleurs) et son nombre de pixels fixe sa taille. Pas de token ? Plante une Pousse commune — plus lente, moins de fleurs.'},
    water:{nm:'💧 Arrosage & hydratation',tx:'Une plante de base passe de pleine à sèche en 8 h — et tout ce qui accélère sa pousse (variété, terreau, engrais) la dessèche d\'autant plus vite ; une lampe la dessèche encore plus (jusqu\'à 6 h sur une plante de base). Arrose à la main (50\x20%), ou mieux avec un seau / un arrosoir. Double-clic sur un pot = arroser. À 10\x20% tu es averti, à 0\x20% la plante meurt.'},
    grow:{nm:'🌼 Pousse & fleurs',tx:'La pousse suit le temps réel (24 h de base pour une graine commune, 18–19 h pour les variétés les plus rapides). Les fleurs éclosent au fil de la pousse, jusqu\'au maximum du pot.'},
    harvest:{nm:'✂ Récolter & broyer',tx:'Quand le pot est plein de fleurs (le double-clic marche alors), récolte : les fleurs sont broyées en pixels, la plante est coupée et donne du bois et une graine. Les gants peuvent cueillir sans couper.'},
    workbench:{nm:'🧰 Établi & fabrication',tx:'Fabrique d\'abord l\'Établi (20 bois — ta première récolte à maturité donne toujours 21). Il débloque le carnet de recettes : outils, machines, consommables. Clique sur une ressource pour ouvrir le carnet filtré dessus.'},
    layout:{nm:'🏠 Aménagement',tx:'Construis des pots et choisis la matière de chacun — argile, céramique (+1 fleur), grand pot céramique (+2), terre cuite (pousse plus vite pour les variétés du sec, sèche plus vite), plastique (retient l\'eau), béton (isolé), auto-arrosant (réserve ×1.40) — plus des pièces (+3 pots chacune) et le Bureau de contrôle. L\'aménagement est propre à chaque plantation.'},
    market:{nm:'🪙 Marché',tx:'Vends des pixels et des graines contre des pièces, achète ce qui te manque. Les prix sont affichés dans la fenêtre Marché.'},
    lab:{nm:'🧪 Laboratoire',tx:'Dépense des pièces dans des blocs de recherche, palier par palier. Chaque bloc débloque de nouvelles recettes. L\'arbre montre ce qui est fait, disponible ou verrouillé.'},
    almanac:{nm:'📗 Herbier',tx:'Tes records : récoltes, meilleurs rendements, variétés et mutations découvertes.'},
    seeds:{nm:'🌰 Coffre à graines',tx:'Toutes tes graines, par variété et souche. Filtre, puis plante, vends ou détruis. Replanter ouvre le même coffre en mode sélection.'},
    fert:{nm:'🧫 Engrais & sérums',tx:'Compost +15\x20%, engrais +30\x20%, enrichi +50\x20% de pousse pendant 12 h (l\'enrichi donne aussi +5\x20% de chance de double graine jusqu\'à la récolte). Les sérums donnent +40\x20% mais seulement sur leur propre variété. Le badge de la fiche plante montre l\'engrais actif.'},
    soil:{nm:'🪴 Terreau',tx:'Fabrique du terreau pour planter dedans : +25\x20% de pousse pendant toute la vie de la plante. Il est consommé à la plantation.'},
    lamp:{nm:'💡 Lampes & générateurs',tx:'Une lampe sur un pot accélère la pousse (+30/45/60\x20% selon le niveau) mais consomme de l\'énergie. Un générateur à charbon par pièce l\'alimente — recharge chaque pièce séparément avec du bois.'},
    tank:{nm:'🛢️ Réservoir & goutte-à-goutte',tx:'Un réservoir par pièce alimente le goutte-à-goutte de ses pots pour arroser moins à la main. Remplis le réservoir de chaque pièce séparément.'},
    tools:{nm:'🪣 Outils',tx:'Seau et arrosoir arrosent plus par action ; la pince de coupe donne plus de bois (2 niveaux : +40\x20% / +75\x20%) ; les gants (2 niveaux : 12\x20% / 25\x20%) peuvent cueillir sans couper. L\'équipement actif est affiché à gauche de la scène.'},
    rooms:{nm:'🏠 Pièces',tx:'La scène montre une pièce de 3 pots. Change de pièce avec les boutons 🏠 à droite ; un ! rouge signale qu\'il s\'y passe quelque chose (plante assoiffée ou morte, lampe sans courant).'},
    desk:{nm:'🖥️ Bureau de contrôle',tx:'Un élément d\'aménagement coûteux. Ouvre une vue tour de contrôle : énergie, eau et état des récoltes de toutes les pièces sur un seul écran, avec boutons recharger / remplir / renommer.'},
    quests:{nm:'🗓️ Quêtes & badges',tx:'Les quêtes du jour rapportent pièces et ressources ; les badges gardent trace des étapes franchies. Les deux sont dans la barre du haut.'},
    hybrid:{nm:'🧬 Hybrides & souches',tx:'La table d\'essai croise deux graines en une souche aux stats mélangées. Les souches vivent dans le coffre à graines et s\'améliorent avec les récoltes.'},
    time:{nm:'⏱️ Vitesse & langue',tx:'Le menu ⚙️ bascule temps réel / accéléré ×720 (pour tester) et anglais / français.'},
    save:{nm:'💾 Sauvegarde',tx:'La progression est sauvegardée automatiquement dans ce navigateur uniquement. Effacer les données du site la supprime.'}
  }},
  badgeLuck:'💠 +5\x20% double graine \u00b7 jusqu\'à la récolte', badgeLamp:'💡 lampe sur ce pot',
  phases:{seed:'graine',germ:'germination',young:'jeune pousse',mature:'mature',bloom:'floraison',wither:'flétrie !',dead:'morte',cut:'récoltée'},
  thirst:'· ELLE MEURT DE SOIF', waterIt:'· à arroser !',
  growthLeft:t=>'pousse : '+t+' restantes', grown:'pousse terminée', deadClock:'plante morte',
  cutClock:'plante récoltée — replante une graine',
  driesIn:t=>' · sèche dans '+t, diesIn:t=>' · MORTE dans '+t,
  grindFirst:'récolter d\'abord',
  deathNotice:(n,st)=>'💀 Ta '+n+' est morte de soif. <b>Récolte le bois mort</b> pour libérer le pot — tu sauves <b>1/3 du bois</b>'+(st?' (aucune graine : les hybrides sont stériles)':' et tu récupères <b>la graine</b>')+'.',
  cutShort:'✂ Récoltée — <b>replante</b> une graine quand tu veux.',
  cutNotice:(n,px,wood,seeds,dbl)=>'✂ Ta '+n+' a été coupée : <b>'+px+' pixels</b> broyés, <b>'+wood+' bois</b> récupéré'+(seeds===0?' — <b>aucune graine</b> : les variétés hybrides sont stériles.':(dbl?' et <b>DOUBLE GRAINE</b> — 2 graines récupérées !':' et 1 graine récupérée.'))+' <b>Replanter</b> quand tu veux.',
  gentleNotice:(n,px)=>'🧤 Récolte délicate ! <b>'+px+' pixels</b> broyés et ta '+n+' n\'a <b>PAS été coupée</b> — elle continue de fleurir.',
  errNum:'Numéro invalide — un Normie porte un numéro entre 0 et 9999.',
  searching:'Recherche via l\'API…',
  apiDown:'API injoignable depuis cette page — utilise l\'import manuel ci-dessous.',
  errJson:'JSON illisible — colle bien tout le contenu de la page metadata (accolades comprises).',
  units:{d:'j',h:'h',m:'min',s:'s'},
  footer:'PxGrove — MVP Étape 1 (mode découverte, sans wallet). Boucle : planter → arroser → fleurs → récolter (coupe la plante) → broyer & fabriquer → replanter.<br>Données Normie : snapshot à la plantation, via <a href="https://api.normies.art" target="_blank" rel="noopener">api.normies.art</a> (échantillon embarqué + import manuel). Sauvegarde locale dans ce navigateur uniquement.',
},
};
function T(){ return I18N[S.lang]||I18N.en; }

/* ── State ── */
function freshInv(){
  return {px:0, wood:0, stone:0, metal:0, mineral:0, seedsVar:{Generic:1}, coins:0, soil:0, compost:0, fert:0, fertPlus:0,
          fertHuman:0, fertZombie:0, fertAgent:0, fertCat:0, fertAlien:0,
          hybridBloom:0, hybridTimber:0,
          tools:{workbench:false,bucketWood:false,bucketMetal:false,furnace:false,
                 shears:false,shearsUp2:false,gloves:false,glovesUp2:false,arrosoir:false,breedlab:false},
          equip:'hands', waterMode:'hand', dripOn:true, strainSeeds:{},
          genLvlRoom:[0,0,0], energyRoom:[0,0,0], tankRoom:[false,false,false], tankLevelRoom:[0,0,0], tankCount:0,
          research:{}, discovered:[],
          potCrafts:0, potAt:[true,false,false,false,false,false,false,false,false], potMatAt:['ground',...Array(8).fill('clay')], ceramicCount:0, ceramicBigCount:0, terraCount:0, plasticCount:0, concreteCount:0, selfWaterCount:0, roomCount:0, controlDesk:0, lampCount:0, lampLvl2Count:0, lampLvl3Count:0, genCount:0, genLvl2Count:0, genLvl3Count:0, dripCount:0, dripPlusCount:0, dripElecCount:0,
          dripTierAt:[0,0,0,0,0,0,0,0,0], lampLvlAt:Array(9).fill(0), lampOnArr:Array(9).fill(true),
          genLvlAt:Array(9).fill(0), energyAt:Array(9).fill(0)};
}
function freshState(){
  return { normie:null, plants:[null], sel:0, mode:'real', lang:'en', lastTs:Date.now(), inv:freshInv(),
    almanac:{seen:{}, totalHarvests:0, bestHarvestPx:0, plantsLost:0},
    daily:null, streak:{count:0, lastCounted:'', joker:1, jokerWeek:''},
    stats:{}, badges:{}, strains:{}, comm:'normies', gardens:{}, tutoSeen:false, tuto2Seen:false, tuto3Seen:false, tuto4Seen:false, tuto5Seen:false, tuto6Seen:false, balV:2 };
}
let S = freshState();
const LS_KEY='pixelvalet_state_v2';
function save(){ try{ S.lastTs=Date.now(); localStorage.setItem(LS_KEY,JSON.stringify(S)); }catch(e){} }
function load(){
  try{
    const r=localStorage.getItem(LS_KEY); if(!r) return;
    const o=JSON.parse(r); if(!o||!o.inv) return;
    S=o; if(!S.lang)S.lang='en';
    if(!S.inv.tools){ // v1 → v2
      const old=S.inv, inv=freshInv();
      inv.px=old.pixels||0; inv.seeds=(typeof old.seeds==='number')?old.seeds:1;
      const oc=old.crafts||{};
      if(oc.pot) inv.potCrafts=1;
      if(oc.terreau) inv.soil=3;
      if(oc.lampe) inv.lampCount=1;
      S.inv=inv;
    }else{ // v2/v3 tools with pot/lamp booleans → counts
      if(typeof S.inv.potCrafts!=='number') S.inv.potCrafts=S.inv.tools.pot?1:0;
      if(typeof S.inv.lampCount!=='number') S.inv.lampCount=S.inv.tools.lamp?1:0;
      delete S.inv.tools.pot; delete S.inv.tools.lamp;
      if(typeof S.inv.genAcc!=='number') S.inv.genAcc=0;
      if(typeof S.inv.genOn!=='boolean') S.inv.genOn=false;
    }
    if(S.plant!==undefined){ // single plant → plants[]
      if(S.plant){ S.plant.normie=S.normie||null; S.plants=[S.plant]; }
      else S.plants=[null];
      delete S.plant; S.sel=0;
    }
    if(!Array.isArray(S.plants)) S.plants=[null];
    if(typeof S.sel!=='number') S.sel=0;
    S.plants.forEach(p=>{ if(p&&p.soil===undefined){ p.soil=false; p.buffUntil=0; p.buffMult=1; p.luckBonus=0; } });
    // patch newer inventory fields
    const fresh=freshInv();
    // old boolean generator/drip → per-pot counts
    if(typeof S.inv.genCount!=='number') S.inv.genCount=(S.inv.tools&&S.inv.tools.generator)?1:0;
    if(typeof S.inv.dripCount!=='number') S.inv.dripCount=(S.inv.tools&&S.inv.tools.drip)?1:0;
    if(S.inv.tools){ delete S.inv.tools.generator; delete S.inv.tools.drip; }
    if(S.inv.tools.shears&&typeof S.inv.tools.shearsUp2!=='boolean') S.inv.tools.shearsUp2=true; // shears split (09/2026): old shears = level II
    for(const k of Object.keys(fresh.tools)) if(typeof S.inv.tools[k]!=='boolean') S.inv.tools[k]=false;
    for(const k of ['compost','coins','hybridBloom','hybridTimber','fertHuman','fertZombie','fertAgent','fertCat','fertAlien'])
      if(typeof S.inv[k]!=='number') S.inv[k]=0;
    if(!['hands','shears','gloves'].includes(S.inv.equip)) S.inv.equip='hands';
    if(S.inv.equip!=='hands'&&!S.inv.tools[S.inv.equip]) S.inv.equip='hands';
    if(typeof S.inv.dripOn!=='boolean') S.inv.dripOn=true;
    if(typeof S.inv.firstWoodGiven!=='boolean') S.inv.firstWoodGiven=((S.almanac&&S.almanac.totalHarvests>0)||!!S.inv.tools.workbench);
    if(typeof S.inv.cuts!=='number') S.inv.cuts=(S.almanac&&S.almanac.totalHarvests)||0;
    if(typeof S.inv.secondSeedGiven!=='boolean') S.inv.secondSeedGiven=S.inv.cuts>=2; // veterans: no retro seed, but the ground tutorial still fires at their next cut
    if(!['hand','bucketWood','bucketMetal','arrosoir'].includes(S.inv.waterMode)){
      S.inv.waterMode=S.inv.tools.arrosoir?'arrosoir':(S.inv.tools.bucketMetal?'bucketMetal':(S.inv.tools.bucketWood?'bucketWood':'hand'));
    }
    if(!Array.isArray(S.inv.discovered)) S.inv.discovered=[];
    if(!S.almanac) S.almanac={seen:{}, totalHarvests:0, bestHarvestPx:0, plantsLost:0};
    if(!S.stats) S.stats={};
    if(!S.badges) S.badges={};
    if(!S.streak) S.streak={count:0, lastCounted:'', joker:1, jokerWeek:''};
    if(!S.strains) S.strains={};
    if(!S.inv.strainSeeds||typeof S.inv.strainSeeds!=='object') S.inv.strainSeeds={};
    if(!COMMUNITIES[S.comm]) S.comm='normies'; // existing saves: current garden becomes the Normies plantation
    if(!S.gardens||typeof S.gardens!=='object') S.gardens={};
    // generic seed count → typed seeds (typed as the garden's token, else Generic)
    if(!S.inv.seedsVar||typeof S.inv.seedsVar!=='object'){
      const n=(typeof S.inv.seeds==='number')?S.inv.seeds:0;
      const ty=(S.normie&&S.normie.type)||'Generic';
      S.inv.seedsVar={}; if(n>0)S.inv.seedsVar[ty]=n;
      delete S.inv.seeds;
    }
    for(const gk of Object.keys(S.gardens)){
      const g=S.gardens[gk];
      if(g&&(!g.seedsVar||typeof g.seedsVar!=='object')){
        const n=(typeof g.seeds==='number')?g.seeds:0;
        const ty=(g.normie&&g.normie.type)||'Generic';
        g.seedsVar={}; if(n>0)g.seedsVar[ty]=n;
        delete g.seeds;
      }
    }
    if(S.daily===undefined) S.daily=null;
    S.plants.forEach(p=>{ if(p&&p.mutation===undefined){ p.mutation='none'; p.mutRevealed=true; p.name=null; p.journal=[]; } });
    if(!S.inv.research){ // grandfather existing progress into the new research gates
      const i=S.inv;
      S.inv.research={
        t1:!!(i.tools.furnace||i.tools.shears||i.potCrafts>0),
        t2:!!(i.genCount>0||i.tools.tank||i.tools.arrosoir||i.tools.gloves||i.tools.bucketMetal),
        t3:!!(i.lampCount>0||i.dripCount>0),
      };
    }
    // global drip upgrades (tools) → per-unit upgrade counts: an owned upgrade covered every drip
    if(S.inv.tools&&(S.inv.tools.dripPlus!==undefined||S.inv.tools.dripElec!==undefined)){
      const plus=!!S.inv.tools.dripPlus, elec=!!S.inv.tools.dripElec;
      const conv=g=>{ const d=g.dripCount||0; g.dripPlusCount=(plus||elec)?d:0; g.dripElecCount=elec?d:0; };
      conv(S.inv);
      for(const gk of Object.keys(S.gardens)) if(S.gardens[gk]) conv(S.gardens[gk]);
      delete S.inv.tools.dripPlus; delete S.inv.tools.dripElec;
    }
    if(typeof S.inv.dripPlusCount!=='number') S.inv.dripPlusCount=0;
    if(typeof S.inv.dripElecCount!=='number') S.inv.dripElecCount=0;
    // count-based equipment → per-pot assignments (existing gear lands on the first pots)
    const potify=g=>{
      if(typeof g.roomCount!=='number') g.roomCount=0;
      if(!Array.isArray(g.roomNames)) g.roomNames=[];
      if(!Array.isArray(g.potNames)) g.potNames=[];
      if(typeof g.controlDesk!=='number') g.controlDesk=0;
      if(!Array.isArray(g.ceramicAt)){ // craft split (09/2026): old potCrafts upgraded pot 1 then added ceramic pots
        g.ceramicAt=Array(9).fill(false);
        const oldN=g.potCrafts||0;
        if(oldN>=1){
          const hadPots=Math.min(1+Math.max(0,oldN-1),9);
          for(let i=0;i<hadPots;i++) g.ceramicAt[i]=true;
          g.potCrafts=Math.max(0,oldN-1); // potCrafts now counts ADDED pots only
        }
      }
      while(g.ceramicAt.length<9)g.ceramicAt.push(false);
      if(!Array.isArray(g.potMatAt)){ // pot materials (09/2026): the old ceramic upgrade (+2 flowers) becomes the Big ceramic pot
        g.potMatAt=g.ceramicAt.map(c=>c?'ceramicBig':'clay');
      }
      while(g.potMatAt.length<9)g.potMatAt.push('clay');
      if(!Array.isArray(g.potAt)){ // sparse slots (09/2026): pots used to fill slots left to right
        g.potAt=Array(9).fill(false);
        const n=Math.max(1,Math.min(9,1+(g.potCrafts||0)));
        for(let i=0;i<n;i++) g.potAt[i]=true;
      }
      while(g.potAt.length<9)g.potAt.push(false);
      g.potAt[0]=true;
      if(Array.isArray(g.dripTierAt)){ // pad older arrays up to 9
        while(g.dripTierAt.length<9)g.dripTierAt.push(0);
        if(Array.isArray(g.lampArr)){while(g.lampArr.length<9)g.lampArr.push(false);}
        if(Array.isArray(g.genArr)){while(g.genArr.length<9)g.genArr.push(false);}
      }else{
      g.dripTierAt=Array(9).fill(0); g.lampArr=Array(9).fill(false); g.genArr=Array(9).fill(false); // converted to levels just below
      for(let i=0;i<9;i++){
        if(i<(g.dripElecCount||0)) g.dripTierAt[i]=3;
        else if(i<(g.dripPlusCount||0)) g.dripTierAt[i]=2;
        else if(i<(g.dripCount||0)) g.dripTierAt[i]=1;
        g.lampArr[i]=i<(g.lampCount||0);
        g.genArr[i]=i<(g.genCount||0);
      }
      }
      // lamps become level-1 lamps
      if(!Array.isArray(g.lampLvlAt)){
        g.lampLvlAt=Array(9).fill(0);
        for(let i=0;i<9;i++){ if(g.lampArr&&g.lampArr[i]) g.lampLvlAt[i]=1; }
        delete g.lampArr;
      }
      while(g.lampLvlAt.length<9)g.lampLvlAt.push(0);
      // generators become coal generators lvl 1 with a full battery; lamp switches default ON
      if(!Array.isArray(g.genLvlAt)){
        g.genLvlAt=Array(9).fill(0); g.energyAt=Array(9).fill(0);
        for(let i=0;i<9;i++){ if(g.genArr&&g.genArr[i]){ g.genLvlAt[i]=1; g.energyAt[i]=EN_CAP_H; } }
        delete g.genArr;
      }
      while(g.genLvlAt.length<9)g.genLvlAt.push(0);
      while(g.energyAt.length<9)g.energyAt.push(0);
      if(!Array.isArray(g.lampOnArr)) g.lampOnArr=Array(9).fill(true);
      while(g.lampOnArr.length<9)g.lampOnArr.push(true);
      if(!Array.isArray(g.genLvlRoom)){ // per-room energy (09/2026): a room keeps its BEST generator
        g.genLvlRoom=[0,0,0]; g.energyRoom=[0,0,0];
        const ga=Array.isArray(g.genLvlAt)?g.genLvlAt:[], ea=Array.isArray(g.energyAt)?g.energyAt:[];
        for(let i=0;i<9;i++){
          const r=Math.floor(i/3);
          if((ga[i]||0)>g.genLvlRoom[r]) g.genLvlRoom[r]=ga[i]||0;
          if((ea[i]||0)>g.energyRoom[r]) g.energyRoom[r]=ea[i]||0;
        }
        for(let r=0;r<3;r++) g.energyRoom[r]=Math.min(g.energyRoom[r],EN_CAP_H*g.genLvlRoom[r]);
        delete g.genLvlAt; delete g.energyAt;
      }
    };
    if(!Array.isArray(S.inv.tankRoom)){
      const hadTank=!!(S.inv.tools&&S.inv.tools.tank);
      const mkTank=g=>{ g.tankRoom=[hadTank,false,false]; g.tankLevelRoom=[hadTank?Math.min(TANK_CAP_H,g.tankLevel||0):0,0,0]; delete g.tankLevel; };
      mkTank(S.inv);
      for(const gk of Object.keys(S.gardens)) if(S.gardens[gk]) mkTank(S.gardens[gk]);
      if(S.inv.tools) delete S.inv.tools.tank;
    }
    potify(S.inv);
    for(const gk of Object.keys(S.gardens)) if(S.gardens[gk]) potify(S.gardens[gk]);
    recomputeEquipCounts();
    // whole-tier research (t1/t2/t3) → per-category blocks: a researched tier unlocks all its blocks
    if(S.inv.research&&('t1' in S.inv.research||'t2' in S.inv.research||'t3' in S.inv.research)){
      for(let ti=1;ti<=3;ti++){
        if(S.inv.research['t'+ti]) RESEARCH_BLOCKS.filter(b=>b.tier===ti).forEach(b=>{ S.inv.research[b.id]=true; });
        delete S.inv.research['t'+ti];
      }
    }
    // balance v2 (09/2026): full growth 24h (was 120h) — rescale in-flight plants, re-clamp strain speeds
    if(S.balV!==2){
      const K=24/120;
      const resc=arr=>{ if(Array.isArray(arr)) arr.forEach(p=>{ if(p){ p.growthH=(p.growthH||0)*K; p.bloomAccH=(p.bloomAccH||0)*K; } }); };
      resc(S.plants);
      for(const gk of Object.keys(S.gardens)){ const g=S.gardens[gk]; if(g) resc(g.plants); }
      for(const id of Object.keys(S.strains||{})){ const st=S.strains[id]; if(st&&typeof st.speed==='number') st.speed=+clamp(st.speed,1,2).toFixed(2); }
      S.balV=2;
    }
  }catch(e){
    // a corrupted or too-old save must NEVER block the game: back it up, restart clean
    try{ const r=localStorage.getItem(LS_KEY); if(r) localStorage.setItem(LS_KEY+'_backup',r); }catch(_){}
    S=freshState();
  }
  // last-resort shape guards, whatever path the save took
  if(!S.inv||typeof S.inv!=='object') S=freshState();
  if(!S.inv.seedsVar||typeof S.inv.seedsVar!=='object') S.inv.seedsVar={Generic:1};
  if(!S.inv.strainSeeds||typeof S.inv.strainSeeds!=='object') S.inv.strainSeeds={};
  if(!S.strains) S.strains={};
  if(!COMMUNITIES[S.comm]) S.comm='normies';
  if(!S.gardens||typeof S.gardens!=='object') S.gardens={};
  if(!Array.isArray(S.plants)) S.plants=[null];
  if(!S.inv.research||typeof S.inv.research!=='object') S.inv.research={};
}

/* ── Helpers ── */
const $=id=>document.getElementById(id);
/* visible crash reporter: any uncaught error shows on screen (the artifact iframe console is unreachable) */
window.addEventListener('error',ev=>{
  try{
    let b=document.getElementById('errBanner');
    if(!b){ b=document.createElement('div'); b.id='errBanner';
      b.style.cssText='position:fixed;left:8px;bottom:8px;z-index:9999;max-width:90vw;background:#5a1c24;color:#ffd7dc;border:2px solid #d4707f;padding:8px 10px;font:12px monospace;white-space:pre-wrap';
      document.body.appendChild(b); }
    b.textContent='⚠ '+(ev.message||'error')+' @ '+(ev.lineno||'?')+':'+(ev.colno||'?');
  }catch(_){}
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function potSlots(){ return Math.min(MAX_POTS,ROOM_SLOTS*(1+(S.inv.roomCount||0))); } // each room adds 3 spaces
function hasPot(i){ return i>=0&&i<potSlots()&&!!(S.inv.potAt&&S.inv.potAt[i]); } // slots are sparse: a pot can sit anywhere in a zone
function potList(){ const a=[]; for(let i=0;i<potSlots();i++) if(hasPot(i)) a.push(i); return a; }
function potCount(){ return Math.max(1,potList().length); }
/* Pot materials — one per pot, swappable at the crafting table (pot picker). flowers = bonus on the cap;
   hyd = water reserve factor; growDry/growWet = growth factor for dry-loving varieties / the others */
const POT_MAT={
  clay:      {flowers:0, hyd:1.00, growDry:1.00, growWet:1.00, wide:false},
  ceramic:   {flowers:1, hyd:1.10, growDry:1.00, growWet:1.00, wide:false}, // glazed: keeps a little more water
  ceramicBig:{flowers:2, hyd:1.10, growDry:1.00, growWet:1.00, wide:true},  // the former "ceramic upgrade": 8 flowers instead of 6
  terracotta:{flowers:0, hyd:0.80, growDry:1.15, growWet:1.05, wide:false}, // breathes: dry-loving varieties thrive, water goes fast
  plastic:   {flowers:0, hyd:1.25, growDry:0.90, growWet:1.00, wide:false}, // holds humidity; dry-loving varieties dislike it
  concrete:  {flowers:0, hyd:1.15, growDry:1.00, growWet:1.00, wide:false, insulated:true}, // thermal insulation (seasons, later)
  selfWater: {flowers:0, hyd:1.40, growDry:1.00, growWet:1.00, wide:false}, // small reservoir: hydration drops slower
  ground:    {flowers:0, hyd:0.85, growDry:1.00, growWet:1.00, wide:false, ground:true, cap:2, fragile:true}, // planted straight in the soil: 2 flowers max, wood as usual, fragile (dries faster; exposed to future weather & events)
};
function isGround(i){ return typeof i==='number'&&hasPot(i)&&potType(i)==='ground'; }
function makeGroundPlot(i){ // dig a plot in a free slot — no pot, no cost
  if(!Array.isArray(S.inv.potAt)) S.inv.potAt=[]; if(!Array.isArray(S.inv.potMatAt)) S.inv.potMatAt=[];
  S.inv.potAt[i]=true; S.inv.potMatAt[i]='ground'; S.plants[i]=null;
  recomputeEquipCounts();
}
function groundPlantAt(i){ // click on a free slot: dig the plot, select it and choose the seed (always via the picker: the click is the confirmation)
  if(i<0||i>=potSlots()||hasPot(i)||roomOf(i)!==curRoom)return;
  if(!canReplant()){ showToast(T().noSeed); return; }
  makeGroundPlot(i);
  S.sel=i; curRoom=roomOf(i); _navSig='';
  applyAccent(); save(); render(true);
  showToast(T().groundMade(i+1));
  seedPickMode=true; seedPage=0; renderSeedVault(); $('seedOverlay').classList.add('on');
}
function plotUnlockCost(i){ return (i%ROOM_SLOTS)<2?null:{stone:40}; } // the first 2 plots of every room are free; the rest cost the same as a crafted pot
function canAffordCost(cost){ if(!cost)return true; for(const k in cost) if((S.inv[k]||0)<cost[k]) return false; return true; }
function unlockPlot(i){ // confirmed from the "Locked" plot card
  if(i<0||i>=potSlots()||hasPot(i)||roomOf(i)!==curRoom)return;
  if(!canReplant()){ showToast(T().noSeed); return; } // check BEFORE spending: groundPlantAt bails out here too, but only after the cost would already be gone
  const cost=plotUnlockCost(i);
  if(!canAffordCost(cost)){ showToast(T().pcNoRes); return; }
  if(cost) for(const k in cost) S.inv[k]-=cost[k];
  groundPlantAt(i);
}
const DRY_LOVERS=['Cat','Alien','Flipper']; // varieties that like it dry
function potType(i){ const m=S.inv.potMatAt&&S.inv.potMatAt[i]; return POT_MAT[m]?m:'clay'; }
function potMat(i){ return POT_MAT[potType(i)]; }
function potGrowth(p,i){ if(typeof i!=='number'||!p)return 1; const m=potMat(i); return DRY_LOVERS.includes(baseTypeOf(p))?m.growDry:m.growWet; }
/* per-pot equipment: every device is INSTALLED on a chosen pot (arrays indexed by pot) */
function dripTier(i){ return (S.inv.dripTierAt&&S.inv.dripTierAt[i])||0; } // 0 none · 1 base · 2 improved · 3 electronic
function lampLvl(i){ return (S.inv.lampLvlAt&&S.inv.lampLvlAt[i])||0; }
function lampAt(i){ return lampLvl(i)>0; }
function genLvlRoomOf(r){ return (S.inv.genLvlRoom&&S.inv.genLvlRoom[r])||0; } // ONE generator per ROOM
function energyRoomOf(r){ return (S.inv.energyRoom&&S.inv.energyRoom[r])||0; }
function energyCapRoom(r){ return EN_CAP_H*genLvlRoomOf(r); }
function tankAtRoom(r){ return !!(S.inv.tankRoom&&S.inv.tankRoom[r]); }        // ONE water tank per ROOM
function tankLvlRoom(r){ return (S.inv.tankLevelRoom&&S.inv.tankLevelRoom[r])||0; }
function genLvl(i){ return genLvlRoomOf(roomOf(i)); }     // a pot uses ITS room's generator
function genAtPot(i){ return genLvl(i)>0; }
function energyAtPot(i){ return energyRoomOf(roomOf(i)); }
function energyCap(i){ return EN_CAP_H*genLvl(i); }
function lampOn(i){ return !S.inv.lampOnArr||S.inv.lampOnArr[i]!==false; } // per-pot lamp switch
function lampActive(i){ return lampAt(i)&&lampOn(i)&&genAtPot(i)&&energyAtPot(i)>0; }
function dripAt(i){ return tankAtRoom(roomOf(i))&&dripTier(i)>0; } // a drip line needs ITS room's tank
function recomputeEquipCounts(){
  const dt=S.inv.dripTierAt||[];
  S.inv.dripCount=dt.filter(t=>t>=1).length;
  S.inv.dripPlusCount=dt.filter(t=>t>=2).length;
  S.inv.dripElecCount=dt.filter(t=>t>=3).length;
  const ll=S.inv.lampLvlAt||[];
  S.inv.lampCount=ll.filter(l=>l>=1).length;
  S.inv.lampLvl2Count=ll.filter(l=>l>=2).length;
  S.inv.lampLvl3Count=ll.filter(l=>l>=3).length;
  const gl=S.inv.genLvlRoom||[];
  S.inv.genCount=gl.filter(l=>l>=1).length;
  S.inv.genLvl2Count=gl.filter(l=>l>=2).length;
  S.inv.genLvl3Count=gl.filter(l=>l>=3).length;
  S.inv.tankCount=(S.inv.tankRoom||[]).filter(Boolean).length;
  S.inv.potCrafts=Math.max(0,potList().filter(i=>potType(i)!=='ground').length-1); // added pots = real pots beyond the first (ground plots are free, not crafted)
  const pm=S.inv.potMatAt||[];
  S.inv.ceramicCount=pm.filter(m=>m==='ceramic').length;
  S.inv.ceramicBigCount=pm.filter(m=>m==='ceramicBig').length;
  S.inv.terraCount=pm.filter(m=>m==='terracotta').length;
  S.inv.plasticCount=pm.filter(m=>m==='plastic').length;
  S.inv.concreteCount=pm.filter(m=>m==='concrete').length;
  S.inv.selfWaterCount=pm.filter(m=>m==='selfWater').length;
}
function hasThing(id){ // owns at least one of this recipe's output
  const r=RECIPES.find(x=>x.id===id); if(!r)return false;
  if(r.kind==='multi')return S.inv[r.cnt]>0;
  if(r.kind==='tool'||r.kind==='machine')return !!S.inv.tools[id];
  return false;
}
function blockDone(id){ return !!S.inv.research[id]; }
function researched(tier){ return tier<=0||RESEARCH_BLOCKS.filter(b=>b.tier===tier).every(b=>blockDone(b.id)); }
function tierOpen(tier){ return tier<=1||researched(tier-1); } // all blocks of the previous tier first
function discovered(id){ return S.inv.discovered.includes(id); }
function recipeVisible(r){ return r.tier===0||blockDone(BLOCK_OF[r.id])||discovered(r.id); }
function ensurePlants(){ while(S.plants.length<potSlots()) S.plants.push(null); if(!hasPot(S.sel)){ const l=potList(); S.sel=l.length?l[0]:0; } }
function selPlant(){ ensurePlants(); return S.plants[S.sel]||null; }
/* ── Multi-plantation: one garden per community; resources/tools/research/strains shared ── */
const GARDEN_INV_KEYS=['seedsVar','potCrafts','potAt','potMatAt','potNames','roomNames','roomCount','controlDesk','lampCount','genCount','genLvl2Count','genLvl3Count','dripCount','dripPlusCount','dripElecCount','dripOn','dripTierAt','lampLvlAt','lampOnArr','genLvlRoom','energyRoom','tankRoom','tankLevelRoom'];
/* typed base seeds: one pool per variety, per plantation */
function totalBaseSeeds(){ const sv=S.inv.seedsVar||{}; return Object.keys(sv).reduce((a,k)=>a+(sv[k]||0),0); }
function addBaseSeed(type,n){ if(!type)type='Generic'; S.inv.seedsVar[type]=(S.inv.seedsVar[type]||0)+(n||1); }
function consumeBaseSeed(prefer){ // matching type first, then Generic, then the most abundant
  const sv=S.inv.seedsVar;
  const pick=(sv[prefer]||0)>0?prefer:((sv.Generic||0)>0?'Generic':Object.keys(sv).sort((a,b)=>(sv[b]||0)-(sv[a]||0)).find(k=>sv[k]>0));
  if(!pick||(sv[pick]||0)<=0)return null;
  sv[pick]--; return pick;
}
function baseTypeOf(p){ if(!p||p.strain||p.hybrid)return null; return p.vtype||(p.normie?p.normie.type:'Generic'); }
/* each plantation only accepts seeds aligned with ITS collection (Generic sprout allowed everywhere) */
function typeAllowed(ty){ return ty==='Generic'||C().types.includes(ty); }
function strainAllowed(id){ const s=S.strains[id]; return !!s&&(s.comm||'normies')===S.comm; }
function hybridAllowed(){ return S.comm==='normies'; } // market hybrids are Normie-ecosystem seeds
function anySpecialSeed(){ // only specials plantable in THIS plantation count
  return (hybridAllowed()&&Object.keys(HYBRIDS).some(k=>S.inv[k]>0))||
         Object.keys(S.strains).some(id=>strainAllowed(id)&&(S.inv.strainSeeds[id]||0)>0);
}
function plantableBaseSeeds(){ const sv=S.inv.seedsVar||{}; return Object.keys(sv).filter(k=>sv[k]>0&&typeAllowed(k)); }
function canReplant(){ return plantableBaseSeeds().length>0||anySpecialSeed(); }
function snapshotGarden(){
  const g={plants:S.plants,sel:S.sel,normie:S.normie,lastTs:Date.now()};
  for(const k of GARDEN_INV_KEYS) g[k]=S.inv[k];
  return g;
}
function freshGarden(){
  return {plants:[null],sel:0,normie:null,lastTs:Date.now(),
          seedsVar:{Generic:1},potCrafts:0,potAt:[true,false,false,false,false,false,false,false,false],potMatAt:['ground',...Array(8).fill('clay')],ceramicCount:0,ceramicBigCount:0,terraCount:0,plasticCount:0,concreteCount:0,selfWaterCount:0,roomCount:0,controlDesk:0,lampCount:0,lampLvl2Count:0,lampLvl3Count:0,genCount:0,genLvl2Count:0,genLvl3Count:0,dripCount:0,dripPlusCount:0,dripElecCount:0,dripOn:true,
          genLvlRoom:[0,0,0],energyRoom:[0,0,0],tankRoom:[false,false,false],tankLevelRoom:[0,0,0],tankCount:0,
          dripTierAt:[0,0,0,0,0,0,0,0,0],lampLvlAt:Array(9).fill(0),lampOnArr:Array(9).fill(true),
          genLvlAt:Array(9).fill(0),energyAt:Array(9).fill(0)};
}
function loadGarden(g){
  curRoom=0; controlView=false; _navSig='';
  S.plants=Array.isArray(g.plants)?g.plants:[null]; S.sel=g.sel||0; S.normie=g.normie||null;
  for(const k of GARDEN_INV_KEYS) if(g[k]!==undefined) S.inv[k]=g[k];
}
function switchComm(key){
  if(key===S.comm||!COMMUNITIES[key])return;
  S.gardens=S.gardens||{};
  S.gardens[S.comm]=snapshotGarden();               // park the current plantation
  const g=S.gardens[key]||freshGarden();
  const dtH=Math.max(0,(Date.now()-(g.lastTs||Date.now()))/3600000*timeMult());
  loadGarden(g); S.comm=key; delete S.gardens[key]; // the active garden lives on S directly
  if(dtH>0&&S.plants.some(p=>p)) advance(dtH);      // catch the parked garden up with lost time
  lastRes='';
  applyAccent(); save(); renderWorkshop(); renderVarieties(); updateCommUI();
  if(S.plants.some(p=>p)){ showScreen('garden'); render(true); }
  else { showScreen('start'); render(true); }
}
function fillCommSelects(){ // one dropdown in the header, the same one on the start screen — both list every collection
  for(const id of ['commSel','commSelStart']){
    const el=$(id); if(!el)continue;
    el.innerHTML=Object.keys(COMMUNITIES).map(k=>'<option value="'+k+'">'+COMMUNITIES[k].ic+' '+esc(COMMUNITIES[k].name)+'</option>').join('');
    el.value=S.comm;
  }
}
function updateCommUI(){
  applyCommTheme();
  fillCommSelects();
  $('tCommLbl').textContent=T().commLbl;
  $('tNoNormie').textContent=T().noTokC(C().token);
  $('tPlantP1').innerHTML=T().plantP1C(C().token,C().idMax);
  $('tRandomHint').textContent=T().randomHintC(Object.keys(commSnapshot()).length,C().token,C().apiHost);
  $('btnSwitch').textContent=T().switchTok(C().token);
  $('btnResetGarden').textContent=T().resetBtn(C().name);
  $('resetMsg').textContent=''; resetArmed=0; // switching community disarms a pending reset
  $('normieId').placeholder='n° 0-'+C().idMax;
  $('tPlantTitle').textContent=T().plantTitleC(C().token);
  $('tVarTitle').textContent=T().varTitleC(C().types.length);
}
function vOf(p){
  if(p&&p.strain) return S.strains[p.strain]||VARIETIES.Generic;
  if(p&&p.hybrid) return VARIETIES[p.hybrid]||VARIETIES.Generic;
  if(p&&p.vtype) return VARIETIES[p.vtype]||VARIETIES.Generic; // the planted seed decides the variety
  return VARIETIES[p&&p.normie?p.normie.type:'Generic']||VARIETIES.Generic;
}
function vName(v){ return v.name==='commonSprout'?T().commonSprout:v.name; }
function sizeF(p){
  if(p&&p.strain) return 1.1;  // strains: fixed size
  if(p&&p.hybrid) return 1.15; // hybrids: fixed generous size
  const px=p&&p.normie?p.normie.px:800;
  const mx=(p&&p.normie&&p.normie.pxMax)||1600; // each community normalizes its own pixel scale
  return 0.6+0.9*clamp(px/mx,0,1);
}
function tokLbl(n){ return (COMMUNITIES[(n&&n.comm)||'normies']||COMMUNITIES.normies).token; }
function buffActive(p){ return p&&!p.dead&&!p.cut&&p.buffUntil>p.gH; }
function upgradeMult(p,i){
  let m=(p&&p.soil?1.25:1)*(buffActive(p)?p.buffMult:1)*potGrowth(p,i); // pot material counts inside the ×3 budget
  if(typeof i==='number'&&lampActive(i)) m*=lampGrow(lampLvl(i));
  return Math.min(m,UPGRADE_CAP); // see BALANCE INVARIANT next to UPGRADE_CAP
}
function speedMult(p,i){ return vOf(p).speed*upgradeMult(p,i); }
function hydCapH(p){ // COHERENCE RULE: whatever speeds growth (variety speed, soil, fertilizer) dries the plant just as much faster — and a lamp dries even more
  if(!p) return HYD_CAP_H;
  const i=S.plants.indexOf(p);
  const boost=(vOf(p).speed||1)*(p.soil?1.25:1)*(buffActive(p)?p.buffMult:1)*(i>=0?potGrowth(p,i):1);
  let cap=HYD_CAP_H*(vOf(p).hydMult||1)/boost;
  if(i>=0){ cap*=potMat(i).hyd; if(lampActive(i)) cap*=lampDry(lampLvl(i)); } // the pot's own water reserve
  return cap*(S.inv.tools.bucketMetal?1.10:1);
}
/* ── Breeding lab: cross two varieties → procedural strain (near-infinite combinations) ── */
const BREED_FEE=25, BREED_CHANCE=0.65;
function parentVar(key){ return key&&key.startsWith('s_') ? S.strains[key] : VARIETIES[key]; }
function parentSeedOk(key){ // one seed of the parent's own kind per attempt
  return key&&key.startsWith('s_') ? (S.inv.strainSeeds[key]||0)>0 : (S.inv.seedsVar[key]||0)>0;
}
function consumeParentSeed(key){
  if(key.startsWith('s_')) S.inv.strainSeeds[key]--; else S.inv.seedsVar[key]--;
}
function breedParents(){ // ONLY seeds owned AND aligned with the active collection
  const out=Object.keys(S.inv.seedsVar).filter(k=>S.inv.seedsVar[k]>0&&VARIETIES[k]&&typeAllowed(k));
  for(const id of Object.keys(S.strains)) if(strainAllowed(id)&&(S.inv.strainSeeds[id]||0)>0) out.push(id);
  return out;
}
function hexBlend(a,b,t,rng){
  const pa=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16));
  const pb=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));
  return '#'+pa.map((v,i)=>{
    const m=Math.round(v*(1-t)+pb[i]*t+(rng()*40-20));
    return clamp(m,45,230).toString(16).padStart(2,'0');
  }).join('');
}
function strainName(a,b,rng){
  const cutA=a.name.slice(0,3+Math.floor(rng()*2));
  const nb=b.name; const cutB=nb.slice(nb.length-(3+Math.floor(rng()*3)));
  let nm=cutA+cutB.toLowerCase();
  nm=nm[0].toUpperCase()+nm.slice(1);
  let n=2, base=nm;
  while(Object.values(S.strains).some(s=>s.name===nm)) nm=base+' '+['II','III','IV','V','VI','VII'][Math.min(n++-2,5)];
  return nm;
}
function mkStrain(aKey,bKey){
  const a=parentVar(aKey), b=parentVar(bKey);
  const rng=mulberry32(((Date.now()&0xffffff)^Math.floor(Math.random()*0x7fffffff))>>>0);
  const pick=(x,y)=>rng()<0.5?x:y;
  const mut=v=>v*(0.85+rng()*0.45); // each stat inherited from one parent, then mutated ×0.85–1.30
  const speed   =+clamp(mut(pick(a.speed,b.speed)),1,2).toFixed(2); // 24h base floor / 4h full-gear ceiling
  const yld     =+clamp(mut(pick(a.yield,b.yield)),0.5,3).toFixed(2);
  const seedLuck=+clamp(mut(pick(a.seedLuck||0.08,b.seedLuck||0.08)),0.02,0.6).toFixed(2);
  const woodMult=+clamp(mut(pick(a.woodMult||1,b.woodMult||1)),0.5,3).toFixed(2);
  const hydMult =+clamp(mut(pick(a.hydMult||1,b.hydMult||1)),0.6,2).toFixed(2); // resistance: bigger water reserve
  const score=speed*0.8+yld+woodMult*0.7+hydMult*0.8+seedLuck*2;
  const rar= score>=4.9?'legendary' : score>=4.4?'epic' : score>=4.0?'rare' : score>=3.6?'uncommon' : 'common';
  const id='s_'+Date.now().toString(36)+Math.floor(rng()*46656).toString(36);
  return {id,strain:true,comm:S.comm,name:strainName(a,b,rng),accent:hexBlend(a.accent,b.accent,0.35+rng()*0.3,rng),
          ink:pick(a.ink,b.ink)||'#1d2417',speed,yield:yld,seedLuck,woodMult,hydMult,rar,
          parents:[a.name,b.name],harv:0};
}
function breed(aKey,bKey){
  const t=T();
  if(!S.inv.tools.breedlab) return {ok:false,msg:t.breedNeedLab};
  if(!parentVar(aKey)||!parentVar(bKey)) return {ok:false,msg:t.breedPick};
  if(!parentSeedOk(aKey)||(aKey===bKey?!(aKey.startsWith('s_')?(S.inv.strainSeeds[aKey]||0)>1:(S.inv.seedsVar[aKey]||0)>1):!parentSeedOk(bKey)))
    return {ok:false,msg:t.breedNoSeeds};
  if(S.inv.coins<BREED_FEE) return {ok:false,msg:t.breedNoCoins};
  consumeParentSeed(aKey); consumeParentSeed(bKey); S.inv.coins-=BREED_FEE;
  S.stats.breedTries=(S.stats.breedTries||0)+1;
  if(Math.random()>=BREED_CHANCE){ save(); return {ok:false,fail:true,msg:t.breedFail}; }
  const st=mkStrain(aKey,bKey);
  S.strains[st.id]=st;
  S.inv.strainSeeds[st.id]=(S.inv.strainSeeds[st.id]||0)+1;
  S.stats.strainsMade=(S.stats.strainsMade||0)+1;
  save();
  return {ok:true,strain:st,msg:t.breedOk(st.name,t.rar[st.rar])};
}
function plantStrain(id){
  ensurePlants();
  if(!strainAllowed(id))return; // strains grow only in their home plantation
  if((S.inv.strainSeeds[id]||0)<=0||!S.strains[id])return;
  const cur=S.plants[S.sel];
  if(!slotFree(cur))return;
  S.inv.strainSeeds[id]--;
  S.plants[S.sel]=makePlant(null,null,id);
  applyAccent(); save(); renderWorkshop(); render(true);
}
function strainStatLine(s){
  const t=T();
  return t.strainLine(s);
}
function flowerEveryH(p,i){ return FLOWER_BASE_H/vOf(p).yield; } // growth-hours; lamps accelerate via speedMult
function flowerCap(p,i){
  if(typeof i==='number'&&hasPot(i)&&potMat(i).cap) return potMat(i).cap; // in the ground: 2 flowers max, whatever the variety
  if(baseTypeOf(p)==='Generic') return 2; // common sprout: 2 flowers, no bonuses — playable, but a real token pays off
  return 4+Math.floor(2*sizeF(p))+(typeof i==='number'?potMat(i).flowers:0)+((p&&p.mutation==='double'&&p.mutRevealed)?1:0);
}
function flowerPx(p){ return Math.round(20*sizeF(p)*vOf(p).yield*(0.8+0.4*Math.random())); }
function progress(p){ return p?clamp(p.growthH/GROWTH_H,0,1):0; }
function hydration(p){ if(!p||p.dead||p.cut)return 0; return clamp(1-(p.gH-p.hydAtH)/hydCapH(p),0,1); }
function timeMult(){ return S.mode==='fast'?720:1; }
function hasBucket(){ return S.inv.tools.bucketWood||S.inv.tools.bucketMetal; }
function slotFree(p){ return !p||p.cut; } // a dead plant blocks its pot until uprooted

/* ── Journal, almanac, daily quests ── */
function jlog(p,k,v){
  if(!p.journal)p.journal=[];
  p.journal.push({d:Math.floor(p.gH/24),k,v,ts:Date.now()});
  if(p.journal.length>20)p.journal.shift();
}
function varKey(p){ return p.strain?p.strain:(p.hybrid?p.hybrid:(p.vtype||(p.normie?p.normie.type:'Generic'))); }
function almanacSee(p){
  const key=varKey(p)+':'+p.mutation;
  if(!S.almanac.seen[key]) S.almanac.seen[key]=true;
}
function todayStr(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function weekStr(){ const d=new Date(); const on=new Date(d.getFullYear(),0,1); return d.getFullYear()+'-w'+Math.floor(((d-on)/86400000+on.getDay())/7); }
function dayRng(str){ let h=2166136261; for(const c of str){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return mulberry32(h>>>0); }
function ensureDaily(){
  const today=todayStr();
  if(S.daily&&S.daily.date===today)return;
  // rollover: settle yesterday's streak
  if(S.daily){
    const counted=S.daily.done&&S.daily.done.every(x=>x);
    if(counted){ S.streak.count++; S.streak.lastCounted=S.daily.date; }
    else if(S.streak.count>0){
      if(S.streak.joker>0){ S.streak.joker--; }
      else S.streak.count=0;
    }
  }
  if(S.streak.jokerWeek!==weekStr()){ S.streak.joker=1; S.streak.jokerWeek=weekStr(); } // weekly joker refill
  const rng=dayRng(today);
  const pool=QUEST_POOL.slice();
  const picks=[];
  while(picks.length<3&&pool.length){ picks.push(pool.splice(Math.floor(rng()*pool.length),1)[0].id); }
  S.daily={date:today, quests:picks, prog:{}, done:[false,false,false], rewarded:[false,false,false], allDone:false};
  save();
}
function questBump(key,n){
  ensureDaily();
  S.stats[key]=(S.stats[key]||0)+n; // lifetime counters feed the badges
  const d=S.daily;
  d.prog[key]=(d.prog[key]||0)+n;
  let changed=false;
  d.quests.forEach((qid,i)=>{
    if(d.done[i])return;
    const q=QUEST_POOL.find(x=>x.id===qid);
    if(q.key===key&&(d.prog[key]||0)>=q.target){
      d.done[i]=true;
      if(!d.rewarded[i]){ d.rewarded[i]=true; S.inv.px+=QUEST_REWARD_PX; }
      changed=true;
    }
  });
  if(!d.allDone&&d.done.every(x=>x)){ d.allDone=true; addBaseSeed((S.normie&&S.normie.type)||'Generic',QUEST_ALL_SEED); S.stats.perfectDays=(S.stats.perfectDays||0)+1; }
  if(changed){ save(); if(typeof renderQuests==='function')renderQuests(); }
}
/* ── Simulation (game hours) ── */
function die(p){ if(!p.dead){ p.dead=true; jlog(p,'died'); S.almanac.plantsLost++; } } // rewards come from uprooting, not from dying
function updateWorld(dH){
  const inv=S.inv;
  if(false){ // (coal generators now store energy: fuel is paid at recharge time)
    while(false){
    }
  }
}
function dripActive(){ return S.inv.dripCount>0&&S.inv.tankCount>0&&S.inv.dripOn!==false; }
function dripMultAt(i){ const t=dripTier(i); return t>=3?0.5:(t>=2?0.7:1); } // each drip line keeps its own upgrade level
function dripTierIcon(){ return S.inv.dripElecCount>0?'🚰':(S.inv.dripPlusCount>0?'💦':'💧'); }
function advance(dH){
  updateWorld(dH);
  ensurePlants();
  // drip irrigation is PER POT: only pots fitted with a drip are served,
  // and the shared tank drains once per served plant (3 plants → 3× faster)
  // electric pump: while generators run, it refills the tank from the river (1h of water per game hour)
  // energy: each powered device drains ITS pot's battery
  for(let r=0;r<roomsCount();r++){
    if(genLvlRoomOf(r)<=0)continue;
    let draw=0, pump=false;
    const rb=r*ROOM_SLOTS;
    for(let i=rb;i<rb+ROOM_SLOTS;i++){ if(!hasPot(i))continue;
      if(lampAt(i)&&lampOn(i)&&energyRoomOf(r)>0) draw+=lampDraw(lampLvl(i));
      if(dripTier(i)>=3&&energyRoomOf(r)>0){ draw+=PUMP_DRAW; pump=true; }
    }
    if(draw>0) S.inv.energyRoom[r]=Math.max(0,energyRoomOf(r)-draw*dH);
    if(pump&&tankAtRoom(r)) S.inv.tankLevelRoom[r]=Math.min(TANK_CAP_H,tankLvlRoom(r)+dH);
  }
  if(dripActive()){
    for(let r=0;r<roomsCount();r++){
      if(!tankAtRoom(r)||tankLvlRoom(r)<=0)continue;
      const rb=r*ROOM_SLOTS, served=[];
      for(let i=rb;i<rb+ROOM_SLOTS;i++){ if(!hasPot(i))continue;
        const p=S.plants[i];
        if(p&&!p.dead&&!p.cut&&dripAt(i)) served.push(i);
      }
      if(served.length>0){
        const total=served.reduce((a,i)=>a+dripMultAt(i),0); // each line drinks at its own upgrade level
        const covered=Math.min(dH,tankLvlRoom(r)/total);
        S.inv.tankLevelRoom[r]=Math.max(0,tankLvlRoom(r)-covered*total);
        served.forEach(i=>{ const p=S.plants[i]; p.hydAtH=Math.max(p.hydAtH,p.gH+covered); });
      }
    }
  }
  S.plants.forEach((p,i)=>{ if(p) advancePlant(p,i,dH); });
}
function refillTank(r){
  if(!tankAtRoom(r))return;
  S.inv.tankLevelRoom[r]=TANK_CAP_H;
  save(); renderWorkshop(); render(true);
}
function advancePlant(p,i,dH){
  if(p.dead||p.cut){ p.gH+=dH; return; }
  let rem=dH;
  while(rem>1e-9){
    const dryAt=p.hydAtH+hydCapH(p);
    if(p.gH<dryAt-1e-9){
      let step=Math.min(rem,dryAt-p.gH);
      if(p.buffUntil>p.gH) step=Math.min(step,p.buffUntil-p.gH);
      growStep(p,i,step); p.gH+=step; rem-=step;
    }else{
      const deathAt=dryAt+WITHER_GRACE_H;
      if(p.gH>=deathAt-1e-9){ die(p); p.gH+=rem; return; }
      const step=Math.min(rem,deathAt-p.gH);
      p.gH+=step; rem-=step;
      if(p.gH>=deathAt-1e-9){ die(p); p.gH+=rem; return; }
    }
  }
}
function growStep(p,i,h){
  const before=p.growthH/GROWTH_H;
  p.growthH=Math.min(GROWTH_H,p.growthH+h*speedMult(p,i));
  const after=p.growthH/GROWTH_H;
  if(before<0.25&&after>=0.25){
    jlog(p,'leaf');
    if(!p.mutRevealed){ p.mutRevealed=true; almanacSee(p); if(p.mutation!=='none') jlog(p,'mutation',p.mutation); }
  }
  if(before<BLOOM_P&&after>=BLOOM_P) jlog(p,'bloom');
  if(p.growthH/GROWTH_H>=BLOOM_P){
    p.bloomAccH+=h*speedMult(p,i); // flowers tick on the growth clock: upgrades speed them up too
    const F=flowerEveryH(p,i);
    while(p.bloomAccH>=F){
      p.bloomAccH-=F;
      if(p.pending.length<flowerCap(p,i)) p.pending.push({px:flowerPx(p)});
      else p.bloomAccH=Math.min(p.bloomAccH,F);
    }
  }
}

/* ── Actions ── */
function makePlant(normie,hybrid,strain,vtype){
  let soil=false;
  if(S.inv.soil>0){ S.inv.soil--; soil=true; }
  questBump('plant',1);
  const o={normie:(hybrid||strain)?null:(normie||null), hybrid:hybrid||null, strain:strain||null,
          vtype:(hybrid||strain)?null:(vtype||(normie?normie.type:'Generic')),
          seed:(normie&&normie.id!=null?normie.id:Math.floor(Math.random()*99999))+1,
          gH:0, growthH:0, hydAtH:0, bloomAccH:0, pending:[], dead:false, cut:false,
          soil, buffUntil:0, buffMult:1, luckBonus:0,
          mutation:rollMutation(), mutRevealed:false, name:null, journal:[],
          lastHarvest:null, harvested:0, plantedTs:Date.now()};
  o.journal.push({d:0,k:'planted',v:vName(vOf(o))}); // the journal names the planted seed
  o.hydAtH=-0.5*hydCapH(o); // every plant starts at 50% hydration: the first watering visibly acts
  return o;
}
function plantNow(normie){ // from the start screen: selected pot if free, else first free pot
  ensurePlants();
  if(totalBaseSeeds()<=0){ const m=$('lookupMsg'); m.className='msg err'; m.textContent=T().noSeed; return; }
  let idx=slotFree(S.plants[S.sel])?S.sel:S.plants.findIndex((p,i)=>hasPot(i)&&slotFree(p));
  if(idx<0){ const m=$('lookupMsg'); m.className='msg err'; m.textContent=T().noFreePot; return; }
  S.normie=normie;
  consumeBaseSeed(normie?normie.type:'Generic'); // the token converts the seed: variety follows the token
  S.plants[idx]=makePlant(normie);
  S.sel=idx;
  applyAccent(); showScreen('garden'); save(); render(true);
  if(!S.tutoSeen) setTimeout(startTuto,350); // first plant in the pot → quick guided tour
}
function plantNormalHere(){ // reuse the pot's token, consuming a matching seed when possible
  ensurePlants();
  const cur=S.plants[S.sel];
  if(!slotFree(cur)||totalBaseSeeds()<=0)return;
  const normie=(cur&&cur.normie)||S.normie;
  consumeBaseSeed(normie?normie.type:'Generic');
  S.plants[S.sel]=makePlant(normie);
  applyAccent(); save(); render(true);
}
function plantTypedSeed(type){ // an explicitly chosen seed: ITS variety grows (token keeps the size)
  ensurePlants();
  if(!typeAllowed(type))return; // seed from another collection: not plantable here
  const cur=S.plants[S.sel];
  if(!slotFree(cur)||(S.inv.seedsVar[type]||0)<=0)return;
  S.inv.seedsVar[type]--;
  const normie=(cur&&cur.normie)||S.normie;
  S.plants[S.sel]=makePlant(normie,null,null,type);
  applyAccent(); save(); renderWorkshop(); render(true);
  showToast('✓ '+vName(VARIETIES[type]||VARIETIES.Generic));
}
let seedPickMode=false; // replant opens the vault as a picker: click a seed → it is planted
function replant(){ // choose which seed goes into the selected pot
  ensurePlants();
  const cur=S.plants[S.sel];
  if(!slotFree(cur))return;
  const baseTypes=plantableBaseSeeds();
  if(baseTypes.length===1&&!anySpecialSeed()){ plantNormalHere(); return; } // single option: plant directly
  if(!canReplant())return;
  seedPickMode=true; seedPage=0; renderSeedVault(); $('seedOverlay').classList.add('on');
}
function openPicker(){
  const t=T(), box=$('pickerList'); box.innerHTML='';
  $('pickerTitle').textContent=t.pickerTitle;
  const cur=S.plants[S.sel];
  const normie=(cur&&cur.normie)||S.normie;
  const nv=VARIETIES[normie?normie.type:'Generic']||VARIETIES.Generic;
  const nLbl=normie?(tokLbl(normie)+' #'+normie.id+' · '+vName(nv)):vName(VARIETIES.Generic);
  // typed base seeds — only seeds aligned with THIS collection are offered
  const baseTypes=plantableBaseSeeds();
  if(!baseTypes.length){
    const d0=document.createElement('div'); d0.className='recipe locked';
    d0.innerHTML='<span class="ic">🌱</span><span class="mid"><div class="nm">'+t.pickerNormie(nLbl)+'</div>'+
      '<div class="fx">'+t.pickerNoSeed+'</div></span>';
    box.appendChild(d0);
  }
  for(const ty of baseTypes){
    const v=VARIETIES[ty]||VARIETIES.Generic;
    const match=normie&&normie.type===ty;
    const d1=document.createElement('div'); d1.className='recipe';
    d1.innerHTML='<span class="ic">🌱</span><span class="mid"><div class="nm"><span style="color:'+v.accent+'">'+vName(v)+'</span>'+
      (match?' <span class="own">'+t.pickerMatch+'</span>':'')+'</div>'+
      '<div class="fx">'+t.varLine(ty,v)+' · ×'+S.inv.seedsVar[ty]+'</div></span>';
    d1.addEventListener('click',()=>{ closePicker(); plantTypedSeed(ty); });
    box.appendChild(d1);
  }
  // hybrids (Normie ecosystem only)
  for(const kind of Object.keys(HYBRIDS)){
    if(!hybridAllowed())break;
    if(S.inv[kind]<=0)continue;
    const hv=VARIETIES[HYBRIDS[kind].v];
    const d=document.createElement('div'); d.className='recipe';
    d.innerHTML='<span class="ic">⚗️</span><span class="mid"><div class="nm"><span style="color:'+hv.accent+'">'+vName(hv)+'</span></div>'+
      '<div class="fx">'+t.hyb[kind]+' · ×'+S.inv[kind]+'</div></span>';
    d.addEventListener('click',()=>{ closePicker(); plantHybrid(kind); });
    box.appendChild(d);
  }
  // custom strains (from the breeding lab — only those bred in this plantation)
  for(const id of Object.keys(S.strains)){
    if(!strainAllowed(id)||(S.inv.strainSeeds[id]||0)<=0)continue;
    const sv=S.strains[id];
    const d=document.createElement('div'); d.className='recipe';
    d.innerHTML='<span class="ic">🧬</span><span class="mid"><div class="nm"><span style="color:'+sv.accent+'">'+sv.name+'</span> <span class="own">'+t.rar[sv.rar]+'</span></div>'+
      '<div class="fx">'+t.strainLine(sv)+' · ×'+S.inv.strainSeeds[id]+'</div></span>';
    d.addEventListener('click',()=>{ closePicker(); plantStrain(id); });
    box.appendChild(d);
  }
  // pick another normie
  const d2=document.createElement('div'); d2.className='recipe';
  d2.innerHTML='<span class="ic">🔁</span><span class="mid"><div class="nm">'+t.pickerChange+'</div></span>';
  d2.addEventListener('click',()=>{ closePicker(); switchNormie(); });
  box.appendChild(d2);
  $('pickerOverlay').classList.add('on');
}
function closePicker(){ $('pickerOverlay').classList.remove('on'); }
function waterOne(p,target){
  const wasDry=hydration(p)===0&&!p.dead&&!p.cut;
  const cap=hydCapH(p);
  p.hydAtH=Math.max(p.hydAtH,p.gH-(1-target)*cap);
  p.notif10=false; // re-arm the thirst notification
  if(wasDry&&hydration(p)>0) jlog(p,'saved');
}
/* ── Desktop notification at 10% hydration ── */
function ensureNotifPermission(){
  try{ if('Notification' in window&&Notification.permission==='default') Notification.requestPermission(); }catch(e){}
}
function checkThirst(){
  const t=T();
  const canNotif=('Notification' in window)&&Notification.permission==='granted';
  const warn=msg=>{ showToast(msg); if(canNotif){ try{ new Notification('PxGrove',{body:msg.replace(/<[^>]*>/g,'')}); }catch(e){} } };
  S.plants.forEach((p,i)=>{
    if(!p||p.dead||p.cut)return;
    const h=hydration(p), nm=potName(i)+' \u00b7 '+vName(vOf(p));
    if(h<=0&&!p.notif0){ p.notif0=true; p.notif10=true; warn(t.notifDry(nm,i)); }
    else if(h<=0.10&&!p.notif10){ p.notif10=true; warn(t.notifBody(nm,i)); }
    if(h>0.2&&p.notif10&&h>0){ p.notif10=false; }
    if(h>0&&p.notif0){ p.notif0=false; }
  });
}
function waterModeEffective(){ // the selected watering system, downgraded if not owned
  const m=S.inv.waterMode;
  if(m==='arrosoir'&&S.inv.tools.arrosoir)return m;
  if(m==='bucketMetal'&&S.inv.tools.bucketMetal)return m;
  if(m==='bucketWood'&&S.inv.tools.bucketWood)return m;
  return 'hand';
}
function setWaterMode(m){
  if(m!=='hand'&&!S.inv.tools[m])return;
  S.inv.waterMode=m;
  save(); renderSidebar(); renderHotbar(); render(true);
  showToast('✓ '+(m==='hand'?T().equipHands:T().recipes[m].nm));
}
function water(){
  const mode=waterModeEffective();
  if(mode==='arrosoir'){ // watering can: every pot at once, full
    let any=false;
    S.plants.forEach(p=>{ if(p&&!p.dead&&!p.cut){ waterOne(p,1); any=true; } });
    if(any){ questBump('water',1); save(); render(true); }
    return;
  }
  const p=selPlant(); if(!p||p.dead||p.cut)return;
  waterOne(p,mode==='hand'?HAND_FILL:1);
  questBump('water',1);
  save(); render(true);
}
function harvest(){
  const p=selPlant(); if(!p||p.cut)return;
  if(p.dead){ // a dead plant is "harvested" for its dead wood: a few units (1/3 of a normal cut) + the seed back — same payout as uprooting
    const v=vOf(p), wood=Math.max(2,Math.round(woodYield(p)*(v.woodMult||1)*UPROOT_WOOD_RATIO));
    if(!v.sterile){ if(p.strain) S.inv.strainSeeds[p.strain]=(S.inv.strainSeeds[p.strain]||0)+1; else addBaseSeed(baseTypeOf(p),1); }
    S.inv.wood+=wood; S.stats.woodEarned=(S.stats.woodEarned||0)+wood;
    S.plants[S.sel]=null;
    stagePop(T().deadWoodNotice(vName(v),wood,v.sterile?0:1));
    save(); render(true); renderResources(true); renderWorkshop();
    return;
  }
  if(!p.pending.length)return;
  const got=p.pending.reduce((a,f)=>a+f.px,0);
  const tool=S.inv.equip;
  // gloves: chance to pick the flowers without cutting the plant
  if(tool==='gloves'&&S.inv.tools.gloves&&Math.random()<glovesChance()){
    S.inv.px+=got;
    p.harvested+=p.pending.length; p.pending=[];
    p.gentleMsg={px:got,until:Date.now()+7000};
    stagePop(T().gentleNotice(vName(vOf(p)),got));
    jlog(p,'gentle',got);
    S.almanac.totalHarvests++; if(got>S.almanac.bestHarvestPx)S.almanac.bestHarvestPx=got;
    questBump('harvest',1); questBump('px',got);
    save(); render(true); renderResources(true);
    maybeTuto2();
    return;
  }
  const v=vOf(p);
  const woodMult=((tool==='shears'&&S.inv.tools.shears)?shearsMult():1)*(v.woodMult||1);
  let wood=Math.round(woodYield(p)*woodMult);
  let firstWood=false;
  if(!S.inv.firstWoodGiven&&progress(p)>=1){ // FIRST-RUN INVARIANT: the first cut at 100% maturity ALWAYS yields exactly 21 wood (Workbench costs 20)
    wood=21; firstWood=true; S.inv.firstWoodGiven=true;
  }
  const sterile=!!v.sterile;
  let dbl=!sterile&&Math.random()<(v.seedLuck+(p.luckBonus||0));
  let secondSeed=false;
  S.inv.cuts=(S.inv.cuts||0)+1;
  if(!sterile&&!S.inv.secondSeedGiven&&S.inv.cuts===2){ dbl=true; secondSeed=true; S.inv.secondSeedGiven=true; } // SECOND-RUN INVARIANT: the 2nd cut ALWAYS returns 2 seeds of the same variety — one for the pot, one to try the ground
  const seeds=sterile?0:(dbl?2:1);
  S.inv.px+=got; S.inv.wood+=wood;
  if(p.strain){ S.inv.strainSeeds[p.strain]=(S.inv.strainSeeds[p.strain]||0)+seeds; if(S.strains[p.strain])S.strains[p.strain].harv=(S.strains[p.strain].harv||0)+1; }
  else if(seeds>0) addBaseSeed(baseTypeOf(p),seeds); // the seed comes back typed as the harvested variety
  S.stats.woodEarned=(S.stats.woodEarned||0)+wood;
  if(p.hybrid) S.stats.hybridHarvests=(S.stats.hybridHarvests||0)+1;
  p.harvested+=p.pending.length; p.pending=[];
  p.cut=true; p.lastHarvest={px:got,wood,seeds,dbl,gentle:false};
  if(firstWood) showToast(T().firstWoodToast);
  stagePop(T().cutNotice(vName(v),got,wood,seeds,dbl));
  if(secondSeed) setTimeout(()=>showToast(T().secondSeedToast),1200);
  jlog(p,'harvest',got);
  S.almanac.totalHarvests++; if(got>S.almanac.bestHarvestPx)S.almanac.bestHarvestPx=got;
  maybeTuto2();
  questBump('harvest',1); questBump('px',got);
  save(); render(true); renderResources(true);
  if(S.inv.secondSeedGiven) maybeTuto6();
}
function plantHybrid(kind){ // consumes a hybrid seed, not a normal one
  ensurePlants();
  if(!hybridAllowed())return;
  const h=HYBRIDS[kind];
  if(!h||S.inv[kind]<=0)return;
  const cur=S.plants[S.sel];
  if(!slotFree(cur))return;
  S.inv[kind]--;
  S.plants[S.sel]=makePlant(null,h.v);
  applyAccent(); save(); renderWorkshop(); render(true);
}
function uproot(){ // free the pot at ANY time — switch seeds whenever you like
  const p=selPlant(); if(!p)return;
  const v=vOf(p);
  if(!p.cut){ // a cut plant already paid out at harvest: uprooting it just clears the pot
    const wood=Math.round(woodYield(p)*(v.woodMult||1)*UPROOT_WOOD_RATIO);
    if(!v.sterile){ if(p.strain) S.inv.strainSeeds[p.strain]=(S.inv.strainSeeds[p.strain]||0)+1; else addBaseSeed(baseTypeOf(p),1); }
    S.inv.wood+=wood;
    S.stats.woodEarned=(S.stats.woodEarned||0)+wood;
  }
  S.plants[S.sel]=null;
  save(); render(true); renderResources(true);
}
function research(key){ // key = a research block id
  const rs=RESEARCH_BLOCKS.find(b=>b.id===key); if(!rs)return;
  if(blockDone(key))return;
  if(!tierOpen(rs.tier))return;
  if(S.inv.coins<rs.cost)return;
  S.inv.coins-=rs.cost; S.inv.research[key]=true;
  save(); renderWorkshop(); lastRes=''; renderResources(true); render(true);
  showToast('🔬 '+T().blocks[key].nm);
}
function tryCraft(keysIn){ // ingredient KINDS only — quantities never matter at the try table
  const keys=[...new Set(keysIn)];
  if(!keys.length)return {ok:false,reason:'empty'};
  if(!S.inv.tools.workbench)return {ok:false,reason:'bench'};
  for(const k of keys){ if((S.inv[k]||0)<1)return {ok:false,reason:'stock'}; } // you experiment with real items
  const matches=RECIPES.filter(r=>{
    if(!r.cost)return false;
    const ck=Object.keys(r.cost);
    return ck.length===keys.length&&ck.every(k=>keys.includes(k));
  }).sort((a,b)=>a.tier-b.tier);
  questBump('try',1);
  if(!matches.length)return {ok:false,reason:'nomatch'};
  // several recipes can share the same ingredient set (e.g. the serums): reveal them one by one
  const target=matches.find(r=>!recipeVisible(r))||matches[0];
  if(target.needs&&!hasThing(target.needs))return {ok:false,reason:'needs',recipe:target};
  const ownedAlready=((target.kind==='tool'||target.kind==='machine')&&S.inv.tools[target.id])||
                     (target.kind==='multi'&&S.inv[target.cnt]>=multiMax(target));
  if(ownedAlready&&recipeVisible(target))return {ok:false,reason:'owned',recipe:target};
  if(!discovered(target.id)) S.inv.discovered.push(target.id);
  if(canCraft(target)){ craft(target); return {ok:true,crafted:true,recipe:target}; }
  return {ok:true,crafted:false,recipe:target}; // revealed, not yet affordable
}
function cycleEquip(){
  const opts=['hands'];
  if(S.inv.tools.shears)opts.push('shears');
  if(S.inv.tools.gloves)opts.push('gloves');
  const i=opts.indexOf(S.inv.equip);
  S.inv.equip=opts[(i+1)%opts.length];
  save(); renderWorkshop(); render(true);
}
/* pot-installed gear: crafting one asks WHICH pot it goes on */
function cumulCost(ids){ // total materials sunk into an item + its upgrades
  const total={};
  for(const id of ids){ const r=RECIPES.find(x=>x.id===id); if(!r)continue;
    for(const k in r.cost) total[k]=(total[k]||0)+r.cost[k]; }
  return total;
}
function refundCost(total){ // recycling pays back HALF the materials
  const back={};
  for(const k in total){ const n=Math.floor(total[k]/2); if(n>0){ back[k]=n; S.inv[k]=(S.inv[k]||0)+n; } }
  return back;
}
const POT_MAT_RIDS=['potUp','potBig','potTerra','potPlastic','potConcrete','potSelfWater'];
function placeNewPot(i,mat){ S.inv.potAt[i]=true; S.inv.potMatAt[i]=mat; S.plants[i]=null; S.sel=i; curRoom=roomOf(i); _navSig=''; applyAccent(); }
function matEquip(mat,ic,okExisting){ // a pot material: new pot on a free slot, or change of material on an existing pot
  return {ok:i=>i<potSlots()&&(!hasPot(i)||(okExisting?okExisting(i):potType(i)!==mat)),
          apply:i=>{ if(!hasPot(i)) placeNewPot(i,mat); else S.inv.potMatAt[i]=mat; }, ic};
}
const POT_EQUIP={
  drip:      {ok:i=>dripTier(i)===0, apply:i=>{S.inv.dripTierAt[i]=1;}, ic:'💧',
              repl:i=>dripTier(i)>0, recycle:i=>{ const tval=dripTier(i); S.inv.dripTierAt[i]=0; return refundCost(cumulCost(['drip','dripPlus','dripElec'].slice(0,tval))); }},
  dripPlus:  {ok:i=>dripTier(i)===1, apply:i=>{S.inv.dripTierAt[i]=2;}, ic:'💦'},
  dripElec:  {ok:i=>dripTier(i)===2, apply:i=>{S.inv.dripTierAt[i]=3;}, ic:'🚰'},
  lamp:      {ok:i=>!lampAt(i),      apply:i=>{S.inv.lampLvlAt[i]=1;}, ic:'💡',
              repl:i=>lampAt(i), recycle:i=>{ const l=lampLvl(i); S.inv.lampLvlAt[i]=0; return refundCost(cumulCost(['lamp','lampUp2','lampUp3'].slice(0,l))); }},
  lampUp2:   {ok:i=>lampLvl(i)===1,  apply:i=>{S.inv.lampLvlAt[i]=2;}, ic:'🔆'},
  lampUp3:   {ok:i=>lampLvl(i)===2,  apply:i=>{S.inv.lampLvlAt[i]=3;}, ic:'🌟'},
  pot:       {ok:i=>!hasPot(i)||potType(i)==='ground', apply:i=>{ if(!hasPot(i)) placeNewPot(i,'clay'); else S.inv.potMatAt[i]='clay'; }, ic:'🪴'},
  potUp:     matEquip('ceramic','🏺', i=>potType(i)!=='ceramic'&&potType(i)!=='ceramicBig'),
  potBig:    matEquip('ceramicBig','🏺', i=>potType(i)==='ceramic'), // on an existing pot: needs ceramic first; on a free slot: placed directly
  potTerra:  matEquip('terracotta','🟠'),
  potPlastic:matEquip('plastic','🟢'),
  potConcrete:matEquip('concrete','⬜'),
  potSelfWater:matEquip('selfWater','🫗'),
  generator: {ok:i=>genLvl(i)===0,   apply:i=>{S.inv.genLvlRoom[roomOf(i)]=1;},   ic:'⚡',
              repl:i=>genLvl(i)>0, recycle:i=>{ const r=roomOf(i), l=genLvlRoomOf(r); S.inv.genLvlRoom[r]=0; S.inv.energyRoom[r]=0; return refundCost(cumulCost(['generator','genUp2','genUp3'].slice(0,l))); }},
  genUp2:    {ok:i=>genLvl(i)===1,   apply:i=>{S.inv.genLvlRoom[roomOf(i)]=2;},   ic:'🔋'},
  genUp3:    {ok:i=>genLvl(i)===2,   apply:i=>{S.inv.genLvlRoom[roomOf(i)]=3;},   ic:'🪫'},
  tank:      {ok:i=>!tankAtRoom(roomOf(i)), apply:i=>{S.inv.tankRoom[roomOf(i)]=true;}, ic:'🛢️'},
};
function potLabel(i){
  const t=T(), p=S.plants[i];
  if(!hasPot(i)) return t.slotEmpty;
  if(!p) return isGround(i)?t.plotEmpty:t.potEmpty;
  return potName(i)+' \u00b7 '+vName(vOf(p));
}
function potGearIcons(i){
  let s='';
  const dt=dripTier(i);
  if(dt>0) s+=(dt>=3?'🚰':dt>=2?'💦':'💧');
  if(lampAt(i)) s+=(lampLvl(i)>=3?'🌟':lampLvl(i)>=2?'🔆':'💡');
  if(genAtPot(i)) s+=(genLvl(i)>=3?'🪫':genLvl(i)>=2?'🔋':'⚡');
  return s;
}
function craft(r){
  if(!canCraft(r))return;
  if(POT_EQUIP[r.id]){ openPotPick(r.id); return; } // pay only once a pot is chosen
  questBump('craft',1);
  for(const k in r.cost) S.inv[k]-=r.cost[k];
  if(r.kind==='tool'||r.kind==='machine'){ S.inv.tools[r.id]=true; maybeTuto3(r.id); }
  else if(r.kind==='multi'){
    S.inv[r.cnt]++;
  }
  else {
    for(const k in r.gives) S.inv[k]+=r.gives[k];
    if(r.bonus&&Math.random()<r.bonus.chance) S.inv[r.bonus.res]+=r.bonus.n;
    { const gk=Object.keys(r.gives||{})[0]; if(gk) maybeTuto4(gk); }
  }
  // visible confirmation: glow on the recipe row + toast with how many are now owned
  flashCraft=r.id;
  setTimeout(()=>{ flashCraft=null; },1200);
  const tt=T(), qNow=recipeQty(r);
  showToast('✓ '+tt.recipes[r.id].nm+(r.kind==='tool'||r.kind==='machine'?'':' · ×'+qNow));
  save(); renderWorkshop(); renderResources(true); render(true);
}
const ROOM_RIDS=['generator','genUp2','genUp3','tank']; // zone-level gear: one per zone, not tied to a pot
function zoneRep(r){ return r*ROOM_SLOTS; } // representative pot index of a zone (the pot-level API maps it back to the zone)
function zoneGearStatus(r){
  const t=T(), g=genLvlRoomOf(r), tk=tankAtRoom(r);
  return '⚡ '+(g>0?t.zoneGenLvl(g):t.ctrlNoGen)+' · 🛢️ '+(tk?t.tankLbl:t.ctrlNoTank);
}
function openPotPick(rid){
  const t=T(), r=RECIPES.find(x=>x.id===rid), pe=POT_EQUIP[rid];
  ensurePlants();
  const box=$('potPickList'); box.innerHTML='';
  if(ROOM_RIDS.includes(rid)){ // pick a ZONE
    $('potPickTitle').textContent=r.ic+' '+t.zonePickTitle(t.recipes[rid].nm);
    for(let z=0;z<roomsCount();z++){
      const i=zoneRep(z), okT=pe.ok(i), replT=!okT&&pe.repl&&pe.repl(i);
      const d=document.createElement('div'); d.className='recipe'+(okT||replT?'':' locked');
      const fx0=okT?t.zonePickOk:(replT?t.potPickRepl:t.potPickNo);
      d.innerHTML='<span class="ic">🏠</span><span class="mid"><div class="nm">'+esc(roomName(z))+' <span class="own">'+zoneGearStatus(z)+'</span></div><div class="fx">'+fx0+'</div></span>';
      if(okT) d.addEventListener('click',()=>{ applyPotEquip(rid,i); });
      else if(replT){
        let armed=false;
        d.addEventListener('click',()=>{
          if(!armed){ armed=true; d.querySelector('.fx').textContent=t.potPickConfirm; d.style.borderColor='var(--danger)'; return; }
          applyPotEquip(rid,i,true);
        });
      }
      box.appendChild(d);
    }
    $('potPickOverlay').classList.add('on');
    return;
  }
  const isPotRid=(rid==='pot'||POT_MAT_RIDS.includes(rid));
  $('potPickTitle').textContent=r.ic+' '+(isPotRid?t.slotPickTitle(t.recipes[rid].nm):t.potPickTitle(t.recipes[rid].nm));
  for(let i=0;i<potSlots();i++){
    if(!hasPot(i)&&!isPotRid)continue; // gear goes on pots; pots (any material) go on EMPTY slots too — all slots listed
    const okT=pe.ok(i);
    const replT=!okT&&pe.repl&&pe.repl(i);
    const d=document.createElement('div'); d.className='recipe'+(okT||replT?'':' locked');
    const fx0=okT?(!hasPot(i)?t.slotPickOk:(isPotRid?t.matPickOk:t.potPickOk)):(replT?t.potPickRepl:(rid==='pot'?t.slotPickTaken:t.potPickNo));
    d.innerHTML='<span class="ic">'+(i+1)+'</span><span class="mid">'+
      '<div class="nm">'+(hasPot(i)?potName(i):t.slotN(i+1))+' <span class="own">🏠 '+esc(roomName(roomOf(i)))+'</span> — '+potLabel(i)+' '+(potGearIcons(i)?'<span class="own">'+potGearIcons(i)+'</span>':'')+'</div>'+
      '<div class="fx">'+fx0+'</div></span>';
    if(okT) d.addEventListener('click',()=>{ applyPotEquip(rid,i); });
    else if(replT){
      let armed=false;
      d.addEventListener('click',()=>{
        if(!armed){ armed=true; d.querySelector('.fx').textContent=t.potPickConfirm; d.style.borderColor='var(--danger)'; return; }
        applyPotEquip(rid,i,true);
      });
    }
    box.appendChild(d);
  }
  $('potPickOverlay').classList.add('on');
}
function closePotPick(){ $('potPickOverlay').classList.remove('on'); }
function applyPotEquip(rid,i,replace){
  const r=RECIPES.find(x=>x.id===rid), pe=POT_EQUIP[rid];
  if(!canCraft(r)||i>=potSlots()||(!hasPot(i)&&!ROOM_RIDS.includes(rid)&&rid!=='pot'&&!POT_MAT_RIDS.includes(rid)))return; // zone gear and the clay pot may target slots without a pot
  let back=null;
  if(!pe.ok(i)){
    if(!(replace&&pe.repl&&pe.repl(i)))return;
    back=pe.recycle(i); // the old device is dismantled: HALF its materials come back
  }
  questBump('craft',1);
  for(const k in r.cost) S.inv[k]-=r.cost[k];
  pe.apply(i);
  recomputeEquipCounts();
  closePotPick();
  save(); renderWorkshop(); lastRes=''; renderResources(true); render(true);
  const t=T(), ic=t.resIc;
  let msg=pe.ic+' '+t.potN(i+1)+' — '+potLabel(i);
  if(back){ const parts=Object.keys(back).map(k=>'+'+back[k]+' '+(ic[k]||k)); if(parts.length) msg+=' · ♻ '+parts.join(' '); }
  showToast(msg);
}
function multiMax(r){ // upgrades are per unit: never more upgrades than the thing they upgrade
  let m=r.max;
  if(r.capBy) m=Math.min(m,S.inv[r.capBy]||0);
  if(r.capFn) m=Math.min(m,r.capFn());
  return m;
}
function canCraft(r){
  if(!recipeVisible(r))return false; // hidden until researched or discovered at the try table
  if((r.kind==='tool'||r.kind==='machine')&&S.inv.tools[r.id])return false;
  if(r.kind==='multi'&&S.inv[r.cnt]>=multiMax(r))return false;
  if(POT_EQUIP[r.id]){ // installed gear needs a valid pot — a replaceable one counts (old gear recycled at 50%)
    const pe=POT_EQUIP[r.id];
    let any=false;
    if(ROOM_RIDS.includes(r.id)){ for(let z=0;z<roomsCount();z++){ const i=zoneRep(z); if(pe.ok(i)||(pe.repl&&pe.repl(i))){ any=true; break; } } }
    else for(let i=0;i<potSlots();i++) if(pe.ok(i)||(pe.repl&&pe.repl(i))){ any=true; break; }
    if(!any) return false;
  }
  if(!r.noBench&&!S.inv.tools.workbench)return false;
  if(r.needs&&!hasThing(r.needs))return false;
  for(const k in r.cost){ if((S.inv[k]||0)<r.cost[k])return false; }
  return true;
}
function fertBadgeIcon(p){
  if(p.buffKind){ const r=RECIPES.find(x=>x.gives&&Object.keys(x.gives)[0]===p.buffKind); if(r&&r.ic)return r.ic; }
  return p.buffMult>=1.5?'💠':(p.buffMult<=1.2?'🍂':'🧪');
}
function useFert(kind){
  const p=selPlant();
  const fx=FERT_FX[kind];
  if(!p||p.dead||p.cut||!fx||S.inv[kind]<=0)return;
  if(fx.only&&baseTypeOf(p)!==fx.only)return; // variety-specific fertilizer
  S.inv[kind]--;
  questBump('fert',1);
  p.buffUntil=p.gH+FERT_DUR_H;
  p.buffMult=fx.mult;
  p.buffKind=kind; // the badge shows this fertilizer's own icon and bonus
  if(fx.luck) p.luckBonus=fx.luck;
  save(); renderWorkshop(); renderResources(true); render(true);
  const fr=RECIPES.find(x=>x.gives&&Object.keys(x.gives)[0]===kind);
  if(fr) showToast('✓ '+T().recipes[fr.id].nm);
}
function rechargeRoom(r){ // ONE room's coal generator: pay wood, fill THAT battery only
  if(genLvlRoomOf(r)<=0||S.inv.wood<=0)return;
  const missing=energyCapRoom(r)-energyRoomOf(r);
  if(missing<=1e-9)return;
  const affordable=Math.min(missing,S.inv.wood/WOOD_PER_ENERGY);
  S.inv.energyRoom[r]=energyRoomOf(r)+affordable;
  const woodCost=Math.max(1,Math.ceil(affordable*WOOD_PER_ENERGY));
  S.inv.wood=Math.max(0,S.inv.wood-woodCost);
  save(); renderWorkshop(); lastRes=''; renderResources(true); render(true);
  showToast('⚡ '+roomName(r)+' +'+Math.round(affordable)+'h · −'+woodCost+' 🪵');
}
function toggleLamp(i){ // per-pot lamp switch: an off lamp stops draining
  if(!lampAt(i))return;
  if(!Array.isArray(S.inv.lampOnArr)) S.inv.lampOnArr=Array(9).fill(true);
  S.inv.lampOnArr[i]=!lampOn(i);
  save(); render(true); renderWorkshop();
  showToast((lampOn(i)?'💡 ':'🌑 ')+T().potN(i+1));
}
function selectPot(i){
  ensurePlants();
  i=clamp(i,0,potSlots()-1);
  if(!hasPot(i)){ const l=potList(); if(!l.length)return; i=l.reduce((b,x)=>Math.abs(x-i)<Math.abs(b-i)?x:b,l[0]); } // snap to the nearest real pot
  S.sel=i;
  controlView=false;
  curRoom=roomOf(S.sel); _navSig='';
  renderGen(); renderHotbar();
  applyAccent(); save(); renderSidebar(); render(true);
}
function switchNormie(){ save(); showScreen('start'); }
/* ── FULL reset: everything restarts from zero — plantations, inventory, tools, research, strains, badges ── */
let resetArmed=0;
function resetGarden(){
  const t=T(), m=$('resetMsg');
  if(Date.now()-resetArmed>6000){ // first click: arm
    resetArmed=Date.now();
    m.className='msg err'; m.textContent=t.resetConfirm();
    return;
  }
  resetArmed=0;
  try{ const r=localStorage.getItem(LS_KEY); if(r) localStorage.setItem(LS_KEY+'_backup',r); }catch(_){}
  const lang=S.lang, introSeen=S.introSeen;
  S=freshState(); S.lang=lang; S.introSeen=introSeen;
  bookFilter={q:'',owned:false,hideUndisc:false,tier:-1,cat:null}; bookPage=0; seedPage=0;
  lastRes='';
  applyAccent(); save(); renderWorkshop(); renderQuests(); renderVarieties(); updateCommUI();
  showScreen('start'); render(true); renderResources(true);
  m.className='msg ok'; m.textContent=t.resetDone(); // after updateCommUI, which clears this field
  showToast('↺');
}
function backToGarden(){ if(S.plants.some(p=>p)) { showScreen('garden'); render(true); } }

/* ── Normie lookup ── */
function lookup(){
  const raw=$('normieId').value.trim();
  const id=Number(raw);
  const msg=$('lookupMsg');
  const c=C();
  $('manualBox').hidden=true;
  if(raw===''||!Number.isInteger(id)||id<0||id>c.idMax){
    msg.className='msg err'; msg.textContent=T().errNumC(c.idMax); return;
  }
  const snap=commSnapshot();
  if(snap[id]){
    plantNow(tokenFromSnapshot(id,snap[id])); return;
  }
  msg.className='msg'; msg.textContent=T().searching;
  fetchToken(id).then(n=>{ plantNow(n); }).catch(()=>{
    msg.className='msg'; msg.textContent=T().apiDown;
    const u=c.api(id);
    $('manualLink').href=u;
    $('manualLink').textContent=u.replace('https://','');
    $('manualBox').hidden=false; $('manualBox').dataset.id=id;
    applyLangManual();
  });
}
function tokenFromSnapshot(id,row){
  const c=C();
  if(S.comm==='hoodies'){ const [type,px]=row; return {id,type,px:clamp(px,1,c.pxCap),pxMax:c.pxMax,comm:S.comm,level:1,src:'snapshot'}; }
  const [type,px,level]=row; return {id,type,px,pxMax:c.pxMax,comm:S.comm,level,src:'snapshot'};
}
function fetchToken(id){
  const c=C(), comm=S.comm;
  return new Promise((res,rej)=>{
    const ctl=new AbortController(); const t=setTimeout(()=>{ctl.abort();rej(new Error('timeout'))},4000);
    fetch(c.api(id),{signal:ctl.signal})
      .then(r=>{ if(!r.ok) throw 0; return r.json(); })
      .then(j=>{ clearTimeout(t); res(parseToken(j,id,'api',comm)); })
      .catch(e=>{ clearTimeout(t); rej(e); });
  });
}
function parseToken(j,id,src,comm){
  comm=comm||S.comm;
  if(comm==='hoodies') return parseHoodie(j,id,src);
  return parseMetadata(j,id,src);
}
function parseMetadata(j,id,src){
  const attrs=j&&j.attributes; if(!Array.isArray(attrs)) throw new Error('format');
  const get=k=>{ const a=attrs.find(x=>x.trait_type===k); return a?a.value:undefined; };
  const type=get('Type'), px=Number(get('Pixel Count')), level=Number(get('Level'))||1;
  if(!VARIETIES[type]||!Number.isFinite(px)) throw new Error('format');
  return {id,type,px:clamp(px,1,1600),pxMax:COMMUNITIES.normies.pxMax,comm:'normies',level,src};
}
function parseHoodie(j,id,src){
  const type=j&&j.traits&&j.traits.hoodie;
  const px=Number(j&&j.ink&&j.ink.blackPixels);
  if(!VARIETIES[type]||!Number.isFinite(px)) throw new Error('format');
  const c=COMMUNITIES.hoodies;
  return {id,type,px:clamp(px,1,c.pxCap),pxMax:c.pxMax,comm:'hoodies',level:1,src};
}
function parseManual(){
  const id=Number($('manualBox').dataset.id);
  const msg=$('lookupMsg');
  try{
    const j=JSON.parse($('manualJson').value);
    // auto-detect the format: Normie metadata (attributes[]) vs Hoodie token (traits.hoodie)
    const n=Array.isArray(j&&j.attributes)?parseMetadata(j,id,'manual'):parseHoodie(j,id,'manual');
    plantNow(n);
  }catch(e){
    msg.className='msg err';
    msg.textContent=T().errJson;
  }
}
function randomPick(){
  const snap=commSnapshot();
  const keys=Object.keys(snap);
  const id=Number(keys[Math.floor(Math.random()*keys.length)]);
  plantNow(tokenFromSnapshot(id,snap[id]));
}

/* ── UI ── */
function applyAccent(){
  // ONE fixed interface color per community — the variety no longer recolors the UI
  const th=activeTheme();
  document.documentElement.style.setProperty('--accent',th.brand);
  document.documentElement.style.setProperty('--accent-ink',th.brandInk);
}
function placeHeader(inStage){ // the top bar floats over the scene on the garden (design shell); it sits in the flow everywhere else
  const hd=document.querySelector('header'), stg=document.querySelector('.stage'), wrap=document.querySelector('.wrap'); if(!hd||!stg||!wrap)return;
  const first=(el)=>{ if(hd.parentElement===el)return; if(el.insertBefore) el.insertBefore(hd,el.firstChild); else el.appendChild(hd); }; // the unit-test DOM stub only knows appendChild
  if(inStage){ first(stg); hd.classList.add('in-stage'); }
  else { first(wrap); hd.classList.remove('in-stage'); }
}
function showScreen(which){
  $('scrStart').classList.toggle('on',which==='start');
  $('scrGarden').classList.toggle('on',which==='garden');
  if(which!=='garden') placeHeader(false);
  $('normieChip').hidden=(which!=='garden');
  $('btnBack').hidden=!(which==='start'&&S.plants.some(p=>p));
}
function fmtDur(gameH){
  const u=T().units;
  const realMs=gameH/timeMult()*3600000;
  const s=Math.max(0,Math.round(realMs/1000));
  if(s<90) return s+' '+u.s;
  const m=Math.round(s/60); if(m<90) return m+' '+u.m;
  const h=Math.floor(m/60), mm=m%60; if(h<48) return h+' '+u.h+' '+(mm?mm+' '+u.m:'');
  return Math.floor(h/24)+' '+u.d+' '+(h%24)+' '+u.h;
}
function phaseName(p,P){
  const ph=T().phases;
  if(!p)return'';
  if(p.dead)return ph.dead;
  if(p.cut)return ph.cut;
  if(hydration(p)===0)return ph.wither;
  if(P<0.05)return ph.seed;
  if(P<0.25)return ph.germ;
  if(P<0.55)return ph.young;
  if(P<0.80)return ph.mature;
  return ph.bloom;
}
function costStr(cost){
  const ic=T().resIc;
  return Object.keys(cost).map(k=>cost[k]+' '+(ic[k]||k)).join(' + ');
}
function waterLabel(){
  const t=T();
  const m=waterModeEffective();
  if(m==='arrosoir')return t.waterAll;
  return m==='hand'?t.waterHand:t.waterBucket;
}
function harvestLabel(){
  const t=T(), p=selPlant();
  if(p&&p.dead)return t.harvestDead;
  if(S.inv.equip==='shears'&&S.inv.tools.shears)return t.harvestShears;
  if(S.inv.equip==='gloves'&&S.inv.tools.gloves)return t.harvestGloves;
  return t.harvest;
}
function render(force){
  ensurePlants();
  const t=T(), p=selPlant(), n=p?p.normie:null, N=potCount();
  // pot selector
  $('potSel').hidden=N<2;
  if(N>=2) $('potSelLbl').textContent=t.potLbl(S.sel,N);
  // chip
  const chipV=p?vOf(p):(VARIETIES[S.normie?S.normie.type:'Generic']||VARIETIES.Generic);
  $('normieChipTxt').textContent = n ? (tokLbl(n)+' #'+n.id+' · '+vName(chipV)+' · '+n.px+' px') : (p?vName(chipV):(S.normie?(tokLbl(S.normie)+' #'+S.normie.id):'—'));
  const dn=$('deathNotice');
  if(!p){ // empty pot
    $('plantTitle').textContent=potName(S.sel)+' \u00b7 '+t.emptyTitle;
    $('btnName').hidden=!$('nameRow').hidden; $('plantTitle').hidden=!$('nameRow').hidden; // the pot keeps its name, plant or not
    $('plantBadges').innerHTML='';
    $('growthPct').textContent='—'; $('growthBar').style.width='0%';
    $('hydPct').textContent='—'; $('hydBar').style.width='0%';
    $('hydBarBox').classList.remove('warn');
    $('hydWarn').textContent='';
    $('phaseLbl').textContent=t.emptyTitle.toLowerCase();
    $('phaseLbl').style.color='';
    $('clockLbl').textContent='';
    $('btnWater').textContent=waterLabel();
    $('btnWater').disabled=!S.inv.tools.arrosoir||!S.plants.some(q=>q&&!q.dead&&!q.cut);
    const hasLampE=lampAt(S.sel);
    $('btnLamp').hidden=!hasLampE;
    if(hasLampE) $('btnLamp').textContent=lampOn(S.sel)?t.lampBtnOff:t.lampBtnOn;
    $('btnHarvest').disabled=true;
    $('stFlowers').childNodes[0].nodeValue='0 ';
    $('stFlowersCap').textContent='';
    $('stNext').textContent='—';
    dn.className='notice'; // nothing announced in the card: every notice lives in the stage's notice zone
    { const sn=$('stageNotice'); sn.className='on'; sn.innerHTML=t.emptyNotice; }
    $('metersBox').hidden=false; // meters stay visible (dashes): the card never changes height, so the stage never resizes
    $('btnReplant').disabled=!canReplant();
    $('btnUproot').disabled=true;
    placeReplant(true);
    $('btnReplant').classList.toggle('ready',canReplant());
    $('btnUproot').classList.remove('ready');
    $('btnHarvest').classList.remove('ready');
    $('btnWater').classList.remove('ready'); $('btnWater').classList.remove('alert');
    // (nameRow is driven by startRename/cancelRename only)
    renderJournal(null);
    $('soilHint').textContent = !canReplant() ? t.noSeed : (S.inv.soil>0 ? t.soilNext(S.inv.soil) : t.soilNone);
    renderResources(); drawGarden();
    return;
  }
  const v=vOf(p), P=progress(p), hyd=hydration(p);
  $('plantTitle').textContent = potName(S.sel)+' \u00b7 '+vName(v)+(n?(' — #'+n.id):''); // "Pot name · Variety — #id": the name is the pot's, the variety is read-only
  $('btnName').hidden=!$('nameRow').hidden; // stays hidden while the title is being edited
  $('plantTitle').hidden=!$('nameRow').hidden;
  renderJournal(p);
  const badges=[];
  if(p.mutRevealed&&p.mutation!=='none') badges.push('<span class="badge">'+t.mutIc[p.mutation]+' '+t.muts[p.mutation]+'</span>');
  if(v.sterile) badges.push('<span class="badge">'+t.badgeSterile+'</span>');
  if(p.soil) badges.push('<span class="badge">'+t.badgeSoil+'</span>');
  if(lampAt(S.sel)) badges.push('<span class="badge'+(lampActive(S.sel)?'':' gray')+'" data-lamptoggle="1" style="cursor:pointer" title="'+t.lampToggleTip+'">'+(lampOn(S.sel)?t.lampBadgeOn:t.lampBadgeOff)+'</span>');
  if(buffActive(p)) badges.push('<span class="badge">'+t.badgeFertX(fertBadgeIcon(p),Math.round((p.buffMult-1)*100),fmtDur(p.buffUntil-p.gH))+'</span>');
  if(p.luckBonus&&!p.cut&&!p.dead) badges.push('<span class="badge">'+t.badgeLuck+'</span>');
  $('plantBadges').innerHTML=badges.join('');
  $('growthPct').textContent=Math.floor(P*100)+'%';
  $('growthBar').style.width=(P*100)+'%';
  $('hydPct').textContent=Math.floor(hyd*100)+'%';
  $('hydBar').style.width=(hyd*100)+'%';
  $('hydBarBox').classList.toggle('warn',hyd<0.25);
  const inactive=p.dead||p.cut;
  $('metersBox').hidden=false; // meters stay: the cut/dead notice now lives in the stage
  $('hydWarn').textContent = inactive?'':(hyd===0?t.thirst:(hyd<0.25?t.waterIt:''));
  $('phaseLbl').textContent=phaseName(p,P);
  $('phaseLbl').style.color=vOf(p).accent; // the phase label is the ONE UI spot wearing the variety color
  $('btnWater').textContent=waterLabel();
  $('btnWater').disabled=S.inv.tools.arrosoir?!S.plants.some(q=>q&&!q.dead&&!q.cut):inactive;
  $('btnHarvest').textContent=harvestLabel();
  const hasLamp=lampAt(S.sel);
  $('btnLamp').hidden=!hasLamp;
  if(hasLamp) $('btnLamp').textContent=lampOn(S.sel)?t.lampBtnOff:t.lampBtnOn;
  $('btnUproot').disabled=false; // uproot is always available: switch seeds whenever you like
  $('btnHarvest').classList.toggle('ready',!inactive&&p.pending.length>=flowerCap(p,S.sel)); // pulses ONLY when the bloom is complete (100 % of the flowers)
  $('btnUproot').classList.remove('ready');
  $('btnReplant').classList.toggle('ready',slotFree(p)&&canReplant());
  $('btnWater').classList.remove('ready');
  $('btnWater').classList.toggle('alert',!inactive&&hyd<=0&&!$('btnWater').disabled); // red frame ONLY at 0 % hydration
  $('btnHarvest').disabled=p.dead?false:(inactive||!p.pending.length); // dead plant: harvest its dead wood
  $('btnReplant').disabled=!(slotFree(p)&&canReplant());
  placeReplant(!!p.cut); // a cut plant has nothing left to harvest: offer Replant in its place
  if(p.dead) $('btnUproot').hidden=true; // dead plant: ONE button — "Collect dead wood" (same payout as the bin)
  $('stFlowers').childNodes[0].nodeValue=p.pending.length+' ';
  $('stFlowersCap').textContent='/ '+flowerCap(p,S.sel);
  $('stNext').textContent=nextFlowerText(p,S.sel);
  const capH=hydCapH(p);
  let clock=t.growthLeft(fmtDur((GROWTH_H-p.growthH)/speedMult(p,S.sel)));
  if(P>=1) clock=t.grown;
  if(p.dead) clock=t.deadClock;
  if(p.cut) clock=t.cutClock;
  if(!inactive){
    const dryIn=p.hydAtH+capH-p.gH;
    clock += dryIn>0 ? t.driesIn(fmtDur(dryIn)) : t.diesIn(fmtDur(p.hydAtH+capH+WITHER_GRACE_H-p.gH));
  }
  $('clockLbl').textContent=clock;
  const sn=$('stageNotice');
  if(p.dead){ sn.className='on bad'; sn.innerHTML=t.deathNotice(vName(v),!!v.sterile); dn.className='notice'; }
  else if(p.cut){ sn.className='on'; sn.innerHTML=t.cutShort; dn.className='notice'; } // details fly by in the stage popup
  else { sn.className=''; dn.className='notice'; }
  $('soilHint').textContent = S.inv.soil>0 ? t.soilNext(S.inv.soil) : t.soilNone;
  renderResources();
  drawGarden();
}
let lastRes='';
function openResourcePage(k){ // a resource opens its page: coins→Market, seeds→Seed vault, else Crafting filtered on it
  if(k==='coins'){ openMarket(); return; }
  if(k==='seeds'){ openSeeds(); return; }
  bookFilter={q:'',owned:false,hideUndisc:false,tier:-1,cat:null,res:k};
  $('bookSearch').value=''; bookPage=0; openBook();
}
const RES_KEYS=['coins','px','wood','stone','metal','mineral','seeds'];
const HUD_KEYS=['coins','px','seeds','wood']; // the top strip shows only these four (design) — stone/metal/minerals live behind the + (room for 3-digit counts)
function resVal(k){ return k==='seeds'?totalBaseSeeds():(k==='coins'?fmtCoins(S.inv[k]):S.inv[k]); }
function renderResources(flash){
  const sig=RES_KEYS.map(resVal).join(',');
  const changed=sig!==lastRes||flash;
  if(changed) lastRes=sig;
  renderHudTop(changed);
}
// player level/XP: entirely new (no such stat existed before) — derived from recipes discovered + badges earned,
// since Martin asked for it to grow with discovery and badge progress rather than inventing a separate grind stat.
const XP_PER_DISCOVERY=10, XP_PER_BADGE=20, XP_PER_LEVEL=100;
function playerXP(){ return (S.inv.discovered||[]).length*XP_PER_DISCOVERY + Object.keys(S.badges||{}).length*XP_PER_BADGE; }
function playerLevel(){ return 1+Math.floor(playerXP()/XP_PER_LEVEL); }
function anyRoomAlert(){ for(let r=0;r<roomsCount();r++) if(roomAlert(r)) return true; return false; }
let lastHudAlert=null;
function renderHudTop(changed){
  const t=T();
  const xp=playerXP();
  $('hudLevelNum').textContent=playerLevel();
  $('hudLevelFill').style.width=Math.round((xp%XP_PER_LEVEL))+'%';
  const alert=anyRoomAlert();
  if(changed){
    const strip=$('hudResStrip'); if(strip){
      strip.innerHTML=HUD_KEYS.map(k=>
        '<button type="button" class="hud-pill" data-res="'+k+'" title="'+t.res[k]+'"><span class="hp-ic">'+t.resIc[k]+'</span><span class="hp-v">'+resVal(k)+'</span><span class="hp-plus">+</span></button>'
      ).join('')+'<button type="button" class="hud-pill-more" data-resmore="1" title="'+t.book+'"><span>+</span></button>';
    }
  }
  if(alert!==lastHudAlert){ lastHudAlert=alert; const dot=$('hudHambDot'); if(dot) dot.hidden=!alert; }
}
function renderWorkshop(){ renderBook(); renderHotbar(); renderInventory(); renderGen(); renderSidebar(); }
/* ── Active gear hotbar ── */
function selectEquip(k){
  if(k!=='hands'&&!S.inv.tools[k])return;
  S.inv.equip=k;
  save(); renderSidebar(); renderHotbar(); render(true);
  showToast('✓ '+(k==='hands'?T().equipHands:T().recipes[k].nm));
}
function renderHotbar(){
  const t=T(), box=$('hotbar'); box.innerHTML='';
  // harvest tool & watering gear live in the garden sidebar — only the tank stays here
  $('tEquip').hidden=!(S.inv.tankCount>0||S.inv.genCount>0);
  // drip tank: ONE bar — the current room's; switch rooms to refill the others
  { const r=curRoom;
    if(tankAtRoom(r)){
    const row3=document.createElement('div'); row3.className='hotrow';
    const pct=Math.round(tankLvlRoom(r)/TANK_CAP_H*100);
    let status='';
    if(S.inv.dripCount>0) status=dripActive()?(' · '+t.dripOn):(pct<=0?' · '+t.dripDry:'');
    row3.innerHTML='<span class="hlbl">🛢️ '+t.tankLbl+' — '+roomName(r)+status+'</span>'+
      '<span class="bar hyd"><i data-tankbar="'+r+'" style="width:'+pct+'%"></i></span>'+
      '<span class="cnt" data-tankpct="'+r+'">'+pct+'%</span>'+
      '<button class="btn xs" data-refill="'+r+'" type="button">'+t.refill+'</button>';
    box.appendChild(row3);
    row3.querySelector('[data-refill]').addEventListener('click',()=>refillTank(r));
  } }
}
/* ── Cheat code ── */
function cheat(){
  const inp=$('cheatInput'), msg=$('cheatMsg'), t=T();
  if(inp.value.trim().toLowerCase()==='pixel'){
    for(const k of ['px','wood','stone','metal','mineral','coins','soil','fert','fertPlus','compost']) S.inv[k]=999;
    for(const ty of C().types.concat('Generic')) S.inv.seedsVar[ty]=99;
    inp.value='';
    msg.className='msg ok'; msg.textContent=t.cheatOk;
    save(); lastRes=''; renderResources(true); renderWorkshop(); render(true);
  }else{
    msg.className='msg err'; msg.textContent=t.cheatBad;
  }
}
/* ── Recipe book (modal) ── */
let bookPage=0;
let flashCraft=null; // recipe id to flash after a successful craft
const BOOK_PER_PAGE=5; // 5 rows always fit the fixed-height book (6 clipped the last one once descriptions got longer)
/* unified carnet: recipes + inventory, with filters (search / tier / owned / hide undiscovered) */
let bookFilter={q:'',owned:false,hideUndisc:false,tier:-1,cat:null};
function recipeQty(r){ // how many the player owns of what this recipe makes
  if(r.kind==='tool'||r.kind==='machine') return S.inv.tools[r.id]?1:0;
  if(r.kind==='multi') return S.inv[r.cnt]||0;
  if(r.kind==='consumable') return S.inv[Object.keys(r.gives)[0]]||0;
  return 0;
}
function bookMatch(r,t){
  if(bookFilter.res){ // recipes that consume or produce the clicked resource
    const rk=bookFilter.res;
    const uses=r.cost&&r.cost[rk], makes=(r.gives&&r.gives[rk])||(r.bonus&&r.bonus.res===rk);
    if(!uses&&!makes) return false;
  }
  if(bookFilter.cat&&r.cat!==bookFilter.cat) return false;
  if(bookFilter.owned&&recipeQty(r)<=0) return false;
  if(bookFilter.q){
    const tr=t.recipes[r.id];
    const hay=(tr.nm+' '+tr.fx).toLowerCase();
    if(!hay.includes(bookFilter.q)) return false;
  }
  return true;
}
function bookFiltering(){ return bookFilter.q!==''||bookFilter.owned||bookFilter.tier>=0||!!bookFilter.cat||!!bookFilter.res; }
/* Crafting popup (design): categories on the left, the recipe list in the middle, the selected recipe's sheet on the right.
   The list scrolls, so the old fixed-height pages are gone; every filter of the old carnet survives in the left column. */
let bookSel=null, craftQty=1;
function bookEntries(){ // flat, tier by tier; per tier a collapsed "❓ N still to discover" note stands in for the undiscovered recipes
  const t=T(), out=[];
  for(let ti=0;ti<4;ti++){
    if(bookFilter.tier>=0&&bookFilter.tier!==ti) continue;
    const list=RECIPES.filter(r=>r.tier===ti&&(!bookFilter.cat||r.cat===bookFilter.cat));
    for(const r of list) if(recipeVisible(r)&&bookMatch(r,t)) out.push(r);
    const hiddenN=list.length-list.filter(r=>recipeVisible(r)).length;
    if(hiddenN>0&&!bookFilter.hideUndisc&&!bookFilter.q&&!bookFilter.owned&&!bookFilter.res) out.push({hiddenN,tier:ti});
  }
  return out;
}
function recipeLock(r){ // why a visible recipe can't be crafted yet, beyond resources — null when nothing blocks it
  const t=T();
  if(!r.noBench&&!S.inv.tools.workbench) return t.lockedBench;
  if(r.needs&&!hasThing(r.needs)) return t.lockedMachine(t.recipes[r.needs].nm);
  return null;
}
function recipeDone(r){ return ((r.kind==='tool'||r.kind==='machine')&&!!S.inv.tools[r.id])||(r.kind==='multi'&&S.inv[r.cnt]>=multiMax(r)); }
function renderBook(){
  const t=T(), box=$('bookBody'); if(!box)return;
  renderBookCats();
  const entries=bookEntries(), ids=entries.filter(e=>e.id).map(e=>e.id);
  if(!ids.includes(bookSel)){ bookSel=ids[0]||null; craftQty=1; }
  let html='';
  if(bookFilter.res) html+='<button type="button" class="cp-chip" data-resclear="1">'+(t.resIc[bookFilter.res]||'')+' '+t.res[bookFilter.res]+' ✕</button>';
  for(const e of entries){
    if(e.hiddenN){
      html+='<div class="cp-item locked"><div class="cp-ic">❓</div><div class="cp-mid"><div class="cp-nm disp">'+t.toDiscover(e.hiddenN)+'</div><div class="cp-fx">'+t.tierNames[e.tier]+' · '+t.researchMenuHint+'</div></div><img class="cp-lock" src="'+SB_ICONS.lock+'" alt=""></div>';
      continue;
    }
    const r=e, tr=t.recipes[r.id], done=recipeDone(r), lock=!done&&recipeLock(r);
    html+='<button type="button" class="cp-item'+(r.id===bookSel?' sel':'')+(lock?' locked':'')+(r.id===flashCraft?' flash':'')+'" data-rid="'+r.id+'">'+
      '<div class="cp-ic">'+r.ic+'</div><div class="cp-mid"><div class="cp-nm disp">'+tr.nm+
      (done?' <span class="cp-tag">✓ '+(r.kind==='multi'?t.maxed:t.owned)+'</span>':'')+
      (discovered(r.id)&&!researched(r.tier)?' <span class="cp-tag">🧪</span>':'')+'</div>'+
      '<div class="cp-fx">'+tr.fx+'</div></div>'+
      (lock?'<img class="cp-lock" src="'+SB_ICONS.lock+'" alt="">':'<span class="cp-arrow">›</span>')+'</button>';
  }
  if(!entries.length) html='<div class="cp-none">'+t.craftNone+'</div>';
  box.innerHTML=html;
  renderBookDetail();
  refreshWorkshopButtons();
}
function renderBookCats(){
  const t=T(), box=$('bookCats'); if(!box)return;
  const b=(kind,val,lbl,on)=>'<button type="button" class="cp-cat'+(on?' on':'')+'" data-bcat="'+kind+'" data-bval="'+val+'">'+lbl+'</button>';
  const tierLbl=ti=>['0','I','II','III'][ti]+' · '+(t.tierNames[ti].split('—')[1]||'').trim();
  box.innerHTML=b('cat','',t.catAll,!bookFilter.cat)+b('cat','plant',t.catPlant,bookFilter.cat==='plant')+b('cat','build',t.catBuild,bookFilter.cat==='build')+
    '<div class="cp-cat-sep"></div>'+
    b('tier',-1,'⭐ '+t.tierAll,bookFilter.tier===-1)+[0,1,2,3].map(ti=>b('tier',ti,tierLbl(ti),bookFilter.tier===ti)).join('')+
    '<div class="cp-cat-sep"></div>'+
    b('owned',1,t.fltOwned,bookFilter.owned)+b('hide',1,t.fltHide,bookFilter.hideUndisc);
}
function renderBookDetail(){
  const t=T(), box=$('bookDetail'); if(!box)return;
  const r=RECIPES.find(x=>x.id===bookSel);
  if(!r){ box.innerHTML='<div class="cp-none">'+t.craftNone+'</div>'; return; }
  const tr=t.recipes[r.id], done=recipeDone(r), lock=!done&&recipeLock(r), single=(r.kind==='tool'||r.kind==='machine');
  const qtyOn=r.kind==='consumable'||r.kind==='resource', mult=qtyOn?craftQty:1;
  let mats='';
  for(const k in r.cost){ const have=S.inv[k]||0, need=r.cost[k]*mult;
    mats+='<div class="cp-mat"><div class="cp-mat-ic">'+(t.resIc[k]||'')+'</div><div class="cp-mat-v disp" style="color:'+(have>=need?'#8fd14f':'#e07a5f')+'">'+fmtCoins(have)+' / '+need+'</div><div class="cp-mat-k">'+(t.res[k]||k)+'</div></div>'; }
  let note='';
  if(single) note=done?'✓ '+t.owned:t.craftOnce;
  else if(r.kind==='multi'||r.kind==='consumable') note='<span class="disp" data-cnt="'+r.id+'"></span>'+(done?' · ✓ '+t.maxed:'');
  if(lock) note+='<div class="cp-lock-txt">🔒 '+lock+'</div>';
  const useKey=r.kind==='consumable'?Object.keys(r.gives)[0]:null;
  const lbl=r.id==='stone'?t.compress:(r.id==='metal'?t.smelt:t.craft);
  box.innerHTML='<h3 class="cp-dt disp">'+tr.nm+'</h3><div class="cp-big">'+r.ic+'</div><div class="cp-desc">'+tr.fx+'</div>'+
    (mats?'<div class="cp-mats-lbl disp">'+t.craftMats+'</div><div class="cp-mats">'+mats+'</div>':'')+
    '<div class="cp-note">'+note+'</div>'+
    (qtyOn&&!done?'<div class="cp-qty"><button type="button" class="cp-qbtn" data-qdec="1">−</button><div class="cp-qval disp">'+craftQty+'</div><button type="button" class="cp-qbtn" data-qinc="1">+</button></div>':'')+
    (useKey&&FERT_FX[useKey]&&S.inv[useKey]>0?'<button type="button" class="cp-use" data-use="'+useKey+'">'+t.use+'</button>':'')+
    (!done?'<button type="button" class="cp-create" data-craft="'+r.id+'">🔨 <span class="disp">'+lbl+(qtyOn&&craftQty>1?' ×'+craftQty:'')+'</span></button>':'');
}
function bookClick(e){ // one delegated handler for the whole popup
  const q=sel=>e.target.closest&&e.target.closest(sel);
  const it=q('[data-rid]');      if(it){ if(bookSel!==it.dataset.rid){ bookSel=it.dataset.rid; craftQty=1; renderBook(); } return; }
  const cat=q('[data-bcat]');    if(cat){ const k=cat.dataset.bcat, v=cat.dataset.bval;
    if(k==='cat') bookFilter.cat=v||null; else if(k==='tier') bookFilter.tier=+v; else if(k==='owned') bookFilter.owned=!bookFilter.owned; else if(k==='hide') bookFilter.hideUndisc=!bookFilter.hideUndisc;
    renderBook(); return; }
  if(q('[data-resclear]')){ bookFilter.res=null; renderBook(); return; }
  if(q('[data-qdec]')){ craftQty=Math.max(1,craftQty-1); renderBookDetail(); refreshWorkshopButtons(); return; }
  if(q('[data-qinc]')){ craftQty=Math.min(9,craftQty+1); renderBookDetail(); refreshWorkshopButtons(); return; }
  const cr=q('[data-craft]');    if(cr){ const r=RECIPES.find(x=>x.id===cr.dataset.craft); if(!r)return;
    const n=(r.kind==='consumable'||r.kind==='resource')?craftQty:1;
    for(let i=0;i<n&&canCraft(r);i++) craft(r);
    return; }
  const us=q('[data-use]');      if(us){ useFert(us.dataset.use); return; }
}
function renderHybPage(box,t,pg){
  const sec=document.createElement('div'); sec.className='tier'; sec.style.marginTop='4px';
  sec.innerHTML='<div class="tname">⚗️ '+t.seedsGroup+'</div>';
  const wrap=document.createElement('div'); wrap.className='recipes';
  for(const e of pg.entries){
    const d=document.createElement('div'); d.className='recipe owned';
    if(e.h){
      const hv=VARIETIES[HYBRIDS[e.h].v];
      d.innerHTML='<span class="ic">⚗️</span><span class="mid"><div class="nm">'+vName(hv)+'</div>'+
        '<div class="fx">'+t.hyb[e.h]+'</div></span>'+
        '<span class="act"><span class="cnt" data-qty="'+e.h+'">×'+(S.inv[e.h]||0)+'</span>'+
        '<button class="btn xs" data-planthyb="'+e.h+'" type="button">'+t.plantBtn+'</button></span>';
    }else{
      const sv=S.strains[e.s];
      d.innerHTML='<span class="ic">🧬</span><span class="mid"><div class="nm"><span style="color:'+sv.accent+'">'+sv.name+'</span> <span class="own">'+t.rar[sv.rar]+'</span></div>'+
        '<div class="fx">'+t.strainLine(sv)+'</div></span>'+
        '<span class="act"><span class="cnt">×'+(S.inv.strainSeeds[e.s]||0)+'</span>'+
        '<button class="btn xs" data-plantstr="'+e.s+'" type="button">'+t.plantBtn+'</button></span>';
    }
    wrap.appendChild(d);
  }
  sec.appendChild(wrap);
  box.appendChild(sec);
}
function renderTryPage(box,t){
  const ex=document.createElement('div'); ex.className='tier'; ex.style.marginTop='4px';
  const RES_OPTS=['px','wood','stone','metal','mineral','fert'];
  let opts='<option value="">'+t.tryNone+'</option>';
  for(const k of RES_OPTS) opts+='<option value="'+k+'">'+t.resIc[k]+' '+t.res[k]+'</option>';
  let exh='<div class="tname">'+t.tryTitle+'</div><p class="hint" style="margin:6px 0">'+t.tryHint+'</p><div class="recipes">';
  for(let i=0;i<3;i++){
    exh+='<div class="hotrow"><select data-tryk="'+i+'" style="background:var(--ground);color:var(--paper);border:2px solid var(--line);font-family:inherit;font-size:.62rem;padding:5px">'+opts+'</select>'+
      '<input data-tryq="'+i+'" type="number" min="0" max="999" value="0" style="width:5em;background:var(--ground);color:var(--paper);border:2px solid var(--line);font-family:inherit;font-size:.62rem;padding:5px">'+'</div>';
  }
  exh+='</div><div class="actions"><button class="btn primary sm" id="btnTry" type="button">'+t.tryBtn+'</button></div><div class="msg" id="tryMsg"></div>';
  ex.innerHTML=exh;
  box.appendChild(ex);
  $('btnTry').addEventListener('click',()=>{
    const picks={};
    for(let i=0;i<3;i++){
      const k=box.querySelector('[data-tryk="'+i+'"]').value;
      const q=Number(box.querySelector('[data-tryq="'+i+'"]').value);
      if(k&&q>0) picks[k]=(picks[k]||0)+q;
    }
    const res=tryCraft(picks);
    const m=$('tryMsg');
    if(res.ok){ m.className='msg ok'; m.textContent=t.trySuccess(t.recipes[res.recipe.id].nm); }
    else{
      m.className='msg err';
      m.textContent={empty:t.tryFail,stock:t.tryStock,bench:t.tryBench,nomatch:t.tryFail,
        needs:t.tryNeeds,owned:t.tryOwned}[res.reason]||t.tryFail;
    }
  });
}
/* ── Stage sidebar: harvest tools, watering systems, consumables, rooms ── */
let sbOpen={harv:false,water:false,fert:false,room:false};
const WATER_ICONS={hand:'✋',bucketWood:'🪣',bucketMetal:'🪣',arrosoir:'🚿'};
// painted icons from the Claude Design handoff (downscaled to 128px). Anything without an entry falls back to its emoji.
const SB_ICONS={
  hands:__ASSET__('icon-hand.png'), shears:__ASSET__('icon-cut-tools.png'), shearsUp2:__ASSET__('icon-cut-tools.png'),
  gloves:__ASSET__('icon-gant.png'), glovesUp2:__ASSET__('icon-gant.png'),
  hand:__ASSET__('icon-water-bowl.png'), bucketWood:__ASSET__('icon-seau.png'), bucketMetal:__ASSET__('icon-seau.png'),
  arrosoir:__ASSET__('icon-arrosoire.png'), drip:__ASSET__('icon-goutte.png'), dripPlus:__ASSET__('icon-goutte.png'), dripElec:__ASSET__('icon-goutte.png'),
  compost:__ASSET__('icon-leaf-pile.png'), fert:__ASSET__('icon-manure.png'), fertPlus:__ASSET__('icon-manure-upgraded.png'),
  fertHuman:__ASSET__('icon-fertilizer-green.png'), fertZombie:__ASSET__('icon-fertilizer-purple.png'),
  fertAgent:__ASSET__('icon-serum-green.png'), fertCat:__ASSET__('icon-compost.png'), fertAlien:__ASSET__('icon-serum-purple.png'),
  room:__ASSET__('icon-parcel.png'), lock:__ASSET__('icon-lock-gray.png'), lockOpen:__ASSET__('icon-lock-yellow.png'),
  map:__ASSET__('icon-map.png'), market:__ASSET__('icon-market.png'), workshop:__ASSET__('icon-workshop.png'), journal:__ASSET__('icon-journal.png'),
};
function sbIc(key,emoji){ return SB_ICONS[key]?'<img class="sbic" src="'+SB_ICONS[key]+'" alt="">':'<span class="sbem">'+emoji+'</span>'; }
function tip(nm,fx){ return (nm+'§'+fx).replace(/"/g,'&quot;'); }
function sbGroup(box,key,mainIc,mainTip,itemsHtml,badge){
  const g=document.createElement('div'); g.className='fgroup'+(sbOpen[key]?' open':'');
  g.innerHTML='<span class="slot mini owned sbmain" data-sbg="'+key+'" data-tip="'+mainTip+'" role="button" tabindex="0">'+mainIc+(badge||'')+
    '<span class="sbarrow">'+(sbOpen[key]?'◂':'▸')+'</span></span><span class="fitems">'+itemsHtml+'</span>';
  box.appendChild(g);
}
function gotoRoom(r){
  controlView=false; curRoom=r; _navSig=''; sbOpen.room=false;
  const fl=potList().filter(x=>roomOf(x)===r);
  if(fl.length) selectPot(fl[0]); else { renderGen(); renderHotbar(); render(true); }
  renderSidebar();
}
function sidebarClick(e){ // ONE delegated handler: survives re-renders, whole slot is clickable
  const q=sel=>e.target.closest&&e.target.closest(sel);
  const eq=q('[data-eq]');         if(eq){ e.stopPropagation(); selectEquip(eq.dataset.eq); return; }
  const wm=q('[data-wm]');         if(wm){ e.stopPropagation(); setWaterMode(wm.dataset.wm); return; }
  const rm=q('[data-room]');       if(rm){ e.stopPropagation(); gotoRoom(+rm.dataset.room); return; }
  const ct=q('[data-ctrl]');       if(ct){ e.stopPropagation(); sbOpen.room=false; controlView=true; _navSig=''; _ctrlSig=''; _ctrlEditing=false; render(true); return; }
  const dt=q('[data-driptoggle]'); if(dt){ e.stopPropagation(); S.inv.dripOn=!(S.inv.dripOn!==false); save(); renderSidebar(); renderHotbar();
    const tn=T().recipes[S.inv.dripElecCount>0?'dripElec':(S.inv.dripPlusCount>0?'dripPlus':'drip')].nm;
    showToast((S.inv.dripOn!==false?'✓ ':'⏸ ')+tn); return; }
  const us=q('[data-sbuse]');      if(us){ e.stopPropagation(); useFert(us.dataset.sbuse); return; }
  const gl=q('[data-golock]');     if(gl){ e.stopPropagation();
    const r=RECIPES.find(x=>x.id===gl.dataset.golock); if(!r)return;
    if(!recipeVisible(r)){ openResearch('research'); }
    else{
      const nm=T().recipes[r.id].nm;
      bookFilter={q:nm.toLowerCase(),owned:false,hideUndisc:false,tier:-1,cat:null};
      $('bookSearch').value=nm; bookPage=0; openBook();
    }
    return; }
  const gb=q('[data-sbg]');        if(gb){ e.stopPropagation(); sbOpen[gb.dataset.sbg]=!sbOpen[gb.dataset.sbg]; renderSidebar(); return; }
}
const LOCK_AFTER={shearsUp2:'shears',glovesUp2:'gloves',bucketMetal:'bucketWood',arrosoir:'bucketMetal'}; // upgrades stay hidden until their base item is owned
function lockSlot(rid,t){ // padlocked item inside a fold: click → Laboratory or Crafting
  const r=RECIPES.find(x=>x.id===rid); if(!r||recipeQty(r)>0)return '';
  if(LOCK_AFTER[rid]&&!S.inv.tools[LOCK_AFTER[rid]])return ''; // one step at a time: level II appears once level I is crafted
  const vis=recipeVisible(r);
  return '<span class="slot mini dis lockslot" data-golock="'+rid+'" data-tip="'+
    tip(vis?t.recipes[rid].nm:'❓ ???',(vis?t.tipCraftable:t.tipLocked))+'" role="button" tabindex="0">'+
    sbIc(rid,r.ic)+'<img class="lockmark" src="'+(vis?SB_ICONS.lockOpen:SB_ICONS.lock)+'" alt=""></span>';
}
function renderSidebar(){
  const t=T(), box=$('stageSidebar'); if(!box)return; box.innerHTML='';
  const p=selPlant();
  // ✂ harvest tools — same 3 groups whatever is unlocked; missing items fold away with a padlock
  const harvOpts=[['hands','✋',t.equipHands,t.tipHands]];
  if(S.inv.tools.shears){
    const s2=S.inv.tools.shearsUp2; // the level-II upgrade lives on the same slot
    harvOpts.push(['shears',s2?'✂️²':'✂️',(s2?t.recipes.shearsUp2.nm:t.recipes.shears.nm),(s2?t.recipes.shearsUp2.fx:t.recipes.shears.fx)]);
  }
  if(S.inv.tools.gloves){
    const g2=S.inv.tools.glovesUp2; // the level-II upgrade lives on the same slot
    harvOpts.push(['gloves',g2?'🧤²':'🧤',(g2?t.recipes.glovesUp2.nm:t.recipes.gloves.nm),(g2?t.recipes.glovesUp2.fx:t.recipes.gloves.fx)]);
  }
  {
    const cur=harvOpts.find(o=>o[0]===S.inv.equip)||harvOpts[0];
    let items='';
    for(const [k,ic,nm,fx] of harvOpts){
      if(k===cur[0])continue; // the active tool is the main slot; the fold lists the alternatives
      items+='<span class="slot mini owned" data-eq="'+k+'" data-tip="'+tip(nm,fx)+'" role="button" tabindex="0">'+sbIc(k,ic)+'</span>';
    }
    items+=lockSlot('shears',t)+lockSlot('shearsUp2',t)+lockSlot('gloves',t)+lockSlot('glovesUp2',t);
    sbGroup(box,'harv',sbIc(cur[0],cur[1]),tip(t.equipHarvest,cur[2]),items);
  }
  // 💦 watering systems — click to select; drip is an on/off toggle
  const wOpts=[['hand','✋',t.equipHands,t.tipHandWater]];
  if(S.inv.tools.bucketWood)wOpts.push(['bucketWood','🪣',t.recipes.bucketWood.nm,t.recipes.bucketWood.fx]);
  if(S.inv.tools.bucketMetal)wOpts.push(['bucketMetal','🪣',t.recipes.bucketMetal.nm,t.recipes.bucketMetal.fx]);
  if(S.inv.tools.arrosoir)wOpts.push(['arrosoir','🚿',t.recipes.arrosoir.nm,t.recipes.arrosoir.fx]);
  {
    const mode=waterModeEffective();
    let items='';
    for(const [k,ic,nm,fx] of wOpts){
      if(k===mode)continue;
      items+='<span class="slot mini owned" data-wm="'+k+'" data-tip="'+tip(nm,fx)+'" role="button" tabindex="0">'+sbIc(k,ic)+'</span>';
    }
    if(S.inv.dripCount>0){
      const on=S.inv.dripOn!==false;
      const tierK=S.inv.dripElecCount>0?'dripElec':(S.inv.dripPlusCount>0?'dripPlus':'drip');
      const tierNm=t.recipes[tierK].nm, tierFx=t.recipes[tierK].fx;
      items+='<span class="slot mini owned'+(on&&dripActive()?' sel':'')+(on?'':' dis')+'" data-driptoggle="1" data-tip="'+tip(tierNm,(on?t.dripToggleOn:t.dripToggleOff)+' — '+tierFx)+'" role="button" tabindex="0">'+sbIc(tierK,dripTierIcon())+'</span>';
    }
    items+=lockSlot('bucketWood',t)+lockSlot('bucketMetal',t)+lockSlot('arrosoir',t)+lockSlot('tank',t);
    if(S.inv.dripCount<=0) items+=lockSlot('drip',t);
    sbGroup(box,'water',sbIc(mode,WATER_ICONS[mode]),tip(t.equipWater,waterLabel()),items);
  }
  // 🧪 consumables — the main slot shows the first one in stock (click the fold to use any of them); the rest waits behind padlocks
  {
    let items='', main=null;
    for(const k of Object.keys(FERT_FX)){
      const r=RECIPES.find(x=>x.gives&&Object.keys(x.gives)[0]===k);
      if(S.inv[k]>0){
        const fx=FERT_FX[k];
        const usable=p&&!p.dead&&!p.cut&&(!fx.only||baseTypeOf(p)===fx.only);
        if(!main) main=[k,r.ic];
        items+='<span class="slot mini owned'+(usable?'':' dis')+'" data-sbuse="'+k+'" data-tip="'+tip(t.recipes[r.id].nm,t.recipes[r.id].fx)+'" role="button" tabindex="0">'+sbIc(k,r.ic)+'<span class="qty">'+S.inv[k]+'</span></span>';
      }else if(r) items+=lockSlot(r.id,t);
    }
    sbGroup(box,'fert',main?sbIc(main[0],main[1]):sbIc('compost','🧪'),tip(t.res.fert,t.tipFertGroup),items,main?'<span class="qty">'+S.inv[main[0]]+'</span>':'');
  }
  // 🏠 rooms — the zone on screen is the main slot; the fold lists the other zones, padlocks for those not built yet
  {
    const R=roomsCount(); let items='';
    for(let r=0;r<3;r++){
      if(r===curRoom)continue;
      if(r<R) items+='<span class="slot mini owned" data-room="'+r+'" data-tip="'+tip(t.zoneLbl,roomName(r))+'" role="button" tabindex="0">'+sbIc('room','🏠')+'<span class="qty disp">R'+(r+1)+'</span></span>';
      else { const vis=recipeVisible(RECIPES.find(x=>x.id==='room'));
        items+='<span class="slot mini dis lockslot" data-golock="room" data-tip="'+tip(vis?t.recipes.room.nm:'❓ ???',(vis?t.tipCraftable:t.tipLocked))+'" role="button" tabindex="0">'+
          sbIc('room','🏠')+'<span class="qty disp">R'+(r+1)+'</span><img class="lockmark" src="'+(vis?SB_ICONS.lockOpen:SB_ICONS.lock)+'" alt=""></span>'; }
    }
    if(deskAt()) items+='<span class="slot mini owned'+(controlView?' sel':'')+'" data-ctrl="1" data-tip="'+tip(t.ctrlTitle,'')+'" role="button" tabindex="0"><span class="sbem">🖥️</span><span class="qty disp">CTRL</span></span>';
    sbGroup(box,'room',sbIc('room','🏠'),tip(t.zoneLbl,roomName(curRoom)),items,'<span class="qty disp">R'+(curRoom+1)+'</span>');
  }
}
/* ── bottom-right quick cluster: map (→ market, workshop) and journal ── */
let mapOpen=false;
function renderStageQuick(){
  const t=T(), box=$('stageQuick'); if(!box)return;
  box.innerHTML='<span class="fgroup sq-map'+(mapOpen?' open':'')+'">'+
      '<span class="slot mini sq" data-sq="map" data-tip="'+tip(t.market+' · '+t.book,'')+'" role="button" tabindex="0"><img class="sbic big" src="'+SB_ICONS.map+'" alt=""></span>'+
      '<span class="fitems">'+
        '<span class="slot mini sq" data-sq="market" data-tip="'+tip(t.market,'')+'" role="button" tabindex="0"><img class="sbic big" src="'+SB_ICONS.market+'" alt=""></span>'+
        '<span class="slot mini sq" data-sq="workshop" data-tip="'+tip(t.book,'')+'" role="button" tabindex="0"><img class="sbic big" src="'+SB_ICONS.workshop+'" alt=""></span>'+
      '</span></span>'+
    '<span class="slot mini sq" data-sq="journal" data-tip="'+tip('📓 '+t.journalTitle,'')+'" role="button" tabindex="0"><img class="sbic big" src="'+SB_ICONS.journal+'" alt=""></span>';
}
function stageQuickClick(e){
  const el=e.target.closest&&e.target.closest('[data-sq]'); if(!el)return;
  e.stopPropagation();
  const k=el.dataset.sq;
  if(k==='map'){ mapOpen=!mapOpen; renderStageQuick(); return; }
  mapOpen=false; renderStageQuick(); closeMenu();
  if(k==='market') openMarket();
  else if(k==='workshop'){ bookFilter.cat=null; bookFilter.res=null; bookPage=0; openBook(); } // the design opens on "All"
  else if(k==='journal'){ renderJournal(); $('journalOverlay').classList.add('on'); }
}
function commitDetailsRename(i){
  const inp=document.querySelector('[data-detinput]'); if(!inp)return;
  const v=inp.value.trim().slice(0,18);
  if(!Array.isArray(S.inv.potNames)) S.inv.potNames=[];
  while(S.inv.potNames.length<=i) S.inv.potNames.push('');
  S.inv.potNames[i]=v;
  const p=S.plants[i]; if(p&&v) jlog(p,'named',v);
  _detailsEditing=false; _ctrlSig='';
  save(); render(true);
}
function closeStageFolds(){ // click anywhere else: every fold shuts, like the design's outside-click refs
  closeDetails();
  if(_unlockConfirmSlot>=0){ _unlockConfirmSlot=-1; renderPlotCards(); }
  let any=mapOpen; mapOpen=false;
  for(const k in sbOpen){ if(sbOpen[k]){ any=true; sbOpen[k]=false; } }
  if(any){ renderSidebar(); renderStageQuick(); }
}
/* ── Pixel tooltip (hover bonuses) ── */
function initTooltip(){
  const tt=$('tooltip');
  document.addEventListener('mouseover',e=>{
    const el=e.target.closest&&e.target.closest('[data-tip]');
    if(!el){ tt.style.display='none'; return; }
    const [nm,fx]=el.dataset.tip.split('§');
    tt.innerHTML='<div class="tt-t">'+nm+'</div>'+(fx||'');
    tt.style.display='block';
  });
  document.addEventListener('mousemove',e=>{
    if(tt.style.display==='none')return;
    const w=tt.offsetWidth,h=tt.offsetHeight;
    let x=e.clientX+14,y=e.clientY+14;
    if(x+w>window.innerWidth-8)x=e.clientX-w-10;
    if(y+h>window.innerHeight-8)y=e.clientY-h-10;
    tt.style.left=x+'px'; tt.style.top=y+'px';
  });
}
/* ── Research tree (graph) ── *//* ── Research tree (graph) ── */
function renderResearchTree(){
  const t=T(), box=$('researchTree'); box.innerHTML='';
  $('researchCoins').textContent='🪙 '+fmtCoins(S.inv.coins)+' $';
  const wrap=document.createElement('div'); wrap.className='rt-wrap';
  const cols=document.createElement('div'); cols.className='rt-cols';
  const iconRow=list=>{
    let h='<div class="rt-ic">';
    for(const rid of list){
      const r=RECIPES.find(x=>x.id===rid);
      const vis=recipeVisible(r);
      h+='<span title="'+(vis?t.recipes[rid].nm:t.hiddenNm)+'">'+(vis?r.ic:'❓')+'</span>';
    }
    return h+'</div>';
  };
  [0,1,2,3].forEach(ti=>{
    const col=document.createElement('div'); col.className='rt-col';
    const open=ti===0||tierOpen(ti), done=ti===0||researched(ti);
    const parts=String(t.tierNames[ti]||'').split('—');
    let h='<div class="rt-hd'+(done?' done':(open?' avail':''))+'">'+
      '<span class="rt-lock">'+(open?'🔓':'🔒')+'</span>'+
      '<span class="rt-big">'+(parts[0]||'').trim()+'</span>'+
      '<span class="rt-sub">'+(parts[1]||'').trim()+'</span></div>'+
      '<div class="rt-mark'+(done?' done':'')+'"><i></i></div>';
    if(ti===0){ // starting knowledge: everything already unlocked
      h+='<div class="rt-node done"><div class="rt-nm">🛠 '+t.rBaseNm+'</div>'+
         '<div class="rt-st ok">✓ '+t.rBase+'</div>'+
         iconRow(RECIPES.filter(x=>x.tier===0).map(x=>x.id))+'</div>';
      col.innerHTML=h;
    }else{
      col.innerHTML=h;
      for(const b of RESEARCH_BLOCKS.filter(x=>x.tier===ti)){
        const bd=blockDone(b.id);
        const node=document.createElement('div');
        node.className='rt-node'+(bd?' done':(open?' avail':' locked'));
        let inner='<div class="rt-nm">'+b.ic+' '+t.blocks[b.id].nm+'</div>';
        if(bd) inner+='<div class="rt-st ok">✓ '+t.rDone+'</div>';
        else if(open) inner+='<div class="rt-row"><span class="rt-cost">🪙 '+b.cost+'</span>'+
          '<button class="btn xs primary" data-research="'+b.id+'" type="button">'+t.rGoBtn+'</button></div>';
        else inner+='<div class="rt-row"><span class="rt-cost">🪙 '+b.cost+'</span><span class="lk">🔒</span></div>';
        inner+=iconRow(b.recipes);
        node.innerHTML=inner;
        col.appendChild(node);
      }
    }
    cols.appendChild(col);
  });
  wrap.appendChild(cols); box.appendChild(wrap);
  const foot=document.createElement('div'); foot.className='rt-foot';
  foot.innerHTML='<span>🪙</span><span class="fl">'+t.rFootPts+'</span><span class="pts">'+fmtCoins(S.inv.coins)+'</span>'+
    '<span class="fh">'+t.rFootHint+'</span>';
  box.appendChild(foot);
  box.querySelectorAll('[data-research]').forEach(b=>{
    const rs=RESEARCH_BLOCKS.find(x=>x.id===b.dataset.research);
    b.disabled=S.inv.coins<rs.cost;
    b.addEventListener('click',()=>{ research(b.dataset.research); renderResearchTree(); });
  });
}
/* the Laboratory: one popup, two tabs — research blocks & breeding */
let labTab='research';
function setLabTab(tb){
  labTab=tb;
  $('labTabResearch').classList.toggle('on',tb==='research');
  $('labTabBreed').classList.toggle('on',tb==='breed');
  $('labTabTry').classList.toggle('on',tb==='try');
  $('researchTree').hidden=tb!=='research';
  $('breedBody').hidden=tb!=='breed';
  $('tryBody').hidden=tb!=='try';
  if(tb==='research') renderResearchTree();
  else if(tb==='breed') renderBreed();
  else renderTryLab();
}
function openResearch(tab){ $('researchOverlay').classList.add('on'); setLabTab(typeof tab==='string'?tab:'research'); }
function closeResearch(){ $('researchOverlay').classList.remove('on'); }
function openBook(){ $('bookOverlay').classList.add('on'); renderBook(); }
/* ── Breeding lab UI ── */
function parentLabel(key,t){
  if(key.startsWith('s_')){ const s=S.strains[key]; return '🧬 '+s.name+' (×'+(S.inv.strainSeeds[key]||0)+')'; }
  const v=VARIETIES[key];
  return '🌱 '+vName(v)+' ×'+(S.inv.seedsVar[key]||0);
}
let breedSelA=null, breedSelB=null; // parents survive re-renders: chain attempts freely
function renderBreed(){
  const t=T(), box=$('breedBody'); box.innerHTML='';
  if(!S.inv.tools.breedlab){
    box.innerHTML='<p class="hint" style="margin:8px 0">'+t.breedNeedLab+'</p>';
    return;
  }
  const opts=breedParents();
  if(!opts.length){ box.innerHTML='<p class="hint" style="margin:8px 0">'+t.breedNoSeeds+'</p>'; return; }
  if(!opts.includes(breedSelA)) breedSelA=opts[0];
  if(!opts.includes(breedSelB)) breedSelB=opts[1]||opts[0];
  const optHtml=k0=>opts.map(k=>'<option value="'+k+'"'+(k===k0?' selected':'')+'>'+parentLabel(k,t)+'</option>').join('');
  const selStyle='background:var(--ground);color:var(--paper);border:2px solid var(--line);font-family:inherit;font-size:.62rem;padding:5px;max-width:100%';
  box.innerHTML='<p class="hint" style="margin:6px 0">'+t.breedHint+'</p>'+
    '<div class="recipes">'+
    '<div class="hotrow"><span style="font-size:.62rem">'+t.breedParentA+'</span><select id="breedA" style="'+selStyle+'">'+optHtml(breedSelA)+'</select></div>'+
    '<div class="hotrow"><span style="font-size:.62rem">'+t.breedParentB+'</span><select id="breedB" style="'+selStyle+'">'+optHtml(breedSelB)+'</select></div>'+
    '</div>'+
    '<p class="hint" style="margin:8px 0">'+t.breedCost(BREED_FEE,Math.round(BREED_CHANCE*100))+'</p>'+
    '<div class="actions"><button class="btn primary sm" id="btnDoBreed" type="button">'+t.breedBtn+'</button>'+
    '<button class="btn sm" id="btnDoBreed10" type="button">'+t.breedBtn10+'</button></div>'+
    '<div class="msg" id="breedMsg" role="status"></div>';
  $('breedA').addEventListener('change',e=>{ breedSelA=e.target.value; });
  $('breedB').addEventListener('change',e=>{ breedSelB=e.target.value; });
  const runBatch=n=>{
    breedSelA=$('breedA').value; breedSelB=$('breedB').value;
    let okN=0, failN=0, names=[], lastMsg='', lastStrain=null;
    for(let i=0;i<n;i++){
      const res=breed(breedSelA,breedSelB);
      if(res.ok){ okN++; names.push(res.strain.name); lastStrain=res.strain; }
      else if(res.fail){ failN++; }
      else { lastMsg=res.msg; break; } // blocked: no seeds / coins / lab
    }
    lastRes=''; renderResources(true); renderWorkshop();
    renderBreed(); // parents stay selected
    const m=$('breedMsg');
    if(okN+failN===0){ m.className='msg err'; m.textContent=lastMsg||T().breedNoSeeds; }
    else if(n===1){ m.className='msg '+(okN?'ok':'err'); m.textContent=okN?T().breedOk(lastStrain.name,T().rar[lastStrain.rar]):T().breedFail; }
    else { m.className='msg '+(okN?'ok':'err'); m.textContent=T().breedBatchMsg(okN,failN,names)+(lastMsg?(' · '+lastMsg):''); }
  };
  $('btnDoBreed').addEventListener('click',()=>runBatch(1));
  $('btnDoBreed10').addEventListener('click',()=>runBatch(10));
}
function openBreed(){ openResearch('breed'); }
/* ── 🧫 Experiment lab: drag components onto a plus-shaped table, try, get hints ── */
const TRY_RES=['px','wood','stone','metal','mineral','fert','soil','compost'];
let tryTable=[null,null,null,null,null]; // 5 slots: N, W, center, E, S
function tryPicks(){ return tryTable.filter(Boolean).map(s=>s.res); }
function tryHintScore(keys){ // Mastermind-style closeness vs the nearest still-hidden recipe (kinds only)
  const cand=RECIPES.filter(r=>r.cost&&!recipeVisible(r));
  if(!cand.length) return null;
  let best=null;
  for(const r of cand){
    const ck=Object.keys(r.cost);
    const ing=ck.filter(k=>keys.includes(k)).length;
    const extra=keys.filter(k=>!ck.includes(k)).length;
    const pct=Math.max(0,Math.min(99,Math.round(100*ing/ck.length)-extra*15));
    if(!best||pct>best.pct) best={pct,ing,n:ck.length};
  }
  return best;
}
function slotHtml(i,t){
  const s=tryTable[i];
  if(!s) return '<div class="try-slot" data-tryslot="'+i+'"><span class="try-plus">+</span></div>';
  return '<div class="try-slot filled" data-tryslot="'+i+'">'+
    '<span class="try-ic">'+t.resIc[s.res]+'</span>'+
    '<span class="try-btns"><button class="btn xs" data-tryclear="'+i+'" type="button">✕</button></span></div>';
}
function renderTryLab(){
  const t=T(), box=$('tryBody'); box.innerHTML='';
  let src='<div class="tname">🧫 '+t.tryTitle+'</div><p class="hint" style="margin:6px 0">'+t.tryDnDHint+'</p>'+
    '<div class="try-wrap"><div class="try-src-col"><div class="menu-lbl" style="margin-bottom:6px">'+t.tryComponents+'</div>';
  for(const k of TRY_RES){
    src+='<div class="try-src" draggable="true" data-tryres="'+k+'">'+t.resIc[k]+' '+t.res[k]+'<span class="qty">×'+(S.inv[k]||0)+'</span></div>';
  }
  src+='</div><div class="try-table-col"><div class="menu-lbl" style="margin-bottom:6px">'+t.tryTableLbl+'</div><div class="try-grid">'+
    '<span></span>'+slotHtml(0,t)+'<span></span>'+
    slotHtml(1,t)+slotHtml(2,t)+slotHtml(3,t)+
    '<span></span>'+slotHtml(4,t)+'<span></span>'+
    '</div><div class="actions" style="margin-top:10px"><button class="btn primary sm" id="btnTryGo" type="button">'+t.tryBtn+'</button>'+
    '<button class="btn ghost sm" id="btnTryClear" type="button">✕</button></div>'+
    '<div class="msg" id="tryMsg" role="status"></div></div></div>';
  box.innerHTML=src;
  // drag & drop (click a component also drops it on the first free slot)
  box.querySelectorAll('[data-tryres]').forEach(el=>{
    el.addEventListener('dragstart',e=>{ e.dataTransfer.setData('text/plain',el.dataset.tryres); });
    el.addEventListener('click',()=>{ dropRes(el.dataset.tryres,null); });
  });
  box.querySelectorAll('[data-tryslot]').forEach(el=>{
    el.addEventListener('dragover',e=>{ e.preventDefault(); el.classList.add('over'); });
    el.addEventListener('dragleave',()=>el.classList.remove('over'));
    el.addEventListener('drop',e=>{ e.preventDefault(); el.classList.remove('over'); dropRes(e.dataTransfer.getData('text/plain'),Number(el.dataset.tryslot)); });
  });
  box.querySelectorAll('[data-tryclear]').forEach(b=>b.addEventListener('click',()=>{
    tryTable[Number(b.dataset.tryclear)]=null; renderTryLab();
  }));
  $('btnTryClear').addEventListener('click',()=>{ tryTable=[null,null,null,null,null]; renderTryLab(); });
  $('btnTryGo').addEventListener('click',tryGo);
}
function dropRes(res,slot){
  if(!TRY_RES.includes(res))return;
  if(tryTable.some(s=>s&&s.res===res))return; // one block per ingredient kind — quantities don't exist here
  if(slot!=null&&!tryTable[slot]) tryTable[slot]={res};
  else{
    const free=tryTable.findIndex(s=>!s);
    if(free<0)return;
    tryTable[free]={res};
  }
  renderTryLab();
}
function tryGo(){
  const t=T(), m=$('tryMsg');
  const picks=tryPicks();
  const res=tryCraft(picks);
  if(res.ok){
    m.className='msg ok';
    m.textContent=res.crafted?t.trySuccess(t.recipes[res.recipe.id].nm):t.tryRevealed(t.recipes[res.recipe.id].nm);
    tryTable=[null,null,null,null,null];
    const keep=m.textContent; renderTryLab();
    const m2=$('tryMsg'); m2.className='msg ok'; m2.textContent=keep;
    return;
  }
  let msg={empty:t.tryFail,stock:t.tryStock,bench:t.tryBench,nomatch:t.tryFail,
    needs:t.tryNeeds,owned:t.tryOwned}[res.reason]||t.tryFail;
  if(res.reason==='nomatch'){
    const hint=tryHintScore(picks);
    if(hint) msg+=' '+t.tryHintLine(hint.pct,hint.ing);
    else msg+=' '+t.tryAllFound;
  }
  m.className='msg err'; m.textContent=msg;
}
/* ── Seed vault: every seed is typed, with its own properties; sell price = rarity only ── */
let seedPage=0;
const SEEDS_PER_PAGE=5;
function seedPrice(rar){ return SEED_PRICE[rar]!=null?SEED_PRICE[rar]:2; }
let seedFilter={comm:null,rar:null,sort:null};
function seedStats(e){ // the variety/strain carrying this seed's numbers
  if(e.kind==='b') return VARIETIES[e.key];
  if(e.kind==='h') return VARIETIES[HYBRIDS[e.key].v];
  return S.strains[e.key];
}
function seedComm(e){
  if(e.kind==='b') return e.gk||S.comm;
  if(e.kind==='h') return 'normies';
  return (S.strains[e.key]&&S.strains[e.key].comm)||'normies';
}
const RAR_ORDER={noNormie:0,common:1,widespread:2,uncommon:3,rare:4,hybrid:5,veryRare:6,epic:7,legendary:8};
function buildSeedEntries(){
  const out=[];
  // base seeds of EVERY plantation (the vault shows the whole account)
  for(const ty of Object.keys(S.inv.seedsVar)) if(S.inv.seedsVar[ty]>0&&VARIETIES[ty]) out.push({kind:'b',key:ty,gk:null});
  for(const gk of Object.keys(S.gardens)){
    const g=S.gardens[gk]; if(!g||!g.seedsVar)continue;
    for(const ty of Object.keys(g.seedsVar)) if(g.seedsVar[ty]>0&&VARIETIES[ty]) out.push({kind:'b',key:ty,gk});
  }
  for(const k of Object.keys(HYBRIDS)) if((S.inv[k]||0)>0) out.push({kind:'h',key:k});
  for(const id of Object.keys(S.strains)) if((S.inv.strainSeeds[id]||0)>0) out.push({kind:'s',key:id});
  let list=out;
  if(seedFilter.comm) list=list.filter(e=>seedComm(e)===seedFilter.comm);
  if(seedFilter.rar) list=list.filter(e=>{ const v=seedStats(e); return v&&v.rar===seedFilter.rar; });
  if(seedFilter.sort){
    const val=e=>{ const v=seedStats(e)||{}; return seedFilter.sort==='rar'?(RAR_ORDER[v.rar]||0):(v[seedFilter.sort]||0); };
    list=list.slice().sort((a,b)=>val(b)-val(a));
  }
  return list;
}
function seedStore(e){ return e.gk?S.gardens[e.gk].seedsVar:S.inv.seedsVar; }
function seedInfo(e){ // {ic,nm,accent,props,rar,qty}
  const t=T();
  if(e.kind==='b'){ const v=VARIETIES[e.key];
    return {ic:'🌱',nm:vName(v),accent:v.accent,props:t.varLine(e.key,v),rar:v.rar,qty:seedStore(e)[e.key]||0}; }
  if(e.kind==='h'){ const v=VARIETIES[HYBRIDS[e.key].v];
    return {ic:'⚗️',nm:vName(v),accent:v.accent,props:t.hyb[e.key],rar:'hybrid',qty:S.inv[e.key]}; }
  const s=S.strains[e.key];
  return {ic:'🧬',nm:s.name,accent:s.accent,props:t.strainParents(s.parents[0],s.parents[1])+' · '+t.strainLine(s),rar:s.rar,qty:S.inv.strainSeeds[e.key]};
}
function seedDec(e){ // remove one seed of this entry; true if done
  if(e.kind==='b'){ const st=seedStore(e); if((st[e.key]||0)<=0)return false; st[e.key]--; return true; }
  if(e.kind==='h'){ if((S.inv[e.key]||0)<=0)return false; S.inv[e.key]--; return true; }
  if((S.inv.strainSeeds[e.key]||0)<=0)return false; S.inv.strainSeeds[e.key]--; return true;
}
function sellSeed(e){
  const inf=seedInfo(e);
  if(!seedDec(e))return;
  const p=seedPrice(inf.rar);
  S.inv.coins+=p;
  S.stats.coinsEarned=(S.stats.coinsEarned||0)+p;
  questBump('sell',1);
  save(); lastRes=''; renderResources(true); renderSeedVault();
  showToast('🪙 +'+p+' — '+inf.nm);
}
function destroySeed(e){
  const inf=seedInfo(e);
  if(!seedDec(e))return;
  save(); lastRes=''; renderResources(true); renderSeedVault();
  showToast('🗑 '+inf.nm);
}
let seedPageEntries=[];
function renderSeedFilters(){
  const t=T();
  // collection tabs
  const box=$('seedCommTabs'); box.innerHTML='';
  const tabs=[[null,t.tierAll]].concat(Object.keys(COMMUNITIES).map(k=>[k,COMMUNITIES[k].ic]));
  for(const [k,lbl] of tabs){
    const b=document.createElement('button');
    b.type='button'; b.className='btn xs'+(seedFilter.comm===k?' on':'');
    b.textContent=lbl;
    b.addEventListener('click',()=>{ seedFilter.comm=k; seedPage=0; renderSeedVault(); });
    box.appendChild(b);
  }
  // rarity select
  const rs=$('seedRarSel'); rs.innerHTML='';
  const rars=[['',t.fltRarity]].concat(Object.keys(RAR_ORDER).map(r=>[r,t.rar[r]]));
  for(const [v,lbl] of rars){ const o=document.createElement('option'); o.value=v; o.textContent=lbl; rs.appendChild(o); }
  rs.value=seedFilter.rar||'';
  // sort select
  const ss=$('seedSortSel'); ss.innerHTML='';
  for(const [v,lbl] of [['',t.fltSort],['speed',t.sortSpeed],['yield',t.sortYield],['seedLuck',t.sortSeed],['hydMult',t.sortResist],['woodMult',t.sortWood],['rar',t.sortRar]]){
    const o=document.createElement('option'); o.value=v; o.textContent=lbl; ss.appendChild(o);
  }
  ss.value=seedFilter.sort||'';
}
function renderSeedVault(){
  const t=T(), box=$('seedBody'); box.innerHTML='';
  $('seedTitle').textContent=seedPickMode?t.pickerTitle:('🌰 '+t.seedVaultTitle);
  renderSeedFilters();
  const entries=buildSeedEntries();
  const pages=[];
  for(let i=0;i<entries.length;i+=SEEDS_PER_PAGE) pages.push(entries.slice(i,i+SEEDS_PER_PAGE));
  if(!pages.length) pages.push([]);
  seedPage=clamp(seedPage,0,pages.length-1);
  $('seedPageLbl').textContent=(seedPage+1)+' / '+pages.length;
  $('btnSeedPgPrev').disabled=seedPage===0;
  $('btnSeedPgNext').disabled=seedPage===pages.length-1;
  const sec=document.createElement('div'); sec.className='tier'; sec.style.marginTop='4px';
  sec.innerHTML='<div class="tname">'+(seedPickMode?t.pickerTitle:t.seedVaultTitle)+'</div><p class="hint" style="margin:6px 0">'+(seedPickMode?t.seedPickHint:t.seedVaultHint)+'</p>';
  const wrap=document.createElement('div'); wrap.className='recipes';
  if(!pages[seedPage].length){
    const d=document.createElement('p'); d.className='hint'; d.textContent=t.vaultEmpty;
    wrap.appendChild(d);
  }
  const canPlant=slotFree(S.plants[S.sel]);
  seedPageEntries=pages[seedPage];
  pages[seedPage].forEach((e,ei)=>{
    const inf=seedInfo(e);
    const allowed=(e.kind==='b'?(typeAllowed(e.key)&&!e.gk):(e.kind==='h'?hybridAllowed():strainAllowed(e.key)));
    const commIc=(COMMUNITIES[seedComm(e)]||{}).ic||'';
    const d=document.createElement('div'); d.className='recipe owned';
    let inner='<span class="ic">'+inf.ic+'</span><span class="mid">'+
      '<div class="nm"><span style="color:'+inf.accent+'">'+inf.nm+'</span> <span class="own">'+commIc+' '+t.rar[inf.rar]+'</span>'+
      (allowed?'':' <span class="own">🔒 '+t.commLock+'</span>')+'</div>'+
      '<div class="fx">'+inf.props+'</div>'+
      '<div class="cost">×'+inf.qty+'</div></span>';
    if(!seedPickMode){
      inner+='<span class="act">'+
      '<button class="btn xs" data-sv-plant="'+ei+'" type="button"'+(canPlant&&allowed?'':' disabled')+'>'+t.plantBtn+'</button>'+
      '<button class="btn xs" data-sv-sell="'+ei+'" type="button">'+t.sellFor(seedPrice(inf.rar))+'</button>'+
      '<button class="btn xs" data-sv-kill="'+ei+'" type="button">🗑</button>'+
      '</span>';
    }else if(canPlant&&allowed){
      d.style.cursor='var(--cur-click,pointer)'; d.dataset.svRow=ei; // the whole row plants on click
    }else{
      d.classList.add('locked');
    }
    d.innerHTML=inner;
    wrap.appendChild(d);
  });
  sec.appendChild(wrap);
  box.appendChild(sec);
  const plantEntry=e=>{
    closeSeeds();
    if(e.kind==='b')plantTypedSeed(e.key); else if(e.kind==='h')plantHybrid(e.key); else plantStrain(e.key);
  };
  box.querySelectorAll('[data-sv-plant]').forEach(b=>b.addEventListener('click',()=>{
    const e=seedPageEntries[Number(b.dataset.svPlant)]; if(e)plantEntry(e);
  }));
  box.querySelectorAll('[data-sv-row]').forEach(r=>r.addEventListener('click',()=>{
    const e=seedPageEntries[Number(r.dataset.svRow)]; if(e)plantEntry(e);
  }));
  box.querySelectorAll('[data-sv-sell]').forEach(b=>b.addEventListener('click',()=>{ const e=seedPageEntries[Number(b.dataset.svSell)]; if(e)sellSeed(e); }));
  box.querySelectorAll('[data-sv-kill]').forEach(b=>b.addEventListener('click',()=>{ const e=seedPageEntries[Number(b.dataset.svKill)]; if(e)destroySeed(e); }));
}
function openSeeds(){ seedPickMode=false; seedPage=0; renderSeedVault(); $('seedOverlay').classList.add('on'); }
function closeSeeds(){ seedPickMode=false; $('seedOverlay').classList.remove('on'); }
function closeBook(){ $('bookOverlay').classList.remove('on'); }
/* ── Market ── */
function sell(k,q){
  q=Math.min(q,S.inv[k]); if(q<=0)return;
  S.inv[k]-=q; S.inv.coins=Math.round((S.inv.coins+sellNet(k,q))*10)/10;
  S.stats.coinsEarned=(S.stats.coinsEarned||0)+sellNet(k,q);
  questBump('sell',1);
  save(); lastRes=''; renderResources(true); renderMarket(); renderWorkshop(); render(true);
}
function buyRes(k,q){
  const cost=MARKET[k]*q; if(S.inv.coins<cost)return;
  S.inv.coins-=cost; S.inv[k]+=q;
  save(); lastRes=''; renderResources(true); renderMarket(); renderWorkshop(); render(true);
}
function renderMarket(){
  const t=T(), box=$('marketBody'); box.innerHTML='';
  $('marketTitle').textContent=t.market;
  $('marketCoins').textContent='🪙 '+fmtCoins(S.inv.coins)+' $';
  $('marketFeeLine').textContent=t.marketFee;
  for(const k of Object.keys(MARKET)){
    const p=MARKET[k];
    const d=document.createElement('div'); d.className='recipe';
    d.innerHTML='<span class="ic">'+t.resIc[k]+'</span>'+
      '<span class="mid"><div class="nm">'+t.res[k]+' <span class="own" data-mk-have="'+k+'">· '+t.have+' '+S.inv[k]+'</span></div>'+
      '<div class="fx">'+t.unit(p)+' · '+t.sell+': +'+fmtCoins(sellNet(k,1))+' $</div></span>'+
      '<span class="act">'+
      '<button class="btn xs" data-sell="'+k+'" data-q="1" type="button">'+t.sell+' 1</button>'+
      '<button class="btn xs" data-sell="'+k+'" data-q="10" type="button">×10</button>'+
      '<button class="btn xs ghost" data-buy="'+k+'" data-q="1" type="button">'+t.buy+' 1</button>'+
      '<button class="btn xs ghost" data-buy="'+k+'" data-q="10" type="button">×10</button>'+
      '</span>';
    box.appendChild(d);
  }
  // hybrid seeds — buy only, coins only (Normie-ecosystem seeds: hidden in other plantations)
  if(hybridAllowed()){
  const hd=document.createElement('div'); hd.className='tier';
  hd.innerHTML='<div class="tname">⚗️ '+t.hybTitle+'</div><p class="hint" style="margin:6px 0">'+t.hybNote+'</p>';
  box.appendChild(hd);
  for(const kind of Object.keys(HYBRIDS)){
    const h=HYBRIDS[kind], hv=VARIETIES[h.v];
    const d=document.createElement('div'); d.className='recipe';
    d.innerHTML='<span class="ic">⚗️</span>'+
      '<span class="mid"><div class="nm"><span style="color:'+hv.accent+'">'+vName(hv)+'</span> <span class="own" data-mk-have="'+kind+'">· '+t.have+' '+S.inv[kind]+'</span></div>'+
      '<div class="fx">'+t.hyb[kind]+'</div>'+
      '<div class="cost">'+h.price+' $</div></span>'+
      '<span class="act"><button class="btn xs" data-buyhyb="'+kind+'" type="button">'+t.buy+' 1</button></span>';
    box.appendChild(d);
  }
  }
  box.querySelectorAll('[data-sell]').forEach(b=>b.addEventListener('click',()=>sell(b.dataset.sell,Number(b.dataset.q))));
  box.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>buyRes(b.dataset.buy,Number(b.dataset.q))));
  box.querySelectorAll('[data-buyhyb]').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.buyhyb;
    if(S.inv.coins<HYBRIDS[k].price)return;
    S.inv.coins-=HYBRIDS[k].price; S.inv[k]++;
    save(); renderMarket(); renderWorkshop(); render(true);
  }));
  marketRefresh();
}
function marketRefresh(){
  const t=T();
  $('marketCoins').textContent='🪙 '+fmtCoins(S.inv.coins)+' $';
  $('marketBody').querySelectorAll('[data-mk-have]').forEach(el=>{ el.textContent='· '+t.have+' '+S.inv[el.dataset.mkHave]; });
  $('marketBody').querySelectorAll('[data-sell]').forEach(b=>{ b.disabled=S.inv[b.dataset.sell]<Number(b.dataset.q); });
  $('marketBody').querySelectorAll('[data-buy]').forEach(b=>{ b.disabled=S.inv.coins<MARKET[b.dataset.buy]*Number(b.dataset.q); });
  $('marketBody').querySelectorAll('[data-buyhyb]').forEach(b=>{ b.disabled=S.inv.coins<HYBRIDS[b.dataset.buyhyb].price; });
}
function openMarket(){ renderMarket(); $('marketOverlay').classList.add('on'); }
function closeMarket(){ $('marketOverlay').classList.remove('on'); }
/* ── Intro / info ── */
function openIntro(){
  const t=T();
  $('introTitle').textContent=t.introTitle;
  $('introBody').innerHTML=t.introBody;
  $('btnIntroGo').textContent=t.introGo;
  $('introOverlay').classList.add('on');
}
/* ── first-launch tutorial: spotlight steps over the real interface ── */
const TUTO_STEPS=[
  {target:null,        key:'t0'},
  {target:'plantCanvas',key:'t1'},
  {target:'plantCanvas',key:'t2'}, // water/harvest live on the plant itself (double-click) since the panel under the scene went away
  {target:'plantCanvas',key:'t3'},
  {target:'workshopCard', key:'tw'},
  {targetSel:'#researchOverlay .book', key:'t4', open:()=>openResearch('research'), close:closeResearch},
  {targetSel:'#bookOverlay .book',     key:'t5', close:closeBook,
   open:()=>{ bookFilter={q:'',owned:false,hideUndisc:false,tier:-1,cat:null}; $('bookSearch').value=''; bookPage=0; openBook(); }},
  {target:'topQB', key:'t6', // finale: the quests & badges buttons up in the top bar
   open:()=>{ if(isMobile()) document.body.classList.add('hamb-open'); },
   close:()=>{ document.body.classList.remove('hamb-open'); }},
];
const TUTO2_STEPS=[
  {target:'hudResStrip', key:'w0'},
  {target:'plantCanvas', key:'w0b'},
  {targetSel:'[data-rid="workbench"]', key:'w1',
   open:()=>{ bookFilter={q:'',owned:false,hideUndisc:false,tier:-1,cat:null}; $('bookSearch').value=''; bookPage=0; openBook(); }},
  {targetSel:'[data-craft="workbench"]', key:'w2'},
];
const SIDEBAR_TOOLS={shears:['harv','[data-eq="shears"]'],shearsUp2:['harv','[data-eq="shears"]'],gloves:['harv','[data-eq="gloves"]'],glovesUp2:['harv','[data-eq="gloves"]'],
  bucketWood:['water','[data-wm="bucketWood"]'],bucketMetal:['water','[data-wm="bucketMetal"]'],arrosoir:['water','[data-wm="arrosoir"]']};
function maybeTuto3(rid){ // first equipable tool ever crafted: where it lives, how to equip it, and that it stays on
  const g=SIDEBAR_TOOLS[rid]; if(!g||S.tuto3Seen||tutoStep>=0)return;
  const steps=[
    {targetSel:'[data-sbg="'+g[0]+'"]', key:'e0', open:()=>{ closeBook(); sbOpen[g[0]]=true; renderSidebar(); }},
    {targetSel:g[1], key:'e1'},
    {targetSel:g[1], key:'e2'},
  ];
  setTimeout(()=>runTuto(steps,'tuto3Seen'),350);
}
function maybeTuto4(kind){ // first fertilizer ever crafted: where to apply it, and where the active bonus shows
  if(!FERT_FX[kind]||S.tuto4Seen||tutoStep>=0)return;
  const steps=[
    {targetSel:'[data-sbg="fert"]', key:'f0', open:()=>{ closeBook(); sbOpen.fert=true; renderSidebar(); }},
    {targetSel:'[data-sbuse="'+kind+'"]', key:'f1'},
    {target:'plantBadges', key:'f2'},
  ];
  setTimeout(()=>runTuto(steps,'tuto4Seen'),350);
}
const TUTO5_STEPS=[ {target:'plantCanvas', key:'g0'}, {target:'plantCanvas', key:'g1'} ];
const TUTO6_STEPS=[ {target:'plantCanvas', key:'h0'}, {target:'plantCanvas', key:'h1'} ];
function maybeTuto6(){ // right after the 2nd cut (guaranteed 2nd seed): how to plant straight in the ground
  if(S.tuto6Seen||tutoStep>=0||!S.tutoSeen)return;
  if(!$('scrGarden').classList.contains('on')||controlView)return;
  setTimeout(()=>{ if(tutoStep<0) runTuto(TUTO6_STEPS,'tuto6Seen'); },900);
}
function maybeTuto5(){ // first time ever a plant reaches 80% growth: double-click to water, double-click harvests only at 100% + all flowers
  if(S.tuto5Seen||tutoStep>=0||!S.tutoSeen)return;
  if(!$('scrGarden').classList.contains('on')||controlView)return;
  const i=S.plants.findIndex(p=>p&&!p.dead&&!p.cut&&progress(p)>=0.8);
  if(i<0)return;
  if(i!==S.sel) selectPot(i);
  runTuto(TUTO5_STEPS,'tuto5Seen');
}
function maybeTuto2(){ // fires once, right after the very first harvest, while the Workbench is unbuilt
  if(!S.tuto2Seen&&!S.inv.tools.workbench&&tutoStep<0) setTimeout(()=>runTuto(TUTO2_STEPS,'tuto2Seen'),350);
}
let tutoStep=-1;
let tutoList=null, tutoFlag=null;
let _tutoTick=null;
function refreshTutoRing(){ // the layout can move after a step is placed (toast, re-render): keep the ring glued to its target
  if(tutoStep<0||!tutoList)return;
  const st=tutoList[tutoStep]; if(!st)return;
  let el=st.target?$(st.target):(st.targetSel?document.querySelector(st.targetSel):null);
  while(el&&(el.hidden||el.getBoundingClientRect().width===0)&&el.parentElement&&el!==document.body) el=el.parentElement;
  const ring=$('tutoRing'); if(!el||!ring||ring.hidden)return;
  const r=el.getBoundingClientRect(), pad=8;
  if(!r.width&&!r.height)return;
  ring.style.left=(r.left-pad)+'px'; ring.style.top=(r.top-pad)+'px';
  ring.style.width=(r.width+2*pad)+'px'; ring.style.height=(r.height+2*pad)+'px';
}
function runTuto(list,flag){
  if(S[flag])return;
  tutoList=list; tutoFlag=flag; tutoStep=0;
  ensureTutoDom();
  clearInterval(_tutoTick); _tutoTick=setInterval(refreshTutoRing,300);
  renderTuto();
}
function ensureTutoDom(){
  if(!$('tutoRing')){
    const ring=document.createElement('div'); ring.id='tutoRing'; ring.className='tuto-ring'; ring.hidden=true;
    const card=document.createElement('div'); card.id='tutoCard'; card.hidden=true;
    document.body.appendChild(ring); document.body.appendChild(card);
  }
}
function startTuto(){ runTuto(TUTO_STEPS,'tutoSeen'); }
function _startTutoLegacy(){
  if(S.tutoSeen)return;
  tutoStep=0;
  if(!$('tutoRing')){
    const ring=document.createElement('div'); ring.id='tutoRing'; ring.className='tuto-ring'; ring.hidden=true;
    const card=document.createElement('div'); card.id='tutoCard'; card.hidden=true;
    document.body.appendChild(ring); document.body.appendChild(card);
  }
  renderTuto();
}
function endTuto(){
  tutoStep=-1; if(tutoFlag)S[tutoFlag]=true; save();
  clearInterval(_tutoTick); _tutoTick=null;
  const r=$('tutoRing'), c=$('tutoCard');
  if(r)r.hidden=true; if(c)c.hidden=true;
}
function renderTuto(){
  const st=(tutoList||TUTO_STEPS)[tutoStep];
  if(!st){ endTuto(); return; }
  if(st.open){ st.open(); setTimeout(()=>positionTuto(st),90); } // the real window opens BEHIND the card
  else positionTuto(st);
}
function positionTuto(st){
  const t=T().tuto;
  const ring=$('tutoRing'), card=$('tutoCard');
  card.hidden=false;
  const last=tutoStep===(tutoList||TUTO_STEPS).length-1;
  card.innerHTML='<div class="tstep">'+(tutoStep+1)+' / '+(tutoList||TUTO_STEPS).length+'</div>'+
    '<div>'+t[st.key]+'</div>'+
    '<div class="actions"><button class="btn primary sm" id="tutoNext" type="button">'+(last?t.done:t.next)+'</button>'+
    '<button class="btn ghost sm" id="tutoSkip" type="button">'+t.skip+'</button></div>';
  $('tutoNext').addEventListener('click',()=>{ if(st.close)st.close(); tutoStep++; renderTuto(); });
  $('tutoSkip').addEventListener('click',()=>{ if(st.close)st.close(); endTuto(); });
  let el=st.target?$(st.target):(st.targetSel?document.querySelector(st.targetSel):null);
  while(el&&(el.hidden||el.getBoundingClientRect().width===0)&&el.parentElement&&el!==document.body) el=el.parentElement; // hidden target (Harvest swapped for Replant…): highlight its visible slot instead
  if(el){
    try{ el.scrollIntoView({block:'nearest'}); }catch(_){}
    const r=el.getBoundingClientRect(), pad=8;
    ring.hidden=false;
    ring.style.left=(r.left-pad)+'px'; ring.style.top=(r.top-pad)+'px';
    ring.style.width=(r.width+2*pad)+'px'; ring.style.height=(r.height+2*pad)+'px';
    // card below the target if room, else above
    const ch=card.getBoundingClientRect().height||160;
    let cy=r.bottom+pad+12;
    if(cy+ch>window.innerHeight-10) cy=Math.max(10,r.top-pad-12-ch);
    let cx=Math.min(Math.max(10,r.left),window.innerWidth-420);
    card.style.left=cx+'px'; card.style.top=cy+'px';
  }else{
    ring.hidden=false;
    ring.style.left='50%'; ring.style.top='0'; ring.style.width='0'; ring.style.height='0';
    card.style.left=Math.max(10,(window.innerWidth-420)/2)+'px';
    card.style.top='120px';
  }
}
function closeIntro(){
  $('introOverlay').classList.remove('on');
  if(!S.introSeen){ S.introSeen=true; save(); }
  ensureNotifPermission(); // user gesture: right moment to ask
}
/* ── Inventory (crafted items) ── */
function invQtyKey(r){ return r.kind==='multi' ? r.cnt : Object.keys(r.gives)[0]; }
function renderInventory(){ // refresh whichever of the crafting book / inventory popup is open
  if($('bookOverlay').classList.contains('on')) renderBook();
  else refreshWorkshopButtons();
  if($('invOverlay')&&$('invOverlay').classList.contains('on')) renderInvPopup();
}
/* ── Inventory popup (design "Ressources" card): categories, search, sort, tile grid ── */
const INV_CATS=[['all','🔷'],['ess','⭐'],['cult','🌱'],['min','⛏️'],['craft','⚙️'],['spec','✨']];
let invCat='all', invQ='', invAsc=true;
function invItems(){ // every countable thing the player holds, tagged with a design category
  const t=T(), out=[];
  const res=(k,cat)=>out.push({k,cat,ic:t.resIc[k]||'',nm:t.res[k]||k,qty:resVal(k),res:true});
  res('coins','ess'); res('px','ess'); res('wood','cult'); res('seeds','cult'); res('stone','min'); res('metal','min'); res('mineral','min');
  for(const r of RECIPES){ if(r.kind!=='consumable')continue; const k=Object.keys(r.gives)[0]; if(!(S.inv[k]>0))continue;
    out.push({k,cat:FERT_FX[k]&&FERT_FX[k].only?'spec':'craft',ic:r.ic,nm:t.recipes[r.id].nm,qty:S.inv[k],rid:r.id}); }
  return out;
}
function openInventory(){ invQ=''; const s=$('invSearch'); if(s) s.value=''; renderInvPopup(); $('invOverlay').classList.add('on'); }
function closeInventory(){ $('invOverlay').classList.remove('on'); }
function renderInvPopup(){
  const t=T(), cats=$('invCats'), grid=$('invGrid'); if(!cats||!grid)return;
  cats.innerHTML=INV_CATS.map(([id,ic])=>'<button type="button" class="cp-cat'+(invCat===id?' on':'')+'" data-invcat="'+id+'">'+ic+' '+t.invCats[id]+'</button>').join('');
  $('invSort').textContent='↕️ '+t.invSort+' ('+(invAsc?'A → Z':'Z → A')+')';
  let items=invItems().filter(it=>(invCat==='all'||it.cat===invCat)&&(!invQ||it.nm.toLowerCase().includes(invQ)));
  items.sort((a,b)=>a.nm.localeCompare(b.nm)*(invAsc?1:-1));
  grid.innerHTML=items.map(it=>'<button type="button" class="inv-tile" data-invk="'+it.k+'"'+(it.rid?' data-invrid="'+it.rid+'"':'')+' title="'+esc(it.nm)+'">'+
      '<span class="inv-em">'+it.ic+'</span><span class="inv-qty disp">'+it.qty+'</span><span class="inv-lb">'+esc(it.nm)+'</span></button>').join('')+
    '<div class="inv-tile inv-soon"><span class="inv-em">+</span><span class="inv-lb">'+t.invSoon+'</span></div>';
}
function invClick(e){
  const q=sel=>e.target.closest&&e.target.closest(sel);
  const c=q('[data-invcat]'); if(c){ invCat=c.dataset.invcat; renderInvPopup(); return; }
  if(q('#invSort')){ invAsc=!invAsc; renderInvPopup(); return; }
  const tile=q('[data-invk]'); if(tile){ closeInventory();
    if(tile.dataset.invrid){ const nm=T().recipes[tile.dataset.invrid].nm; bookFilter={q:nm.toLowerCase(),owned:false,hideUndisc:false,tier:-1,cat:null}; $('bookSearch').value=nm; bookSel=tile.dataset.invrid; openBook(); }
    else openResourcePage(tile.dataset.invk);
    return; }
}
/* ── Daily quests UI ── */
function renderQuests(){
  ensureDaily();
  const t=T(), box=$('questList'); if(!box)return; box.innerHTML='';
  const d=S.daily;
  d.quests.forEach((qid,i)=>{
    const q=QUEST_POOL.find(x=>x.id===qid);
    const cur=Math.min(d.prog[q.key]||0,q.target);
    const row=document.createElement('div');
    row.className='qrow'+(d.done[i]?' done':'');
    row.innerHTML='<span class="qchk">'+(d.done[i]?'✅':'⬜')+'</span><span>'+t.quests[qid]+'</span>'+
      '<span class="qrw">'+(d.done[i]?('+'+QUEST_REWARD_PX+' 🟩'):cur+'/'+q.target)+'</span>';
    box.appendChild(row);
  });
  const all=document.createElement('div'); all.className='qall';
  all.textContent=d.allDone?t.questAllDone:t.questAllHint;
  box.appendChild(all);
  $('streakLbl').textContent=S.streak.count>0?('🔥 '+t.streakLbl(S.streak.count,S.streak.joker)):t.streakNone(S.streak.joker);
}
/* ── Almanac UI ── */
const ALM_VARS=['Human','Cat','Alien','Agent','Zombie','Builder','Collector','Flipper','Hodler','Generic','HybridBloom','HybridTimber'];
const ALM_MUTS=['none','gold','twist','double','glow'];
function renderAlmanac(){
  const t=T(), box=$('almanacBody'); box.innerHTML='';
  $('almanacTitle').textContent=t.almanacTitle;
  const head=document.createElement('div'); head.className='alm-row';
  head.innerHTML='<span class="an"></span>'+ALM_MUTS.map(m=>'<span class="alm-cell" title="'+t.muts[m]+'" style="border:0;background:none">'+t.mutIc[m]+'</span>').join('');
  box.appendChild(head);
  let seen=0,total=0;
  for(const vk of ALM_VARS){
    const v=VARIETIES[vk];
    const row=document.createElement('div'); row.className='alm-row';
    let cells='';
    for(const m of ALM_MUTS){
      total++;
      const ok=!!S.almanac.seen[vk+':'+m];
      if(ok)seen++;
      cells+='<span class="alm-cell'+(ok?' seen':'')+'" title="'+t.muts[m]+'">'+(ok?'✿':'❓')+'</span>';
    }
    row.innerHTML='<span class="an" style="color:'+v.accent+'">'+vName(v)+'</span>'+cells;
    box.appendChild(row);
  }
  // 🧬 discovered strains — dynamic, one line per creation
  const strIds=Object.keys(S.strains);
  if(strIds.length){
    const sh=document.createElement('div'); sh.className='tier'; sh.style.marginTop='12px';
    sh.innerHTML='<div class="tname">🧬 '+t.strainsTitle+' · '+strIds.length+'</div>';
    const wrap=document.createElement('div'); wrap.className='recipes';
    for(const id of strIds){
      const sv=S.strains[id];
      const d=document.createElement('div'); d.className='recipe owned';
      d.innerHTML='<span class="ic">🧬</span><span class="mid"><div class="nm"><span style="color:'+sv.accent+'">'+sv.name+'</span> <span class="own">'+t.rar[sv.rar]+'</span></div>'+
        '<div class="fx">'+t.strainParents(sv.parents[0],sv.parents[1])+' · '+t.strainLine(sv)+'</div>'+
        '<div class="cost">🌱 ×'+(S.inv.strainSeeds[id]||0)+' · '+t.almHarvests.toLowerCase()+' '+(sv.harv||0)+'</div></span>';
      wrap.appendChild(d);
    }
    sh.appendChild(wrap);
    box.appendChild(sh);
  }
  const st=document.createElement('div'); st.className='alm-stats';
  st.innerHTML='<div class="stat"><div class="k">'+t.almProgress+'</div><div class="v">'+seen+' / '+total+'</div></div>'+
    '<div class="stat"><div class="k">'+t.almHarvests+'</div><div class="v">'+S.almanac.totalHarvests+'</div></div>'+
    '<div class="stat"><div class="k">'+t.almBest+'</div><div class="v">'+S.almanac.bestHarvestPx+' px</div></div>'+
    '<div class="stat"><div class="k">'+t.almLost+'</div><div class="v">'+S.almanac.plantsLost+'</div></div>';
  box.appendChild(st);
}
/* ── Badges: player-profile rewards, own popup in the top bar ── */
function renderBadges(){
  const t=T(), box=$('badgesBody'); box.innerHTML='';
  const nWon=BADGES.filter(b=>S.badges[b.id]).length;
  const bh=document.createElement('div'); bh.className='tier';
  bh.innerHTML='<div class="tname">🏅 '+t.badgesTitle+' · '+nWon+' / '+BADGES.length+'</div>';
  box.appendChild(bh);
  const bg=document.createElement('div'); bg.className='badge-grid';
  for(const b of BADGES){
    const won=!!S.badges[b.id];
    const d=document.createElement('div');
    d.className='bslot'+(won?' won':'');
    d.setAttribute('data-tip',tip(b.ic+' '+t.badges[b.id].nm,t.badges[b.id].fx+(won?'':' — '+t.badgeLocked)));
    d.innerHTML=b.ic+'<small>'+t.badges[b.id].nm+'</small>';
    bg.appendChild(d);
  }
  box.appendChild(bg);
}
/* ── ⚙️ settings dropdown ── */
function toggleMenu(){ const p=$('menuPanel'); p.hidden=!p.hidden; $('btnMenu').setAttribute('aria-expanded',String(!p.hidden)); }
/* mobile workshop menu: every workshop function as a collapsible fold */
const WS_ENTRIES=[
  {lbl:t=>t.book,           desc:t=>t.wsDesc.book,    go:()=>{ bookFilter.cat='plant'; bookPage=0; openBook(); }},
  {lbl:t=>t.buildBtn,       desc:t=>t.wsDesc.build,   go:()=>{ bookFilter.cat='build'; bookPage=0; openBook(); }},
  {lbl:t=>t.market,         desc:t=>t.wsDesc.market,  go:()=>openMarket()},
  {lbl:t=>'🧪 '+t.labTitle, desc:t=>t.wsDesc.lab,     go:()=>openResearch()},
  {lbl:t=>t.almanacTitle,   desc:t=>t.wsDesc.almanac, go:()=>openAlmanac()},
  {lbl:t=>t.seedVaultBtn,   desc:t=>t.wsDesc.seeds,   go:()=>openSeeds()},
];
function renderWsPanel(){ // plain stacked buttons — no folds, no extra text
  const t=T(), wp=$('wsPanel');
  wp.innerHTML=WS_ENTRIES.map((e,i)=>'<button class="btn" data-wsgo="'+i+'" type="button" style="width:100%;text-align:left">'+e.lbl(t)+'</button>').join('');
  wp.querySelectorAll('[data-wsgo]').forEach(b=>b.addEventListener('click',()=>{ closeWs(); WS_ENTRIES[+b.dataset.wsgo].go(); }));
}
function closeWs(){ const wp=$('wsPanel'); if(wp) wp.hidden=true; }
window.addEventListener('resize',()=>{ _layoutSig=''; render(true); });
function layoutTabs(){ // "🛠️ Crafting" → icon above the label (the texts are set by setLang as plain strings)
  document.querySelectorAll('#mainTabs .tab').forEach(b=>{
    const txt=b.textContent.trim(); const m=txt.match(/^(\S+)\s+(.+)$/);
    if(m) b.innerHTML='<i>'+m[1]+'</i><span>'+esc(m[2])+'</span>';
  });
}
function closeMenu(){ const p=$('menuPanel'); if(!p.hidden){ p.hidden=true; $('btnMenu').setAttribute('aria-expanded','false'); } }
function openBadges(){ renderBadges(); $('badgesOverlay').classList.add('on'); }
function closeBadges(){ $('badgesOverlay').classList.remove('on'); }
function openQuests(){ renderQuests(); $('questsOverlay').classList.add('on'); }
function closeQuests(){ $('questsOverlay').classList.remove('on'); }
const INFO_KEYS=['plant','water','grow','harvest','workbench','layout','market','lab','almanac','seeds','fert','soil','lamp','tank','tools','rooms','desk','quests','hybrid','time','save'];
let _infoOpen='';
function renderInfo(){
  const t=T(), el=$('infoList'); if(!el)return;
  $('infoTitle').textContent=t.info.title; $('infoHint').textContent=t.info.hint;
  el.innerHTML=INFO_KEYS.map(k=>{ const it=t.info.items[k]; if(!it)return '';
    return '<div class="info-item'+(_infoOpen===k?' open':'')+'" data-ik="'+k+'"><button class="btn" type="button">'+it.nm+'<span class="caret">'+(_infoOpen===k?'▲':'▼')+'</span></button><div class="info-x">'+it.tx+'</div></div>'; }).join('');
  el.querySelectorAll('.info-item>button').forEach(b=>b.addEventListener('click',()=>{ const k=b.parentElement.dataset.ik; _infoOpen=(_infoOpen===k?'':k); renderInfo(); }));
}
function openInfo(){ document.body.classList.remove('hamb-open'); renderInfo(); $('infoOverlay').classList.add('on'); }
function closeInfo(){ $('infoOverlay').classList.remove('on'); }
function openAlmanac(){ renderAlmanac(); $('almanacOverlay').classList.add('on'); }
function closeAlmanac(){ $('almanacOverlay').classList.remove('on'); }
/* ── Plant name & journal ── */
function placeReplant(useSide){ // Replant sits in the Harvest slot (right of the meters) when the pot is empty/cut, back at the bottom otherwise
  const rb=$('btnReplant'), hb=$('btnHarvest'), ub=$('btnUproot'), row=hb&&hb.parentElement, bottom=$('bottomActions');
  if(!rb||!hb||!row||!bottom)return;
  bottom.hidden=true; // the bottom Replant row is gone for good: Replant only ever shows in the Harvest slot (empty/cut pot) — the space goes to the stage
  if(rb.parentElement!==row) row.insertBefore(rb,hb); rb.classList.remove('sm','ghost');
  if(useSide){ hb.hidden=true; ub.hidden=true; rb.hidden=false; }
  else { hb.hidden=false; ub.hidden=false; rb.hidden=true; }
}
function startRename(){ // the title itself becomes the editor — it renames the POT (easy to remember), the variety stays read-only
  $('plantTitle').hidden=true; $('btnName').hidden=true;
  $('nameRow').hidden=false; $('nameRow').style.display='inline-flex';
  $('nameInput').value=(S.inv.potNames||[])[S.sel]||'';
  $('nameInput').placeholder=T().potDefault(S.sel+1);
  $('nameInput').focus(); $('nameInput').select();
}
function cancelRename(){ $('nameRow').hidden=true; $('nameRow').style.display=''; $('plantTitle').hidden=false; $('btnName').hidden=false; }
function confirmRename(){
  const v=$('nameInput').value.trim().slice(0,18);
  if(!Array.isArray(S.inv.potNames)) S.inv.potNames=[];
  while(S.inv.potNames.length<=S.sel) S.inv.potNames.push('');
  S.inv.potNames[S.sel]=v;
  const p=selPlant(); if(p&&v) jlog(p,'named',v);
  cancelRename();
  _ctrlSig='';
  save(); render(true);
}
function renderJournal(){ // the journal covers the whole ZONE on screen: every pot's entries, newest first, each tagged with its pot
  const t=T(), box=$('journalList'); if(!box)return;
  const r=curRoom, all=[];
  for(let i=r*ROOM_SLOTS;i<(r+1)*ROOM_SLOTS;i++){
    const p=S.plants[i]; if(!hasPot(i)||!p||!p.journal)continue;
    p.journal.forEach((e,n)=>all.push({e, i, n, ts:(typeof e.ts==='number')?e.ts:((p.plantedTs||0)+e.d*86400000+n)}));
  }
  const ttl=$('tJournalCard'); if(ttl) ttl.textContent='📓 '+t.journalTitle+' — '+roomName(r);
  if(!all.length){ box.innerHTML='<span class="hint">—</span>'; return; }
  all.sort((a,b)=>(b.ts-a.ts)||(b.n-a.n)||(b.i-a.i));
  const many=potList().filter(x=>roomOf(x)===r).length>1;
  box.innerHTML=all.slice(0,30).map(({e,i})=>{
    const txt=t.jl[e.k]?t.jl[e.k](e.v):e.k;
    const tag=many?'<b style="color:'+(i===S.sel?'var(--paper)':'var(--faint)')+'">'+esc(potName(i))+'</b> · ':'';
    return '<div>'+tag+t.jlDay(e.d)+' · '+txt+'</div>';
  }).join('');
}
/* ── Generator status ── */
function totalEnergy(){ let e=0; for(let r=0;r<roomsCount();r++) e+=energyRoomOf(r); return e; }
function totalEnergyCap(){ let c=0; for(let r=0;r<roomsCount();r++) c+=energyCapRoom(r); return c; }
function renderGen(){
  const t=T(), box=$('genSlot'); box.innerHTML='';
  if(S.inv.genCount<=0)return;
  { const r=curRoom; // ONE bar: the room on screen — hop rooms (🏠) to manage the others
    if(genLvlRoomOf(r)>0){
    const cap=energyCapRoom(r), e=energyRoomOf(r);
    const pct=cap>0?Math.round(e/cap*100):0;
    const g=document.createElement('div'); g.className='genrow';
    g.innerHTML='⚡ <span>'+roomName(r)+'</span>'+
      '<span class="bar hyd" style="flex:1;min-width:60px"><i data-genbar="'+r+'" style="width:'+pct+'%;background:#e8c85a"></i></span>'+
      '<span class="cnt" data-genpct="'+r+'">'+pct+'%</span>'+
      '<button class="btn xs" data-recharge="'+r+'" type="button">'+t.rechargeBtn+'</button>';
    box.appendChild(g);
    g.querySelector('[data-recharge]').addEventListener('click',()=>rechargeRoom(r));
  } }
  const hint=document.createElement('p'); hint.className='hint'; hint.style.margin='4px 0 0';
  hint.textContent=t.genHint;
  box.appendChild(hint);
}
function refreshWorkshopButtons(){
  $('bookOverlay').querySelectorAll('[data-craft]').forEach(b=>{
    const r=RECIPES.find(x=>x.id===b.dataset.craft);
    b.disabled=!canCraft(r);
  });
  $('bookOverlay').querySelectorAll('[data-cnt]').forEach(el=>{
    const r=RECIPES.find(x=>x.id===el.dataset.cnt);
    if(r.kind==='multi') el.textContent='×'+S.inv[r.cnt]+'/'+multiMax(r);
    else el.textContent='×'+S.inv[Object.keys(r.gives)[0]];
  });
  $('hotbar').querySelectorAll('[data-tankbar]').forEach(tb=>{
    const r=Number(tb.dataset.tankbar);
    const pct=Math.round(tankLvlRoom(r)/TANK_CAP_H*100);
    tb.style.width=pct+'%';
    const pc=$('hotbar').querySelector('[data-tankpct="'+r+'"]'); if(pc)pc.textContent=pct+'%';
  });
  $('bookBody').querySelectorAll('[data-use]').forEach(b=>{
    const k=b.dataset.use;
    const p=selPlant();
    const fx=FERT_FX[k];
    const varOk=!fx||!fx.only||(p&&baseTypeOf(p)===fx.only);
    b.disabled=!(p&&!p.dead&&!p.cut&&S.inv[k]>0&&varOk);
  });
  $('bookBody').querySelectorAll('[data-research]').forEach(b=>{
    const rs=RESEARCH_BLOCKS.find(x=>x.id===b.dataset.research);
    b.disabled=!rs||S.inv.coins<rs.cost||!tierOpen(rs.tier);
  });
  $('bookBody').querySelectorAll('[data-planthyb]').forEach(b=>{
    const k=b.dataset.planthyb;
    b.disabled=!(S.inv[k]>0&&slotFree(S.plants[S.sel]));
  });
  $('bookBody').querySelectorAll('[data-plantstr]').forEach(b=>{
    b.disabled=!((S.inv.strainSeeds[b.dataset.plantstr]||0)>0&&slotFree(S.plants[S.sel]));
  });
  $('bookBody').querySelectorAll('[data-qty]').forEach(el=>{
    el.textContent='×'+S.inv[el.dataset.qty];
  });
}
function renderVarieties(){
  const box=$('varietyList'); box.innerHTML='';
  const t=T();
  for(const ty of C().types){
    const v=VARIETIES[ty];
    const d=document.createElement('div'); d.className='vrow';
    d.innerHTML='<span class="sw" style="background:'+v.accent+'"></span>'+
      '<span><b>'+vName(v)+'</b><br><span>'+t.varLine(ty,v)+'</span></span>'+
      '<span class="tag">'+t.rar[v.rar]+'</span>';
    box.appendChild(d);
  }
}

/* ── Language ── */
function applyLangManual(){
  const t=T();
  $('tManualP1').innerHTML=t.manualP1;
  const link=$('manualLink').outerHTML;
  $('tManualP2').innerHTML=t.manualP2a+link+t.manualP2b;
}
/* day / night follows the player's own clock (real local time, whatever the game speed):
   night 21:00 → 05:30, dawn until 07:00, dusk from 19:00 — the scene darkens with it and the header icon follows */
function dayDarkness(d=new Date()){ // 0 = full daylight … 1 = night
  const h=d.getHours()+d.getMinutes()/60;
  if(h>=21||h<5.5) return 1;
  if(h<7) return 1-(h-5.5)/1.5;
  if(h>=19) return (h-19)/2;
  return 0;
}
function dayIcon(){ const k=dayDarkness(); return k>=1?'🌙':(k>0?'🌅':'☀️'); }
function nightWash(x,w,h,th){ // dark wash over the painted scene: the community's own night tint, or a blue night from the clock
  const k=Math.max(th.night?1:0,dayDarkness()); if(k<=0)return;
  x.fillStyle=th.night?'rgba(0,26,12,'+(.62*k).toFixed(3)+')':'rgba(8,14,38,'+(.55*k).toFixed(3)+')';
  x.fillRect(0,0,w,h);
}
let _lastDayIcon='';
function updateWeatherClock(){ // header widget: date/time in the visitor's own local clock, sun/dawn/moon from the same clock
  const d=$('wcDate'), tm=$('wcTime'); if(!d||!tm)return;
  const now=new Date(), locale=S.lang==='fr'?'fr-FR':'en-US';
  d.textContent=now.toLocaleDateString(locale,{weekday:'short',day:'numeric',month:'long',year:'numeric'});
  tm.textContent=now.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit',hour12:false});
  const ic=document.querySelector('.weather-clock .wc-ic'), icon=dayIcon();
  if(ic) ic.textContent=icon;
  if(icon!==_lastDayIcon){ _lastDayIcon=icon; if(typeof render==='function'&&S&&S.plants) render(true); } // phase changed: repaint the scene's wash
}
function setLang(l){
  S.lang=l; save();
  const t=T();
  document.documentElement.lang=l;
  updateWeatherClock();
  $('btnEn').classList.toggle('on',l==='en');
  $('btnFr').classList.toggle('on',l==='fr');
  $('tSub').textContent=t.sub;
  $('btnReal').textContent=t.real; $('btnFast').textContent=t.fast;
  $('tPlantTitle').textContent=t.plantTitle;
  $('tPlantP1').innerHTML=t.plantP1C(C().token,C().idMax);
  $('normieId').placeholder='n° 0-'+C().idMax;
  $('btnLookup').textContent=t.find; $('btnRandom').textContent=t.random;
  $('tRandomHint').textContent=t.randomHintC(Object.keys(commSnapshot()).length,C().token,C().apiHost);
  $('tCommLbl').textContent=t.commLbl;
  $('tCommLblMenu').textContent=t.commLbl;
  applyLangManual();
  $('btnParse').textContent=t.importBtn;
  $('tNoNormie').textContent=t.noNormie; $('btnGeneric').textContent=t.genericBtn;
  $('tGenericHint').textContent=t.genericHint;
  $('btnBack').textContent=t.back;
  $('tVarTitle').textContent=t.varTitle; $('tVarHint').textContent=t.varHint;
  $('tGrowth').textContent=t.growth; $('tHydration').textContent=t.hydration;
  $('btnHarvest').textContent=t.harvest;
  $('tStFlowers').textContent=t.stFlowers; $('tStNext').textContent=t.stNext;
  $('tWorkshop').textContent=t.workshop; $('tWorkshopHint').textContent=t.workshopHint;
  $('tEquip').textContent=t.equipTitle;
  $('bookSearch').placeholder=t.bookSearchPh;
  $('btnBook').textContent=t.book; $('bookTitle').textContent=t.book.replace(/^\S+\s/,''); // the design's title has no emoji
  $('bookSub').textContent=t.craftSub; $('bookInfo').textContent=t.craftInfo;
  $('invTitle').textContent=t.inventory; $('invSub').textContent=t.invSub; $('invInfo').textContent=t.invInfo; $('invSearch').placeholder=t.bookSearchPh;
  $('tabGarden').textContent='🌱 '+t.tabGarden; $('btnJournalTab').textContent='📓 '+t.journalTitle;
  $('btnBuild').textContent=t.buildBtn;
  $('btnBuild2').textContent=t.buildBtn;
  $('btnResearch2').textContent='🧪 '+t.labTitle;
  $('btnAlmanac2').textContent=t.almanacTitle;
  $('btnSeeds2').textContent=t.seedVaultBtn;
  $('btnQuests').textContent='🗓️ '+t.questsBtn;
  $('btnBadges').textContent='🏅 '+t.badgesTitle;
  $('btnMarket').textContent=t.market;
  $('btnResearch').textContent='🧪 '+t.labTitle;
  $('researchTitle').textContent='🧪 '+t.labTitle;
  $('btnAlmanac').textContent=t.almanacTitle;
  $('labTabResearch').textContent='🔬 '+t.labTabResearch;
  $('labTabBreed').textContent='🧬 '+t.labTabBreed;
  $('labTabTry').textContent='🧫 '+t.labTabTry;
  if($('researchOverlay').classList.contains('on')) setLabTab(labTab);
  $('btnSeeds').textContent=t.seedVaultBtn;
  if($('seedOverlay').classList.contains('on')) renderSeedVault();
  $('questsTitleEl').textContent='🗓️ '+t.questsTitle;
  $('badgesTitleEl').textContent='🏅 '+t.badgesTitle;
  $('tJournalCard').textContent='📓 '+t.journalTitle+' — '+roomName(curRoom);
  $('mlTime').textContent=t.mlTime; $('mlLang').textContent=t.mlLang;
  $('btnInfo').textContent='ℹ️ '+t.mlInfo;
  renderQuests();
  if($('almanacOverlay').classList.contains('on')) renderAlmanac();
  if($('badgesOverlay').classList.contains('on')) renderBadges();
  if($('marketOverlay').classList.contains('on')) renderMarket();
  $('tCheat').textContent=t.cheat;
  $('btnReplant').textContent=(l==='fr'?'↺ Replanter':'↺ Replant');
  $('btnUproot').title=t.uproot.replace(/^\S+\s/,''); // 🗑️ icon button: the label lives in the tooltip
  if($('introOverlay').classList.contains('on')) openIntro();
  if($('pickerOverlay').classList.contains('on')) openPicker();
  updateCommUI();
  layoutTabs();
  renderVarieties(); renderWorkshop(); renderStageQuick(); lastRes=''; renderResources(); render(true);
}

/* ── Pixel rendering of the garden (all pots side by side) ── */
const CELL=5, GW=64, GH=80, RES=2; // RES: canvas pixels per world unit (crisper illustration & text) // taller grid: the pots area breathes, plants get headroom
const isMobile=()=>window.innerWidth<=820;
function hexRGB(h){ h=h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
function mixCol(a,b,t){ const A=hexRGB(a),B=hexRGB(b);
  return '#'+A.map((vv,i)=>Math.round(vv+(B[i]-vv)*t).toString(16).padStart(2,'0')).join(''); }
let _selScrolled=-1; // last pot auto-centered in the mobile scroll view
let _viewOffX=0; // canvas-px offset that centers the room slots in the widened desktop world
let _slotBaseXform=null; // transform snapshot taken right before the per-slot loop — see drawOne()'s bloom-sprite branch
let curRoom=0; // which room the stage shows (🏠 buttons switch it)
let controlView=false; // 🖥️ Control desk: manage every room's bars from one screen
function roomsCount(){ return 1+(S.inv.roomCount||0); }
function roomOf(i){ return Math.floor(i/ROOM_SLOTS); }
function viewSlots(){ return ROOM_SLOTS; } // the stage always shows ONE room of 3 pots
function potShift(){ return 0; } // slots have fixed positions: a pot is drawn where its slot is
function esc(x){ return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function deskAt(){ return (S.inv.controlDesk||0)>=1; } // the control desk is a Layout build, crafted like a room
function plantName(i){ const n=(S.inv.potNames||[])[i]; return (n&&String(n).trim())||T().seedDefault(i%ROOM_SLOTS+1); } // the details popup title: custom name, else Seed 1/2/3
function potName(i){ const n=(S.inv.potNames||[])[i]; return (n&&String(n).trim())||(isGround(i)?T().plotDefault(i+1):T().potDefault(i+1)); }
function roomName(r){ const n=(S.inv.roomNames||[])[r]; return (n&&String(n).trim())||T().roomN(r+1); }
function renameRoom(r,nm){
  if(_navSig==='lock') _navSig='';
  if(!Array.isArray(S.inv.roomNames)) S.inv.roomNames=[];
  while(S.inv.roomNames.length<=r) S.inv.roomNames.push('');
  S.inv.roomNames[r]=String(nm||'').trim().slice(0,16);
  _navSig=''; _ctrlSig=''; save(); render(true);
}
function roomAlert(r){ // something in this room needs attention
  const base=r*ROOM_SLOTS;
  for(let i=base;i<base+ROOM_SLOTS;i++){ if(!hasPot(i))continue;
    const p=S.plants[i];
    if(p&&!p.cut){
      if(p.dead) return true;                      // dead plant blocks its pot
      if(hydration(p)<=0.10) return true;          // thirsty (10% and below)
    }
    if(lampAt(i)&&lampOn(i)&&(!genAtPot(i)||energyAtPot(i)<=0)) return true; // lamp starved of energy
  }
  return false;
}
let _ctrlSig='';
let _ctrlEditing=false; // a rename input is open: freeze the desk render so typing survives ticks
function renderControlPanel(){ // one card per room: energy, water and harvest state — like a control tower
  const el=$('controlPanel'); if(!el)return;
  if(_ctrlEditing)return;
  const t=T(), R=roomsCount();
  const rooms=[];
  let sig=R+'|';
  for(let r=0;r<R;r++){
    const gen=genLvlRoomOf(r), cap=energyCapRoom(r);
    const eP=gen>0?Math.round(energyRoomOf(r)/cap*100):-1;
    const tP=tankAtRoom(r)?Math.round(tankLvlRoom(r)/TANK_CAP_H*100):-1;
    const pots=[];
    const rb=r*ROOM_SLOTS;
    for(let i=rb;i<rb+ROOM_SLOTS;i++){ if(!hasPot(i))continue;
      const p=S.plants[i];
      if(!p){ pots.push({i,empty:true}); continue; }
      pots.push({i, dead:p.dead, cut:p.cut, nm:potName(i)+' \u00b7 '+vName(vOf(p)),
        fl:p.pending.length, cap:flowerCap(p,i), hyd:Math.round(hydration(p)*100)});
    }
    rooms.push({r,gen,eP,tP,pots,alert:roomAlert(r)});
    sig+=r+':'+roomName(r)+':'+gen+':'+eP+':'+tP+':'+pots.map(o=>o.empty?'e':(o.dead?'d':(o.cut?'c':o.fl+'/'+o.cap+'/'+o.hyd))).join(',')+'|';
  }
  if(sig===_ctrlSig)return;
  _ctrlSig=sig;
  el.innerHTML='';
  for(const room of rooms){
    const d=document.createElement('div'); d.className='ctrl-room';
    let h='<h4>🏠 <span class="cr-nm">'+esc(roomName(room.r))+'</span>'+(room.alert?' <span style="color:var(--danger)">!</span>':'')+
      '<button class="btn xs ghost" data-crename="'+room.r+'" type="button" title="'+t.ctrlRename+'">✏️</button>'+
      '<button class="btn xs" data-cview="'+room.r+'" type="button">'+t.ctrlView+'</button></h4>';
    if(room.gen>0)
      h+='<div class="cr-row">⚡<span class="bar hyd"><i style="width:'+room.eP+'%;background:#e8c85a"></i></span>'+
         '<span>'+room.eP+'%</span><button class="btn xs" data-crech="'+room.r+'" type="button">'+t.rechargeBtn+'</button></div>';
    else h+='<div class="cr-row">⚡<span class="muted">'+t.ctrlNoGen+'</span></div>';
    if(room.tP>=0)
      h+='<div class="cr-row">🛢️<span class="bar hyd"><i style="width:'+room.tP+'%"></i></span>'+
         '<span>'+room.tP+'%</span><button class="btn xs" data-cfill="'+room.r+'" type="button">'+t.refill+'</button></div>';
    else h+='<div class="cr-row">🛢️<span class="muted">'+t.ctrlNoTank+'</span></div>';
    for(const o of room.pots){
      if(o.empty){ h+='<div class="cr-pot">#'+(o.i+1)+' · '+t.emptyTitle.toLowerCase()+'</div>'; continue; }
      if(o.dead){ h+='<div class="cr-pot warn">#'+(o.i+1)+' '+o.nm+' · 💀</div>'; continue; }
      if(o.cut){ h+='<div class="cr-pot">#'+(o.i+1)+' '+o.nm+' · ✂</div>'; continue; }
      const ready=o.fl>=o.cap;
      h+='<div class="cr-pot'+(o.hyd<=10?' warn':'')+'">#'+(o.i+1)+' '+o.nm+
         ' · 🌼 '+o.fl+'/'+o.cap+(ready?' <span class="cr-ready">'+t.ctrlReady+'</span>':'')+
         ' · 💧 '+o.hyd+'%</div>';
    }
    d.innerHTML=h;
    el.appendChild(d);
  }
  el.querySelectorAll('[data-crech]').forEach(b=>b.addEventListener('click',()=>{ rechargeRoom(Number(b.dataset.crech)); _ctrlSig=''; renderControlPanel(); }));
  el.querySelectorAll('[data-cfill]').forEach(b=>b.addEventListener('click',()=>{ refillTank(Number(b.dataset.cfill)); _ctrlSig=''; renderControlPanel(); }));
  el.querySelectorAll('[data-crename]').forEach(b=>b.addEventListener('click',()=>{
    const r=Number(b.dataset.crename), h4=b.closest('h4'); if(!h4)return;
    _ctrlEditing=true;
    h4.innerHTML='🏠 <input class="cr-nmi" maxlength="16" value="'+esc(roomName(r)).replace(/"/g,'&quot;')+'"> '+
      '<button class="btn xs" data-crok="'+r+'" type="button">OK</button>';
    const inp=h4.querySelector('.cr-nmi'); inp.focus(); inp.select();
    const ok=()=>{ _ctrlEditing=false; renameRoom(r,inp.value); };
    h4.querySelector('[data-crok]').addEventListener('click',ok);
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter')ok(); if(e.key==='Escape'){ _ctrlEditing=false; _ctrlSig=''; renderControlPanel(); } });
  }));
  el.querySelectorAll('[data-cview]').forEach(b=>b.addEventListener('click',()=>{
    const r=Number(b.dataset.cview), first=r*ROOM_SLOTS;
    gotoRoom(r);
  }));
}
let _navSig='';
function renderRoomNav(){
  const el=$('roomNav'); if(!el)return;
  const R=roomsCount();
  const alerts=Array.from({length:R},(_,r)=>roomAlert(r)?1:0).join('');
  const sig=R+':'+curRoom+':'+alerts+':'+(controlView?1:0)+':'+(deskAt()?1:0)+':'+roomName(curRoom);
  if(_navSig==='lock')return; // a rename input is open in the panel
  if(sig===_navSig)return;
  _navSig=sig;
  renderSidebar(); // the sidebar's room slot mirrors the zone on screen
  el.hidden=false; // the zone panel always lives in the top-right corner: it names the zone and lets you rename it
  el.innerHTML='';
  if(!controlView){ const t=T(), hd=document.createElement('div'); hd.className='zone-hd'; // no zone header on the control desk: it would sit over the 3rd room card's buttons
    {
      hd.innerHTML='<span class="zone-lbl">'+t.zoneLbl+'</span><span class="zone-nm">'+esc(roomName(curRoom))+'</span><button class="btn xs ghost" type="button" data-zrename="1" title="'+t.ctrlRename+'">✏️</button>';
      hd.querySelector('[data-zrename]').addEventListener('click',()=>{
        const r=curRoom;
        hd.innerHTML='<input class="cr-nmi" maxlength="16" value="'+esc(roomName(r)).replace(/"/g,'&quot;')+'"> <button class="btn xs" type="button" data-zok="1">OK</button>';
        const inp=hd.querySelector('.cr-nmi'); _navSig='lock'; inp.focus(); inp.select();
        const ok=()=>{ _navSig=''; renameRoom(r,inp.value); };
        hd.querySelector('[data-zok]').addEventListener('click',ok);
        inp.addEventListener('keydown',e=>{ if(e.key==='Enter')ok(); if(e.key==='Escape'){ _navSig=''; renderRoomNav(); } });
      });
    }
    el.appendChild(hd); }
  for(let r=0;r<R;r++){
    const b=document.createElement('button'); b.type='button';
    b.className='room-btn'+(r===curRoom?' on':'');
    b.innerHTML='🏠<span>'+(r+1)+'</span>'+(alerts[r]==='1'?'<i class="rb-alert">!</i>':''); b.title=roomName(r);
    b.className+= (r===curRoom&&!controlView?'':'').length?'':''; // (state handled below)
    b.addEventListener('click',()=>{
      gotoRoom(r);
    });
    if(controlView) b.classList.remove('on');
    el.appendChild(b);
  }
  if(deskAt()){
    const t=T();
    const c=document.createElement('button'); c.type='button';
    c.className='room-btn'+(controlView?' on':'');
    c.title=t.ctrlTitle;
    c.innerHTML='🖥️<span>CTRL</span>';
    c.addEventListener('click',()=>{ controlView=true; _navSig=''; _ctrlSig=''; _ctrlEditing=false; render(true); });
    el.appendChild(c);
  }
}
function sceneRatio(){ const img=sceneImage(); return img?img.naturalWidth/img.naturalHeight:16/9; }
let _layoutSig='';
function layoutScene(){ // size the stage as large as the background's ratio allows inside the garden column —
  // belowStage/sidePanels no longer carve out their own space: they float on top of the scene (see #belowStage CSS), like the Claude Design mockup
  const g=document.querySelector('.garden'), left=document.querySelector('.gcol-left'), stg=document.querySelector('.stage'), below=$('belowStage'), side=$('sidePanels');
  if(!g||!stg||!below||!side)return;
  g.classList.remove('side'); side.hidden=true;
  if(isMobile()||controlView){ stg.classList.remove('fixed'); if(below.parentElement!==left) left.appendChild(below); placeHeader(false); return; }
  if(below.parentElement!==stg) stg.appendChild(below); // anchored to the stage itself so it overlays exactly the rendered image, letterboxing included
  placeHeader($('scrGarden').classList.contains('on')); // render() also runs while the start screen is up: the bar must stay in the page flow there
  const R=sceneRatio(), gw=g.clientWidth;
  let w=gw, h=Math.round(w/R);
  if(window.innerWidth>1200){ const gh=g.clientHeight; if(h>gh){ h=gh; w=Math.round(h*R); } } // .garden only reports a real height at this width — below it, height:auto, so just fit the width
  stg.style.setProperty('--sw',w+'px'); stg.style.setProperty('--sh',h+'px'); stg.classList.add('fixed');
}
function drawGarden(){
  const cv=$('plantCanvas'); if(!cv)return;
  curRoom=clamp(curRoom,0,roomsCount()-1);
  if(controlView&&!deskAt())controlView=false; // not built yet (or garden swap): plants first
  layoutScene();
  const N=potCount(), V=viewSlots(), sh=potShift(), base=curRoom*ROOM_SLOTS;
  renderRoomNav();
  { const nz=$('noticeZone'), stg=cv.closest?cv.closest('.stage'):null; if(nz&&stg){ const r=stg.getBoundingClientRect(); if(r.width>0){ nz.style.left=(r.left+r.width/2)+'px'; nz.style.top=(r.top+(stg.querySelector('header.in-stage')?64:8))+'px'; } } } // notifications: top centre of the scene, under the floating top bar
  const ctrlEl=$('controlPanel');
  if(controlView){ // 🖥️ the control desk replaces the plant view and claims the whole column
    if(cv.parentElement) cv.parentElement.hidden=true;
    const sb=$('stageSidebar'); if(sb) sb.hidden=true;
    for(const id of ['plantCard','journalCard','tEquip','hotbar','genSlot']){ const e=$(id); if(e) e.hidden=true; }
    if(ctrlEl){ ctrlEl.hidden=false; renderControlPanel(); }
    $('phaseLbl').textContent=T().ctrlTitle.toLowerCase(); $('phaseLbl').style.color='';
    $('clockLbl').textContent='';
    return;
  }
  if(cv.parentElement) cv.parentElement.hidden=false;
  if(ctrlEl) ctrlEl.hidden=true;
  _ctrlEditing=false;
  { const sb=$('stageSidebar'); if(sb) sb.hidden=false;
    for(const id of ['plantCard','journalCard','tEquip','hotbar','genSlot']){ const e=$(id); if(e) e.hidden=false; } }
  let worldW=V*GW*CELL; cv.height=GH*CELL*RES;
  _viewOffX=0;
  const scw=cv.parentElement, inWrap=scw&&scw.classList.contains('cv-scroll');
  if(isMobile()){
    // mobile: each slot spans ~86vw so ONE big vertical pot fills the screen; swipe to the others
    // slot width: 86vw on phones, but never taller than ~55% of the screen (tablet portrait would show a giant pot)
    const slotW=Math.min(0.86*window.innerWidth, 0.55*window.innerHeight*(GW/GH));
    cv.style.width=Math.round(V*slotW)+'px'; cv.style.height='';
    if(inWrap&&scw.scrollWidth>0&&_selScrolled!==S.sel&&roomOf(S.sel)===curRoom){
      _selScrolled=S.sel;
      const slot=(S.sel-base)+sh;
      scw.scrollLeft=Math.max(0,(slot+0.5)/V*scw.scrollWidth-scw.clientWidth/2);
    }
  }else if(inWrap&&scw.clientHeight>0&&scw.clientWidth>0){
    // desktop: the sky background fills the WHOLE zone — the canvas world widens to the box's
    // aspect ratio and the room's 3 slots sit centered inside it (no bare margins anywhere)
    worldW=Math.max(GH*CELL*1.2,Math.round(GH*CELL*scw.clientWidth/scw.clientHeight)); // exactly the box's ratio: nothing is stretched
    _viewOffX=Math.floor((worldW-V*GW*CELL)/2); // may be negative: the slot group is centred, drawn at the bed's pitch
    cv.style.width='100%'; cv.style.height='100%';
  }else{
    cv.style.width=''; cv.style.height='';
  }
  const x=cv.getContext('2d');
  cv.width=worldW*RES;
  x.setTransform(1,0,0,1,0,0);
  x.clearRect(0,0,cv.width,cv.height);
  x.setTransform(RES,0,0,RES,0,0); // everything below draws in world units
  const th=activeTheme();
  _sceneW=worldW;
  drawScene(x,Math.ceil(worldW/CELL),th);
  x.translate(_viewOffX,0); // pots and bars draw centered in the widened world
  _slotBaseXform=x.getTransform(); // snapshot: lets drawOne() drop back to plain world coordinates (bypassing the per-slot scale) to place full-size sprites, e.g. the bloom placeholder
  if(!drawBedSprite(x,sh)) for(let i=base;i<base+ROOM_SLOTS;i++) drawBed(x,(i-base)+sh,th); // one 3-slot bed sprite, else procedural stone beds
  // room walls: one divider every 3 slots (each built room adds 3 spaces)
  x.fillStyle=th.fenceD||'#5a5c5e';
  for(let b=ROOM_SLOTS;b<V;b+=ROOM_SLOTS){
    x.fillRect(b*GW*CELL-CELL,44*CELL,2*CELL,(GH-44)*CELL);
  }
  for(let i=base;i<base+ROOM_SLOTS;i++){ // pots, plants and bars are scaled about the slot's ground point so they fit the bed's compartments
    const slot=(i-base)+sh, k=slotScale(), cx0=slotCenterX(slot), gy=bedGroundY(), dy=gy-(GH-8)*CELL;
    x.save(); x.translate(cx0,gy); x.scale(k,k); x.translate(-cx0,-gy+dy); // lift the slot to the bed's soil front, then shrink about that point
    if(hasPot(i)) drawOne(x,i,slot); else if(controlView||isMobile()) drawEmptySlot(x,slot); // desktop: the plot card's own lock bubble replaces this painted emoji lock
    x.restore();
  }
  renderPlotCards();
}
function worldToCss(wx,wy){ // world (canvas-unit) point → viewport px, via the same transform drawOne()'s sprites use to escape the per-slot scale
  const cv=$('plantCanvas'); if(!cv||!_slotBaseXform||!cv.width)return null;
  const p=_slotBaseXform.transformPoint(new DOMPoint(wx,wy));
  const rect=cv.getBoundingClientRect(); if(!rect.width)return null;
  return {x:rect.left+p.x*(rect.width/cv.width), y:rect.top+p.y*(rect.height/cv.height)};
}
function plantHitAt(i,clientX,clientY){ // is the pointer near the plant of slot i (an ellipse hugging its silhouette, not each individual leaf)?
  const p=S.plants[i]; if(!p||p.dead||p.cut)return false;
  if(potType(i)!=='ground'||!_slotBaseXform) return true; // procedural/potted drawings: no sprite geometry, the whole slot counts
  const cv=$('plantCanvas'); const rect=cv.getBoundingClientRect(); if(!rect.width||!cv.width)return false;
  const stage=plantSpriteStage(progress(p)), img=plantStageImage(stage); if(!img)return true;
  const al=PLANT_STAGE_ALIGN[stage]||{b:1,cx:0.5}, k=i-curRoom*ROOM_SLOTS;
  const cx0=slotCenterX(k), gy=bedGroundY()-17, dW=slotPitch(), dH=dW*(img.naturalHeight/img.naturalWidth); // same placement as drawOne()
  const cp=new DOMPoint((clientX-rect.left)*(cv.width/rect.width),(clientY-rect.top)*(cv.height/rect.height));
  const w=_slotBaseXform.inverse().transformPoint(cp);
  // sprite frame → plant-centred unit ellipse (the painted plant sits roughly in the frame's middle 60% width, upper 75% height)
  const u=(w.x-(cx0-dW*al.cx))/dW, v=(w.y-(gy-dH*al.b))/dH;
  const ex=(u-0.5)/0.30, ey=(v-al.b*0.42)/(al.b*0.42);
  return ex*ex+ey*ey<=1;
}
function nextFlowerText(p,i){ // "next flower" countdown shared by the plant card and the growing-details popup
  const t=T(), P=progress(p), inactive=p.dead||p.cut;
  if(inactive) return '—';
  if(P>=BLOOM_P) return p.pending.length>=flowerCap(p,i) ? t.grindFirst : fmtDur((flowerEveryH(p,i)-p.bloomAccH)/speedMult(p,i));
  return fmtDur((BLOOM_P*GROWTH_H-p.growthH)/speedMult(p,i)); // time left before the plant reaches bloom and its first flower
}
/* growing-details popup (design): opens above a plot's bars, live-updated, renames the pot inline */
let _detailsSlot=-1, _detailsEditing=false;
function closeDetails(){ if(_detailsSlot<0)return; _detailsSlot=-1; _detailsEditing=false; renderPlotCards(); }
function detailsHtml(i,p){
  const t=T(), v=vOf(p), Pv=progress(p), Hv=hydration(p), cap=flowerCap(p,i);
  const pct=x=>Math.round(x*100)+'%';
  const bar=(lbl,cls,val)=>'<div class="pd-row"><div class="pd-lbl">'+lbl+'</div><div class="pd-barrow"><span class="pd-track"><span class="pd-fill '+cls+'" style="width:'+pct(val)+'"></span></span><span class="pd-pct disp">'+pct(val)+'</span></div></div>';
  const head=_detailsEditing
    ? '<input class="pd-input disp" data-detinput="1" maxlength="18" value="'+esc((S.inv.potNames||[])[i]||'')+'" placeholder="'+esc(plantName(i))+'" aria-label="'+esc(t.stFlowers)+'"><button type="button" class="pd-btn" data-detok="'+i+'">OK</button>'
    : '<h3 class="pd-title disp">'+esc(plantName(i))+'</h3><button type="button" class="pd-btn ghost" data-detrename="'+i+'" title="✎">✎</button>';
  return '<div class="pc-details" data-details="'+i+'">'+
    '<div class="pd-head"><span class="pd-ic">🌱</span>'+head+'<button type="button" class="pd-btn" data-detclose="1">✕</button></div>'+
    '<div class="pd-sub">'+esc(vName(v))+' · '+esc(phaseName(p,Pv))+'</div>'+
    bar(t.hydration,'hyd'+(Hv<0.10?' warn':''),Hv)+bar(t.growth,'grow',Pv)+
    '<div class="pd-sep"></div>'+
    '<div class="pd-stats"><div class="pd-stat"><span class="pd-stat-ic">🌸</span><div><div class="pd-stat-k">'+t.stFlowers+'</div><div class="pd-stat-v disp">'+p.pending.length+' / '+cap+'</div></div></div>'+
    '<div class="pd-vsep"></div>'+
    '<div class="pd-stat"><span class="pd-stat-ic">⏱️</span><div><div class="pd-stat-k">'+t.stNext+'</div><div class="pd-stat-v disp">'+esc(nextFlowerText(p,i))+'</div></div></div></div>'+
  '</div>';
}
let _unlockConfirmSlot=-1, _plotCardsRoom=-1;
function renderPlotCards(){
  const box=$('plotCards'); if(!box)return;
  if(controlView||isMobile()){ box.innerHTML=''; return; } // control desk / mobile: the classic in-canvas view stays there for now
  if(curRoom!==_plotCardsRoom){ _plotCardsRoom=curRoom; _unlockConfirmSlot=-1; _detailsSlot=-1; _detailsEditing=false; }
  if(_detailsEditing&&box.querySelector('[data-detinput]')) return; // a rename is being typed: don't rebuild under the cursor
  const base=curRoom*ROOM_SLOTS, t=T(), cards=[];
  const cv=$('plantCanvas'); if(cv&&cv.getBoundingClientRect){ const cw=cv.getBoundingClientRect().width; if(cw) box.style.setProperty('--sw',cw+'px'); } // the design sizes the bars pill in cqw of the scene
  for(let k=0;k<ROOM_SLOTS;k++){
    const i=base+k;
    const cx0=slotCenterX(k), gy=bedGroundY(), pitch=slotPitch();
    const L=worldToCss(cx0-pitch/2,gy), R=worldToCss(cx0+pitch/2,gy), TP=worldToCss(cx0,gy);
    if(!L||!R||!TP)continue;
    const width=Math.max(66,(R.x-L.x)*0.82), left=TP.x-width/2;
    const growing=hasPot(i)&&S.plants[i]&&!S.plants[i].dead&&!S.plants[i].cut;
    let lockTop=TP.y-40; // fallback until the canvas has a real transform to measure against
    if(!hasPot(i)){ const hint=plantHintCss(k); if(hint) lockTop=hint.y-19; } // centre the 38px lock bubble on plot 1's own little seed dot, same height on every locked plot
    const top=growing?TP.y-20:(!hasPot(i)?lockTop:TP.y+3); // bars pill straddles the soil's front edge; the padlock centres on the seed's own spot; name cards just under the compartment
    let nameCls='pc-name-card', barsHtml='', nameHtml='';
    if(!hasPot(i)){ // locked compartment (design): a round padlock on the soil; click → the "Unlock the plot" card above it
      nameCls='';
      const cost=plotUnlockCost(i), ok=canAffordCost(cost)&&canReplant();
      let pop='';
      if(_unlockConfirmSlot===i){
        const need=Object.assign({},cost||{}); const mats=Object.keys(need).map(k=>{ const have=S.inv[k]||0;
          return '<div class="pc-mat"><div class="pc-mat-ic">'+(t.resIc[k]||'')+'</div><div class="pc-mat-v disp" style="color:'+(have>=need[k]?'#8fd14f':'#e07a5f')+'">'+fmtCoins(have)+' / '+need[k]+'</div><div class="pc-mat-k">'+(t.res[k]||k)+'</div></div>'; });
        { const have=totalBaseSeeds(); mats.push('<div class="pc-mat"><div class="pc-mat-ic">'+t.resIc.seeds+'</div><div class="pc-mat-v disp" style="color:'+(canReplant()?'#8fd14f':'#e07a5f')+'">'+have+' / 1</div><div class="pc-mat-k">'+t.res.seeds+'</div></div>'); }
        pop='<div class="pc-unlock"><div class="pd-head"><h3 class="pd-title pc-unlock-t">'+t.pcUnlockTitle+'</h3><button type="button" class="pd-btn" data-cancelunlock="1">✕</button></div>'+
          '<div class="pc-unlock-txt">'+t.pcUnlockTxt+'</div>'+
          (cost?'<div class="cp-mats-lbl disp pc-req">'+t.pcReqLbl+'</div><div class="pc-mats">'+mats.join('')+'</div>':'')+
          '<button type="button" class="pc-unlock-go'+(ok?'':' off')+'" data-unlock="'+i+'"'+(ok?'':' disabled')+'>'+
            (ok?'<span>🔓</span>':'<img src="'+SB_ICONS.lock+'" alt="">')+'<span class="disp">'+(cost?t.pcUnlockBtn:t.pcUnlockFreeBtn)+'</span></button></div>';
      }
      barsHtml='<div class="pc-lockwrap">'+pop+'<button type="button" class="pc-lockbtn" data-plotcard="'+i+'" title="'+t.pcLockedTitle+'"><img src="'+(ok?SB_ICONS.lockOpen:SB_ICONS.lock)+'" alt=""></button></div>';
    }else{
      const p=S.plants[i];
      if(!p){ nameCls+=' pc-empty'; nameHtml='<span class="pc-name">'+t.pcEmptyTitle+'</span><span class="pc-status">'+t.pcEmptySub+'</span>'; }
      else{
        const v=vOf(p), Pv=progress(p), Hv=hydration(p), inactive=p.dead||p.cut;
        if(inactive) nameHtml='<span class="pc-name">'+esc(vName(v))+'</span><span class="pc-status">'+esc(phaseName(p,Pv))+'</span>';
        else { nameCls=''; // a growing plant shows only its bars (design): 💧 then 🌱 — click them for the details popup
          barsHtml='<button type="button" class="pc-bars-widget'+(i===S.sel?' sel':'')+'" data-bars="'+i+'">'+
            '<div class="pc-bar"><span class="pc-ic">💧</span><span class="pc-track"><span class="pc-fill hyd'+(Hv<0.10?' warn':'')+'" style="width:'+Math.round(Hv*100)+'%"></span></span></div>'+
            '<div class="pc-bar"><span class="pc-ic">🌱</span><span class="pc-track"><span class="pc-fill grow" style="width:'+Math.round(Pv*100)+'%"></span></span></div>'+
          '</button>';
          if(_detailsSlot===i) barsHtml+=detailsHtml(i,p);
        }
      }
    }
    if(_detailsSlot===i&&!(S.plants[i]&&!S.plants[i].dead&&!S.plants[i].cut)){ _detailsSlot=-1; _detailsEditing=false; } // the plant went away: the popup goes with it
    const html=barsHtml+(nameCls?'<div class="'+nameCls+'" data-plotcard="'+i+'">'+nameHtml+'</div>':'');
    cards.push('<div class="plot-card" style="left:'+Math.round(left)+'px;top:'+Math.round(top)+'px;width:'+Math.round(width)+'px">'+html+'</div>');
  }
  box.innerHTML=cards.join('');
  const inp=box.querySelector('[data-detinput]'); if(inp&&inp.focus){ inp.focus(); inp.select(); }
}
const SCENE_BG=__ASSET__('bg-garden.jpg'); // Martin's garden illustration (16:9, 1600×900 jpg) — the 3-slot bed is painted right into it
const SCENE_BG_MOBILE=__ASSET__('bg-garden-mobile.jpg'); // same illustration MINUS the bed (bare grass/dirt clearing): used whenever the scene is fit+mirrored, since a baked-in bed would tile/mirror unpredictably there
let _sceneImg=null, _sceneImgMobile=null, _sceneExactFit=false;
function sceneImage(){ if(!SCENE_BG)return null; if(!_sceneImg){ _sceneImg=new Image(); _sceneImg.src=SCENE_BG; _sceneImg.onload=()=>render(true); } return _sceneImg.complete&&_sceneImg.naturalWidth?_sceneImg:null; }
function sceneImageMobile(){ if(!SCENE_BG_MOBILE)return null; if(!_sceneImgMobile){ _sceneImgMobile=new Image(); _sceneImgMobile.src=SCENE_BG_MOBILE; _sceneImgMobile.onload=()=>render(true); } return _sceneImgMobile.complete&&_sceneImgMobile.naturalWidth?_sceneImgMobile:null; }
function drawScene(x,W,th){ // W = world width in cells. Rows: sky 0-33 · trees 30-46 · fence 46-53 · grass 53-GH
  const px=(cx,cy,col,w=1,h=1)=>{ x.fillStyle=col; x.fillRect(cx*CELL,cy*CELL,w*CELL,h*CELL); };
  const img=sceneImage();
  if(img){ const cw=W*CELL, ch=GH*CELL, iw=img.naturalWidth, ih=img.naturalHeight;
    if(Math.abs(cw/ch-iw/ih)<0.03){ _sceneExactFit=true; x.imageSmoothingEnabled=true; x.drawImage(img,0,0,cw,ch); nightWash(x,cw,ch,th); return; } // same ratio: the whole illustration, undistorted — the baked-in bed lands exactly where SCENE_BED_META expects it
    // otherwise (mobile): fit the lower 74 % (fence → ground) to the height and mirror sideways — use the bed-less image, else the baked-in bed would tile/mirror across the screen
    _sceneExactFit=false;
    const mimg=sceneImageMobile()||img;
    const miw=mimg.naturalWidth, mih=mimg.naturalHeight;
    const VIS=0.74, sc=Math.max(ch/(VIS*mih), cw/(3*miw)), dw=miw*sc, dh=mih*sc, y0=ch-dh, x0=(cw-dw)/2;
    x.imageSmoothingEnabled=true;
    x.drawImage(mimg,x0,y0,dw,dh);
    x.save(); x.scale(-1,1); x.drawImage(mimg,-(x0),y0,dw,dh); x.drawImage(mimg,-(x0+2*dw),y0,dw,dh); x.restore(); // mirrored copies left & right
    nightWash(x,cw,ch,th);
    return; }
  const HZ=46, FENCE0=46, GR=53;
  const rng=mulberry32(4242);
  // sky: vertical gradient in 2-row bands
  for(let r=0;r<HZ;r+=2){ px(0,r,mixCol(th.skyTop,th.skyBot,r/HZ),W,2); }
  // clouds: a few soft pixel clusters
  for(let k=0;k<Math.max(2,Math.floor(W/40));k++){ const cx=Math.floor(rng()*W), cy=4+Math.floor(rng()*14), w=6+Math.floor(rng()*8); px(cx,cy,th.cloud,w,2); px(cx+2,cy-1,th.cloud,w-4,1); px(cx+1,cy+2,mixCol(th.cloud,th.skyBot,.4),w-2,1); }
  // distant trees: two bumpy silhouettes
  for(let c=0;c<W;c+=2){ const h1=6+Math.floor(rng()*6); px(c,HZ-h1-6,th.treeD,2,h1+6); }
  for(let c=0;c<W;c+=2){ const h2=3+Math.floor(rng()*5); px(c,HZ-h2-2,th.treeL,2,h2+2); if(rng()<.3) px(c,HZ-h2-2,th.treeHi,1,1); }
  // fence: rails + posts
  px(0,FENCE0+2,th.fence,W,1); px(0,FENCE0+5,th.fence,W,1); px(0,FENCE0+3,th.fenceD,W,1); px(0,FENCE0+6,th.fenceD,W,1);
  for(let c=1;c<W;c+=5){ px(c,FENCE0,th.fenceL,1,8); px(c+1,FENCE0,th.fence,1,8); px(c,FENCE0-1,th.fenceL,2,1); }
  // grass with speckles and flowers
  px(0,GR,th.grass,W,GH-GR);
  for(let c=0;c<W;c++) for(let r=GR;r<GH;r+=3){ const v=rng(); if(v<.18) px(c,r,th.grassD); else if(v<.26) px(c,r,th.grassL); }
  for(let c=0;c<W;c+=7){ if(rng()<.35){ const r=GR+1+Math.floor(rng()*(GH-GR-3)); px(c,r,rng()<.5?th.flower:th.flower2); px(c,r+1,th.grassD); } }
  // props (only when the world is wider than the 3 slots): barrel left, lantern post right
  if(W>3*GW+24){
    const bx=3, by=GR-12; px(bx,by,th.barrel,10,14); px(bx,by,th.barrelD,1,14); px(bx+9,by,th.barrelD,1,14); px(bx,by+2,th.barrelBand,10,1); px(bx,by+11,th.barrelBand,10,1); px(bx+1,by-1,th.barrelD,8,1); px(bx+2,by,mixCol(th.skyBot,'#ffffff',.2),6,1);
    const lx=W-8, ly=GR-24; px(lx,ly,th.post,2,24); px(lx-4,ly,th.post,6,1); px(lx-5,ly+1,th.fenceD,3,4); px(lx-4,ly+2,th.lantern,1,2); px(lx-6,ly+2,mixCol(th.lantern,th.skyBot,.6),1,2); px(lx-2,ly+2,mixCol(th.lantern,th.skyBot,.6),1,2);
  }
}
// the 3-compartment stone bed is now painted directly INTO bg-garden.jpg (no separate sprite to composite) —
// SCENE_BED_META is measured on that illustration itself (1600×900 base px): each compartment's soil centre,
// the soil's front edge (= the pots' ground line) and the pitch between compartments.
const SCENE_BED_META={cx:[511,791,1080],groundY:660,spacing:285}; // cx/groundY re-measured from Martin's dot markers (pixel-clustered, not eyeballed)
let _bedSpriteOn=false;
function bedActive(){ return _sceneExactFit; } // only when the scene was drawn as a single undistorted copy (set by drawScene) — otherwise (mobile, or a desktop box whose ratio drifts from the illustration's) the baked-in bed's on-screen position isn't predictable
function sceneScaleX(){ return _sceneW/1600; }
const SCENE_SCALE_Y=(GH*CELL)/900;
function bedGroundY(){ return bedActive()?SCENE_BED_META.groundY*SCENE_SCALE_Y:(GH-8)*CELL; } // world y of the pots' ground line = the bed's soil front edge (fallback: the classic ground row)
let _sceneW=GW*CELL*3;
function slotPitch(){ return bedActive()?SCENE_BED_META.spacing*sceneScaleX():GW*CELL; } // desktop: the 3 slots are drawn at the bed's compartment pitch (narrower than a logical slot), centred on the middle slot
function slotCenterX(slot){ // world-px centre of a drawn slot: on the baked-in bed, each slot sits on its compartment (measured offsets); otherwise the logical grid
  const W=GW*CELL; if(!bedActive()) return (slot+0.5)*W;
  const sx=sceneScaleX(), k=((slot%3)+3)%3, base=slot-k; return (base+1.5)*W+(SCENE_BED_META.cx[k]-SCENE_BED_META.cx[1])*sx;
}
function slotOxCells(slot){ return (slotCenterX(slot)-GW*CELL/2)/CELL; } // drawing origin (in cells) — fractional on the bed
function slotScale(){ // pots/plants shrink so a pot spans ~80 % of a compartment's soil (compartment inner width ≈ 78 % of the pitch)
  if(!bedActive())return 1; return clamp((0.8*0.78*slotPitch())/(22*CELL),0.35,1);
}
function slotFromWorldX(wx){ let best=-99, bd=1e9; for(let k=0;k<ROOM_SLOTS;k++){ const d=Math.abs(wx-slotCenterX(k)); if(d<bd){ bd=d; best=k; } } return bd<=slotPitch()/2?best:-99; }
// growth-stage plant art: one painted sprite per stage (placeholder — single neutral colour; per-variety tints come
// later). Same canvas convention across all of them (soil mound baked into the bottom edge, stem centred), so they
// can share one anchor/scale formula. Ground-planted slots draw the sprite whole; potted plants draw it cropped
// (mound sliced off — PLANT_STAGE_MOUND_FRAC below) since a painted soil mound doesn't fit a pot's own rim graphic.
const PLANT_STAGE_SPRITES={
  seed:__ASSET__('plant-seed.png'),
  germ:__ASSET__('plant-germ.png'),
  young:__ASSET__('plant-young.png'),
  mature1:__ASSET__('plant-mature1.png'), // 55–67.5 %
  mature2:__ASSET__('plant-mature2.png'), // 67.5–80 %: fuller/taller, right before bloom
  bloom:__ASSET__('plant-bloom.png'),
};
// fraction of each sprite's own height that is plant, not mound (measured per stage: taller plants have proportionally
// less mound). No entry for 'seed' — that sprite IS the mound (seed resting on it), so pots keep the procedural dot for it.
const PLANT_STAGE_MOUND_FRAC={germ:0.86,young:0.88,mature1:0.89,mature2:0.92,bloom:0.92};
// where each sprite's mound actually sits inside its own canvas (measured: bottom-most opaque row / horizontal centre of
// the mound), so every stage roots at the same soil point — the seed's canvas has more empty space under it than the rest.
const PLANT_STAGE_ALIGN={seed:{b:0.929,cx:0.518},germ:{b:0.968,cx:0.525},young:{b:0.975,cx:0.524},mature1:{b:0.987,cx:0.520},mature2:{b:0.994,cx:0.519},bloom:{b:0.987,cx:0.502}};
let _plantStageImgs={};
function plantSpriteStage(P){ // which sprite covers this growth fraction — mirrors phaseName()'s thresholds, with "mature" split in two for a smoother run-up to bloom
  if(P<0.05)return'seed'; if(P<0.25)return'germ'; if(P<0.55)return'young'; if(P<0.675)return'mature1'; if(P<0.80)return'mature2'; return'bloom';
}
function plantStageImage(stage){
  const src=PLANT_STAGE_SPRITES[stage]; if(!src)return null;
  if(!_plantStageImgs[stage]){ const im=new Image(); im.src=src; im.onload=()=>render(true); _plantStageImgs[stage]=im; }
  const im=_plantStageImgs[stage];
  return im.complete&&im.naturalWidth?im:null;
}
function drawBedSprite(x,firstSlot){ // nothing to draw: the bed is already painted into the scene background — just flag it active so the soil plot isn't drawn twice
  if(!bedActive())return false;
  _bedSpriteOn=true; return true;
}
function drawBed(x,slot,th){ // raised stone bed under a slot: border ring + dark soil (the pot or the ground plot sits inside)
  const ox=slotOxCells(slot), baseY=GH-8, w=42, h=15, x0=Math.floor((GW-w)/2), y0=baseY-h+2;
  const px=(cx,cy,col,ww=1,hh=1)=>{ x.fillStyle=col; x.fillRect((ox+cx)*CELL,cy*CELL,ww*CELL,hh*CELL); };
  px(x0,y0,th.stone,w,h); px(x0,y0,th.stoneL,w,1); px(x0,y0+h-1,th.stoneD,w,2); px(x0,y0,th.stoneL,1,h); px(x0+w-1,y0,th.stoneD,1,h);
  for(let c=x0+3;c<x0+w-3;c+=6){ px(c,y0+1,th.stoneD,1,1); px(c+3,y0+h-2,th.stoneL,1,1); }
  px(x0+2,y0+2,th.soil,w-4,h-4); for(let c=x0+3;c<x0+w-3;c+=4) px(c,y0+3+((c*7)%(h-6)),th.soilL,1,1);
}
function plantHintCss(slot){ // css point of the tiny "plantable" pixel hint drawOne() paints on an empty-but-unlocked pot (plot 1's little seed dot) — reused to align the lock bubble at the very same height on locked plots
  if(!_slotBaseXform||typeof DOMMatrix==='undefined') return null;
  const k=slotScale(), cx0=slotCenterX(slot), gy=bedGroundY(), dy=gy-(GH-8)*CELL;
  const M=new DOMMatrix().translate(cx0,gy).scale(k,k).translate(-cx0,-gy+dy); // mirrors drawOne()'s per-slot save/translate/scale/translate chain
  const baseY=GH-8, soilY=baseY-4, topX=Math.floor(GW/2);
  const w=M.transformPoint(new DOMPoint((slotOxCells(slot)+topX)*CELL,(soilY-2)*CELL));
  return worldToCss(w.x,w.y);
}
function drawEmptySlot(x,slot){ // a locked slot (not yet unlocked): a padlock on the bed's soil — the plot card below explains how to unlock it
  const ox=slotOxCells(slot), baseY=GH-8;
  const cx=(ox+GW/2)*CELL, cy=(baseY-9)*CELL;
  x.textAlign='center'; x.textBaseline='middle'; x.font=(CELL*7)+'px sans-serif';
  x.fillStyle='rgba(0,0,0,.4)'; x.fillText('🔒',cx+CELL*0.5,cy+CELL*0.5);
  x.fillText('🔒',cx,cy);
  x.textAlign='left'; x.textBaseline='alphabetic'; // restore the defaults other draw calls rely on
}
function drawOne(x,idx,slot){
  const ox=slotOxCells(slot==null?idx:slot);
  const p=S.plants[idx]||null;
  const v=p?vOf(p):VARIETIES.Generic;
  const P=progress(p), hyd=hydration(p);
  const px=(cx,cy,col)=>{ x.fillStyle=col; x.fillRect((ox+cx)*CELL,cy*CELL,CELL,CELL); };
  const mat=potType(idx), ceramic=(mat==='ceramic'||mat==='ceramicBig');
  const cardsOn=!controlView&&!isMobile(); // the HTML plot cards (bars pill + details popup) replace the painted bars and selection line
  // selection marker (only when several pots)
  if(!cardsOn&&potCount()>1&&idx===S.sel){
    for(let c=GW/2-11;c<=GW/2+11;c++) px(c,GH-1,activeTheme().brand);
  }
  // status bars under the pot: growth (accent) + hydration (blue), with % — classic view only (control desk, mobile)
  if(p&&!cardsOn){
    const Pv=progress(p), Hv=hydration(p);
    const inactive=p.dead||p.cut;
  $('metersBox').hidden=false; // meters stay: the cut/dead notice now lives in the stage
    const barW=18, bx=Math.floor(GW/2-barW/2)-3;
    const gy=GH-6, hy=GH-4; // one empty row between the two bars: % values breathe
    x.fillStyle='rgba(0,0,0,.45)'; x.fillRect((ox+bx-1)*CELL,(gy-1)*CELL,(barW+11)*CELL,(GH-gy)*CELL); // backing plate
    for(let c=0;c<barW;c++){ px(bx+c,gy,'#2c2d2f'); px(bx+c,hy,'#2c2d2f'); }
    const gCol=inactive?'#6f7274':activeTheme().brand;
    const hCol=inactive?'#6f7274':(Hv<0.10?'#e03131':'#6fa3b8');
    for(let c=0;c<Math.round(Pv*barW);c++) px(bx+c,gy,gCol);
    for(let c=0;c<Math.round(Hv*barW);c++) px(bx+c,hy,hCol);
    if(genAtPot(idx)){ // ⚡ energy bar, exactly like hydration
      const ey=GH-2, Ev=energyCap(idx)>0?energyAtPot(idx)/energyCap(idx):0;
      for(let c=0;c<barW;c++) px(bx+c,ey,'#2c2d2f');
      for(let c=0;c<Math.round(Ev*barW);c++) px(bx+c,ey,Ev<0.2?'#d4707f':'#e8c85a');
    }
    x.font='bold '+(CELL*1.8)+'px Silkscreen, monospace';
    x.textBaseline='alphabetic';
    x.fillStyle=inactive?'#7c7f81':activeTheme().brand;
    x.fillText(Math.floor(Pv*100)+'%',(ox+bx+barW+1)*CELL,(gy+1)*CELL-1);
    if(genAtPot(idx)){
      const Ev=energyCap(idx)>0?energyAtPot(idx)/energyCap(idx):0;
      x.fillStyle='#e8c85a';
      x.fillText(Math.floor(Ev*100)+'%',(ox+bx+barW+1)*CELL,(GH-1)*CELL-1);
    }
    x.fillStyle=inactive?'#7c7f81':'#6fa3b8';
    x.fillText(Math.floor(Hv*100)+'%',(ox+bx+barW+1)*CELL,(hy+1)*CELL-1);
  }
  // lamp for this pot
  if(lampAt(idx)){
    const lit=lampActive(idx);
    const L=lampLvl(idx), w=1+L; // bigger lamps at higher levels
    for(let i=-w;i<=w;i++) px(GW/2+i,2,'#6a6c6e');
    px(GW/2,3,'#6a6c6e');
    for(let i=-(L-1);i<=(L-1);i++) px(GW/2+i,4,lit?'#ffd75e':'#54565a'); // wider light bar
    if(L===1) px(GW/2,4,lit?'#ffd75e':'#54565a');
    if(lit){
      for(let i=-L;i<=L;i++) px(GW/2+i,5,'#ffd75e44');
      for(let i=-(L-1);i<=(L-1);i++) px(GW/2+i,6,'#ffd75e22');
      if(L>=3){ px(GW/2-L-1,5,'#ffd75e22'); px(GW/2+L+1,5,'#ffd75e22'); px(GW/2,7,'#ffd75e22'); }
    }
  }
  // pot — terracotta with a wide 2-row rim, tapered body and patchy sun shading (ref. mockup);
  // the crafted ceramic pot gets a glazed blue-grey finish so the upgrade reads at a glance
  const wide=potMat(idx).wide;
  const potW=wide?26:22, potH=wide?13:12, baseY=GH-8, potX0=Math.floor((GW-potW)/2); // pot raised: air gap above the status bars
  const POT_COLS={
    clay:      {rimL:'#c18a5f',rimD:'#a06a48',bl:'#b98f66',bm:'#9c6f4c',bd:'#7e553a'},
    ceramic:   {rimL:'#8fb3c0',rimD:'#6f93a0',bl:'#6f95a3',bm:'#587c8a',bd:'#42606c'},
    ceramicBig:{rimL:'#8fb3c0',rimD:'#6f93a0',bl:'#6f95a3',bm:'#587c8a',bd:'#42606c'}, // same glaze, wider body
    terracotta:{rimL:'#d98a5e',rimD:'#b2603a',bl:'#cf7d50',bm:'#b3623c',bd:'#8d472a'},
    plastic:   {rimL:'#6f9e6a',rimD:'#4b7548',bl:'#5f8f5b',bm:'#467043',bd:'#33532f'},
    concrete:  {rimL:'#a9abad',rimD:'#818385',bl:'#9a9c9e',bm:'#7f8183',bd:'#616365'},
    selfWater: {rimL:'#8fa7b8',rimD:'#6a8496',bl:'#7f9bad',bm:'#617d90',bd:'#4a6376'},
  };
  const PC=POT_COLS[mat]||POT_COLS.clay;
  const potTop=baseY-potH;
  if(mat==='ground'&&_bedSpriteOn){ /* the sprite's soil IS the plot: nothing to draw */ }
  else if(mat==='ground'){ // no pot: the plant grows straight in the bed's soil — a low ridge, pebbles, tufts
    const gy=baseY-2, th2=activeTheme();
    for(let c=potX0+1;c<potX0+potW-1;c++) px(c,gy-1,(p&&p.soil)?'#2a2320':th2.soilL||'#4c382a');
    px(potX0+2,gy-1,'#8a8c8e'); px(potX0+potW-4,gy-2,'#9a9c9e'); px(potX0+9,gy,'#6c6e70');
    px(potX0-1,gy-1,th2.grassL||'#5d8a45'); px(potX0,gy-2,th2.grassL||'#5d8a45'); px(potX0+potW,gy-1,th2.grassL||'#5d8a45'); px(potX0+potW-1,gy-2,th2.grassL||'#5d8a45');
  }else{
  for(let c=potX0-1;c<potX0+potW+1;c++){ px(c,potTop,PC.rimL); px(c,potTop+1,PC.rimD); }
  for(let r=2;r<=potH;r++){
    const shrink=Math.floor((r-2)*0.3);
    for(let c=potX0+shrink;c<potX0+potW-shrink;c++){
      let col=PC.bm;
      if(c-potX0-shrink<3) col=PC.bl;                    // sunlit left edge
      else if(potX0+potW-shrink-c<=3) col=PC.bd;         // shaded right edge
      else if(((r*5+c*3)%13)<2) col=PC.bl;               // worn light patches
      else if(((r*3+c*7)%17)<2) col=PC.bd;               // darker patches
      px(c,potTop+r,col);
    }
  }
  }
  if(mat==='selfWater'){ // the reservoir: a light band with a tiny gauge at the foot of the pot
    const rr=potH, shrink=Math.floor((rr-2)*0.3);
    for(let c=potX0+shrink+1;c<potX0+potW-shrink-1;c++) px(c,potTop+rr,'#6fa3b8');
    px(potX0+shrink+1,potTop+rr-1,'#a9d4e6'); px(potX0+potW-shrink-2,potTop+rr-1,'#a9d4e6');
  }
  // soil
  const soilY=(mat==='ground')?baseY-4:potTop+2, soilCol=(p&&p.soil)?'#2a2320':'#33302c';
  if(mat!=='ground') for(let c=potX0+1;c<potX0+potW-1;c++) px(c,soilY,soilCol);
  const topX=Math.floor(GW/2);
  if(!p){ // empty pot: plantable hint
    px(topX,soilY-2,'#6a6c6e'); px(topX-1,soilY-3,'#6a6c6e'); px(topX+1,soilY-3,'#6a6c6e'); px(topX,soilY-3,'#7c7f81'); px(topX,soilY-4,'#6a6c6e');
    return;
  }
  if(p.cut){
    px(topX,soilY-1,'#c9cbcc'); px(topX,soilY-2,'#9b9ea0');
    const r3=mulberry32(p.seed+3);
    for(let i=0;i<4;i++) px(potX0+2+Math.floor(r3()*(potW-4)),soilY-1,v.accent);
    return;
  }
  if(mat==='ground'&&!p.dead&&hyd>0){ // painted growth-stage sprite instead of the procedural stem, ground-planted slots only
    const stage=plantSpriteStage(P), img=plantStageImage(stage);
    if(img&&_slotBaseXform){
      const realSlot=slot==null?idx:slot, al=PLANT_STAGE_ALIGN[stage]||{b:1,cx:0.5};
      // gy = the root point on the soil (Martin's dot markers, ~16 base px below the seed's centre so the seed lands ON the dot); the mound's bottom sits there for every stage
      const cx0=slotCenterX(realSlot), gy=bedGroundY()-17, dW=slotPitch(), dH=dW*(img.naturalHeight/img.naturalWidth);
      x.save(); x.setTransform(_slotBaseXform); x.imageSmoothingEnabled=true;
      x.drawImage(img,cx0-dW*al.cx,gy-dH*al.b,dW,dH);
      x.restore();
      return;
    }
  }
  if(P<0.05&&!p.dead){
    px(topX,soilY-1,v.accent);
    if(Math.floor(Date.now()/600)%2) px(topX,soilY-2,'#9b9ea0');
    return;
  }
  if(mat!=='ground'&&!p.dead&&hyd>0){ // same painted sprite, potted: cropped to drop the mound (PLANT_STAGE_MOUND_FRAC), anchored on the pot's own soil line
    const stage=plantSpriteStage(P), mf=PLANT_STAGE_MOUND_FRAC[stage], img=mf&&plantStageImage(stage);
    if(img){
      const sW=img.naturalWidth, sH=Math.round(img.naturalHeight*mf);
      const dWc=potW*1.2, dHc=dWc*(sH/sW);
      x.imageSmoothingEnabled=true;
      x.drawImage(img,0,0,sW,sH,(ox+topX-dWc/2)*CELL,(soilY-dHc)*CELL,dWc*CELL,dHc*CELL);
      return;
    }
  }
  const rng=mulberry32(p.seed);
  const mut=p.mutRevealed?p.mutation:'none';
  const maxH=clamp(Math.round(32*sizeF(p)),18,44);
  const curH=Math.max(1,Math.round(maxH*Math.min(1,P/0.9)));
  // living greens are tinted toward the variety accent — same rule as flowers & buds
  const tint=g=>mixCol(g,v.accent,0.35);
  const stemCol=p.dead?'#55575a':(mut==='twist'?mixCol('#7da05a',v.accent,0.30):mixCol('#5d9440',v.accent,0.25));
  const stemHi=p.dead?'#5a5c5e':mixCol(stemCol,'#e8f0d0',0.25);
  let leafCols, hiCol;
  if(p.dead){ leafCols=['#4c4e50','#54565a','#5a5c5e']; hiCol='#6a6c6e'; }
  else if(hyd===0){ leafCols=['#6e7a5d','#7d8a68','#8f9c74']; hiCol='#a3ad85'; } // parched olive
  else { leafCols=[tint('#2e6b34'),tint('#3f8f3e'),tint('#5cb04a'),tint('#8ccf5a')]; hiCol=mixCol('#cfe37a',v.accent,0.30); }
  if(mut==='gold'&&!p.dead&&hyd>0){ leafCols=['#c9a44a','#d4b35f','#e3d08a']; hiCol='#f0e2a5'; } // golden foliage
  const droop=(hyd===0&&!p.dead)?1:0;
  let sx=topX; const stemPts=[];
  const wig=mut==='twist'?0.65:0.15, amp=mut==='twist'?5:1; // near-vertical stem; twisted mutation sways hard
  for(let i=0;i<curH;i++){
    if(i>2&&rng()<wig) sx+=rng()<0.5?-1:1;
    sx=clamp(sx,topX-amp,topX+amp);
    stemPts.push([sx,soilY-1-i]);
    px(sx,soilY-1-i,i>curH*0.66?stemHi:stemCol);
  }
  const anchors=[];
  if(P>=0.2&&!p.dead){
    for(let i=4;i<curH-2;i+=4){
      const side=(i/4)%2===0?-1:1;
      const [bx,by]=stemPts[i];
      const blen=clamp(4+Math.floor(rng()*2+P*4),4,9);
      for(let b=1;b<=blen;b++){
        const yy=by+(droop?Math.floor(b*0.5):-Math.floor(b/2.5)); // blades rise toward the light, droop when parched
        const ti=Math.min(leafCols.length-1,1+Math.floor((b/blen)*(leafCols.length-1)));
        px(bx+side*b,yy,leafCols[ti]);
        if(b<blen) px(bx+side*b,yy+1,leafCols[Math.max(0,ti-1)]); // near-tone underside: a full, smooth blade
        if(b===blen-1) px(bx+side*b,yy-1,hiCol); // the tip catches the sun
        if(b===blen) anchors.push([bx+side*b,yy-1]);
      }
    }
    if(stemPts.length){ // crown: a tuft of young leaves at the tip
      const[tx,ty]=stemPts[stemPts.length-1];
      px(tx,ty-1,leafCols[leafCols.length-1]); px(tx-1,ty,leafCols[1]); px(tx+1,ty,leafCols[2]);
      anchors.push([tx,ty-2]);
    }
  }
  if(!p.dead&&p.pending.length&&anchors.length){
    const nfl=Math.min(p.pending.length,anchors.length);
    for(let i=0;i<nfl;i++){
      const a=anchors[anchors.length-1-i]; const[fx,fy]=a;
      px(fx,fy,v.accent); px(fx-1,fy,v.accent); px(fx+1,fy,v.accent); px(fx,fy-1,v.accent); px(fx,fy+1,v.accent);
      if(mut==='double'){ px(fx-1,fy-1,v.accent); px(fx+1,fy-1,v.accent); px(fx-1,fy+1,v.accent); px(fx+1,fy+1,v.accent); } // double blooms
      px(fx,fy,'#f6ecc9'); // warm cream heart
    }
  }
  if(mut==='glow'&&!p.dead&&stemPts.length){ // faint halo around the crown
    const[tx,ty]=stemPts[stemPts.length-1];
    if(Math.floor(Date.now()/500)%2){ px(tx-2,ty-2,v.accent+'55'); px(tx+2,ty-2,v.accent+'55'); px(tx,ty-3,v.accent+'88'); }
    else { px(tx-2,ty-3,v.accent+'55'); px(tx+2,ty-3,v.accent+'55'); px(tx,ty-4,v.accent+'88'); }
  }
  if(p.dead){ const r2=mulberry32(p.seed+7); for(let i=0;i<6;i++) px(potX0+2+Math.floor(r2()*(potW-4)),soilY-1,'#4c4e50'); }
}
function drawLogo(){
  const cv=$('logoCanvas'), x=cv.getContext('2d');
  const P=[[8,14],[8,13],[8,12],[7,11],[8,11],[8,10],[9,9],[8,9],[8,8],[8,7]];
  x.fillStyle='#48494b'; x.fillRect(0,0,17,17);
  x.fillStyle='#565859'; x.fillRect(5,14,7,2);
  x.fillStyle='#e3e5e4'; P.forEach(([a,b])=>x.fillRect(a,b,1,1));
  x.fillRect(6,10,1,1); x.fillRect(10,8,1,1); x.fillRect(5,11,1,1); x.fillRect(11,9,1,1);
  x.fillStyle='#8fa78b'; x.fillRect(8,6,1,1); x.fillRect(7,7,1,1); x.fillRect(9,7,1,1);
}

/* ── Time loop ── */
function tick(){
  const now=Date.now();
  const dtH=(now-S.lastTs)/3600000*timeMult();
  S.lastTs=now;
  if(dtH>0) advance(dtH);
  const hadDaily=S.daily&&S.daily.date===todayStr();
  if(!hadDaily){ ensureDaily(); renderQuests(); }
  checkThirst();
  maybeTuto5();
  checkBadges();
  render();
  refreshWorkshopButtons();
  if($('marketOverlay').classList.contains('on')) marketRefresh();
  if(S.inv.genCount>0){
    $('genSlot').querySelectorAll('[data-genbar]').forEach(gb=>{
      const r=Number(gb.dataset.genbar);
      const cap=energyCapRoom(r), e=energyRoomOf(r);
      const pct=cap>0?Math.round(e/cap*100):0;
      gb.style.width=pct+'%';
      const pc=$('genSlot').querySelector('[data-genpct="'+r+'"]'); if(pc)pc.textContent=pct+'%';
      const btn=$('genSlot').querySelector('[data-recharge="'+r+'"]');
      if(btn) btn.disabled=S.inv.wood<=0||e>=cap-1e-9;
    });
  }
}
function setMode(m){
  tick();
  S.mode=m;
  $('btnReal').classList.toggle('on',m==='real');
  $('btnFast').classList.toggle('on',m==='fast');
  save(); render(true);
}

/* ── Init ── */
function init(){
  load();
  drawLogo();
  $('btnLookup').addEventListener('click',lookup);
  $('normieId').addEventListener('keydown',e=>{ if(e.key==='Enter')lookup(); });
  $('btnRandom').addEventListener('click',randomPick);
  $('btnParse').addEventListener('click',parseManual);
  $('btnGeneric').addEventListener('click',()=>plantNow(null));
  $('btnWater').addEventListener('click',water);
  $('btnHarvest').addEventListener('click',harvest);
  $('btnReplant').addEventListener('click',replant);
  $('btnUproot').addEventListener('click',uproot);
  $('btnSwitch').addEventListener('click',switchNormie);
  for(const id of ['commSel','commSelStart']) $(id).addEventListener('change',e=>{ switchComm(e.target.value); fillCommSelects(); });
  $('btnBack').addEventListener('click',backToGarden);
  $('btnReal').addEventListener('click',()=>setMode('real'));
  $('btnFast').addEventListener('click',()=>setMode('fast'));
  $('btnEn').addEventListener('click',()=>setLang('en'));
  $('btnFr').addEventListener('click',()=>setLang('fr'));
  $('btnBook').addEventListener('click',()=>{ bookFilter.cat='plant'; bookFilter.res=null; bookPage=0; openBook(); });
  $('btnBuild').addEventListener('click',()=>{ bookFilter.cat='build'; bookFilter.res=null; bookPage=0; openBook(); });
  $('hudResStrip').addEventListener('click',e=>{ // any pill or the + → the Inventory popup (a resource inside it leads on to its own page)
    if(e.target.closest('[data-res]')||e.target.closest('[data-resmore]')){ closeMenu(); openInventory(); }
  });
  $('btnInvClose').addEventListener('click',closeInventory);
  $('invOverlay').addEventListener('click',e=>{ if(e.target===$('invOverlay')) closeInventory(); else invClick(e); });
  $('invSearch').addEventListener('input',e=>{ invQ=e.target.value.trim().toLowerCase(); renderInvPopup(); });
  $('btnBookClose').addEventListener('click',closeBook);
  $('bookOverlay').addEventListener('click',e=>{ if(e.target===$('bookOverlay'))closeBook(); });
  $('btnMarket').addEventListener('click',openMarket);
  $('btnMarketClose').addEventListener('click',closeMarket);
  $('btnJournalTab').addEventListener('click',()=>{ renderJournal(); $('journalOverlay').classList.add('on'); });
  $('btnJournalClose').addEventListener('click',()=>$('journalOverlay').classList.remove('on'));
  $('journalOverlay').addEventListener('click',e=>{ if(e.target===$('journalOverlay'))$('journalOverlay').classList.remove('on'); });
  $('tabGarden').addEventListener('click',()=>{ document.querySelectorAll('.overlay.on').forEach(o=>o.classList.remove('on')); if(controlView){ controlView=false; _navSig=''; render(true); } });
  $('marketOverlay').addEventListener('click',e=>{ if(e.target===$('marketOverlay'))closeMarket(); });
  $('btnMenu').addEventListener('click',e=>{ e.stopPropagation(); toggleMenu(); });
  $('menuPanel').addEventListener('click',e=>e.stopPropagation()); // clicks inside keep the menu open
  document.addEventListener('click',()=>{ closeMenu(); document.body.classList.remove('hamb-open'); closeWs(); });
  $('btnHamb').addEventListener('click',e=>{ e.stopPropagation(); closeWs(); document.body.classList.toggle('hamb-open'); });
  $('btnWs').addEventListener('click',e=>{ e.stopPropagation(); document.body.classList.remove('hamb-open');
    const wp=$('wsPanel'); if(wp.hidden){ renderWsPanel(); wp.hidden=false; } else wp.hidden=true; });
  $('wsPanel').addEventListener('click',e=>e.stopPropagation());
  $('btnResearch').addEventListener('click',openResearch);
  $('btnResearch2').addEventListener('click',()=>{ closeMenu(); openResearch(); });
  $('btnAlmanac').addEventListener('click',openAlmanac);
  $('btnAlmanac2').addEventListener('click',()=>{ closeMenu(); openAlmanac(); });
  $('btnAlmanacClose').addEventListener('click',closeAlmanac);
  $('btnBuild2').addEventListener('click',()=>{ closeMenu(); bookFilter.cat='build'; bookFilter.res=null; bookPage=0; openBook(); });
  $('btnSeeds2').addEventListener('click',()=>{ closeMenu(); openSeeds(); });
  $('btnInfo').addEventListener('click',()=>{ closeMenu(); openInfo(); });
  $('btnInfoClose').addEventListener('click',closeInfo);
  $('infoOverlay').addEventListener('click',e=>{ if(e.target.id==='infoOverlay')closeInfo(); });
  $('almanacOverlay').addEventListener('click',e=>{ if(e.target===$('almanacOverlay'))closeAlmanac(); });
  $('btnName').addEventListener('click',startRename);
  $('btnNameOk').addEventListener('click',confirmRename);
  $('nameInput').addEventListener('keydown',e=>{ if(e.key==='Enter')confirmRename(); if(e.key==='Escape')cancelRename(); });
  $('btnResearchClose').addEventListener('click',closeResearch);
  $('researchOverlay').addEventListener('click',e=>{ if(e.target===$('researchOverlay'))closeResearch(); });
  $('btnIntroClose').addEventListener('click',closeIntro);
  $('btnIntroGo').addEventListener('click',closeIntro);
  $('introOverlay').addEventListener('click',e=>{ if(e.target===$('introOverlay'))closeIntro(); });
  $('btnPickerClose').addEventListener('click',closePicker);
  $('pickerOverlay').addEventListener('click',e=>{ if(e.target===$('pickerOverlay'))closePicker(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){closeBook();closeMarket();closePicker();closeIntro();closeResearch();closeAlmanac();closeInfo();closeSeeds();closeBadges();closeQuests();closeMenu();closePotPick();} });
  $('labTabResearch').addEventListener('click',()=>setLabTab('research'));
  $('labTabBreed').addEventListener('click',()=>setLabTab('breed'));
  $('labTabTry').addEventListener('click',()=>setLabTab('try'));
  $('btnLamp').addEventListener('click',()=>toggleLamp(S.sel));
  $('plantBadges').addEventListener('click',e=>{
    if(e.target.closest&&e.target.closest('[data-lamptoggle]')) toggleLamp(S.sel);
  });
  $('btnPotPickClose').addEventListener('click',closePotPick);
  $('potPickOverlay').addEventListener('click',e=>{ if(e.target===$('potPickOverlay'))closePotPick(); });
  $('btnBadges').addEventListener('click',openBadges);
  $('btnBadgesClose').addEventListener('click',closeBadges);
  $('badgesOverlay').addEventListener('click',e=>{ if(e.target===$('badgesOverlay'))closeBadges(); });
  $('btnQuests').addEventListener('click',openQuests);
  $('btnQuestsClose').addEventListener('click',closeQuests);
  $('questsOverlay').addEventListener('click',e=>{ if(e.target===$('questsOverlay'))closeQuests(); });
  $('btnSeeds').addEventListener('click',openSeeds);
  $('btnSeedsClose').addEventListener('click',closeSeeds);
  $('seedOverlay').addEventListener('click',e=>{ if(e.target===$('seedOverlay'))closeSeeds(); });
  $('btnSeedPgPrev').addEventListener('click',()=>{ seedPage--; renderSeedVault(); });
  $('btnSeedPgNext').addEventListener('click',()=>{ seedPage++; renderSeedVault(); });
  $('seedRarSel').addEventListener('change',e=>{ seedFilter.rar=e.target.value||null; seedPage=0; renderSeedVault(); });
  $('seedSortSel').addEventListener('change',e=>{ seedFilter.sort=e.target.value||null; seedPage=0; renderSeedVault(); });
  $('btnCheat').addEventListener('click',cheat);
  $('btnResetGarden').addEventListener('click',resetGarden);
  $('cheatInput').addEventListener('keydown',e=>{ if(e.key==='Enter')cheat(); });
  $('bookSearch').addEventListener('input',e=>{
    bookFilter.q=e.target.value.trim().toLowerCase(); bookFilter.res=null; bookPage=0; renderBook();
  });
  $('bookOverlay').addEventListener('click',bookClick);
  $('btnPotPrev').addEventListener('click',()=>{ const l=potList(), k=l.indexOf(S.sel); if(l.length) selectPot(l[(k-1+l.length)%l.length]); });
  $('btnPotNext').addEventListener('click',()=>{ const l=potList(), k=l.indexOf(S.sel); if(l.length) selectPot(l[(k+1)%l.length]); });
  const potFromEvent=e=>{
    const rect=e.currentTarget.getBoundingClientRect();
    const cvp=e.currentTarget;
    const wx=(e.clientX-rect.left)*(cvp.width/RES/rect.width)-_viewOffX; // display px → world px
    const k=slotFromWorldX(wx); if(k<-50)return -1;
    return curRoom*ROOM_SLOTS + k-potShift();
  };
  { const rs=document.documentElement&&document.documentElement.style; if(rs&&rs.setProperty){ // the design's cursors, hotspots as in its CSS
      rs.setProperty('--cur-hand',"url('"+__ASSET__('cursor-hand-default.png')+"') 22 3, auto");
      rs.setProperty('--cur-click',"url('"+__ASSET__('cursor-click.png')+"') 22 3, pointer");
      rs.setProperty('--cur-drop',"url('"+__ASSET__('cursor-droplet.png')+"') 16 16, pointer"); } }
  $('plantCanvas').addEventListener('mousemove',e=>{
    const i=potFromEvent(e); // any pot in view is clickable (select / double-click to water or harvest) — even the only one
    const onPlant=i>=0&&hasPot(i)&&roomOf(i)===curRoom&&plantHitAt(i,e.clientX,e.clientY);
    const cardsOn=!controlView&&!isMobile(); // desktop: the HTML plot cards (bars pill, lock bubble, name card) are the real clickable controls — clicking bare soil still selects the pot (kept), but shouldn't advertise a finger over that whole broad zone
    e.currentTarget.style.cursor=onPlant?'var(--cur-drop,pointer)' // the pointer is on the plant's painting itself: the droplet (double-click waters it)
      :(!cardsOn&&i>=0&&i<potSlots()&&roomOf(i)===curRoom)?'var(--cur-click,pointer)':'var(--cur-hand,default)'; // mobile/control-desk: no plot cards, the whole column is the only way to select/plant
  });
  $('plantCanvas').addEventListener('click',e=>{
    const i=potFromEvent(e);
    if(hasPot(i)) selectPot(i);
    else if(e.detail<=1) unlockPlot(i); // a locked slot: unlock it (free for the first 2 of a room, priced beyond that) — mobile/control-desk views have no plot card to confirm through, so this is the direct path there
  });
  $('plotCards').addEventListener('click',e=>{
    const q=sel=>e.target.closest&&e.target.closest(sel);
    if(q('.pc-details')||q('[data-bars]')||q('.pc-lockwrap')) e.stopPropagation(); // keep the document-level "close every fold" from undoing what this click opens
    const bars=q('[data-bars]'); if(bars){ const i=+bars.dataset.bars; if(i!==S.sel) selectPot(i); _detailsSlot=(_detailsSlot===i?-1:i); _detailsEditing=false; renderPlotCards(); return; }
    if(q('[data-detclose]')){ closeDetails(); return; }
    const rn=q('[data-detrename]'); if(rn){ _detailsEditing=true; renderPlotCards(); return; }
    const ok=q('[data-detok]'); if(ok){ commitDetailsRename(+ok.dataset.detok); return; }
    if(q('.pc-details')) return;
    const unlockBtn=e.target.closest('[data-unlock]'), cancelBtn=e.target.closest('[data-cancelunlock]'), card=e.target.closest('[data-plotcard]');
    if(unlockBtn){ unlockPlot(+unlockBtn.dataset.unlock); _unlockConfirmSlot=-1; renderPlotCards(); return; }
    if(cancelBtn){ _unlockConfirmSlot=-1; renderPlotCards(); return; }
    if(!card)return;
    const i=+card.dataset.plotcard;
    if(!hasPot(i)){ _unlockConfirmSlot=i; renderPlotCards(); }
    else { selectPot(i); if(!S.plants[i]) replant(); } // an empty pot's card is the way to plant, now that the Replant button under the scene is gone
  });
  // double-click on a pot: waters the plant — or harvests it when its flowers are FULL
  $('plantCanvas').addEventListener('dblclick',e=>{
    const i=potFromEvent(e);
    if(!hasPot(i))return;
    { // double-click on the lamp (top of the slot) switches it on/off
      const rect=e.currentTarget.getBoundingClientRect(), cyCell=(e.clientY-rect.top)*(e.currentTarget.height/RES/rect.height)/CELL;
      if(lampAt(i)&&cyCell<=9){ if(i!==S.sel) selectPot(i); toggleLamp(i); return; }
    }
    const p=S.plants[i];
    if(!p||p.cut)return;
    if(i!==S.sel) selectPot(i);
    if(p.dead){ harvest(); return; } // dead plant: clear it for its dead wood + seed (same payout as uprooting)
    if(p.pending.length>=flowerCap(p,i)) harvest(); // full of flowers: the ONLY time dblclick harvests
    else water();
  });
  initTooltip();
  $('stageSidebar').addEventListener('click',sidebarClick);
  $('stageQuick').addEventListener('click',stageQuickClick);
  document.addEventListener('click',closeStageFolds);
  $('plotCards').addEventListener('keydown',e=>{ const inp=e.target.closest&&e.target.closest('[data-detinput]'); if(!inp)return;
    if(e.key==='Enter') commitDetailsRename(_detailsSlot); else if(e.key==='Escape'){ _detailsEditing=false; renderPlotCards(); } });
  renderStageQuick();
  document.addEventListener('visibilitychange',()=>{ if(document.hidden)save(); });
  window.addEventListener('beforeunload',save);
  setLang(S.lang||'en');
  if(S.plants.some(p=>p)){
    const dtH=(Date.now()-S.lastTs)/3600000*timeMult();
    S.lastTs=Date.now();
    if(dtH>0) advance(dtH);
    applyAccent(); showScreen('garden'); render(true);
  } else showScreen('start');
  $('btnReal').classList.toggle('on',S.mode==='real');
  $('btnFast').classList.toggle('on',S.mode==='fast');
  if(!S.introSeen) openIntro(); // first visit: explain the game
  setInterval(tick,250);
  setInterval(save,5000);
  updateWeatherClock(); setInterval(updateWeatherClock,30000);
  for(const s in PLANT_STAGE_SPRITES) plantStageImage(s); // decode every stage up front: otherwise a plant flashes its procedural pixel fallback the first time it reaches a new stage
}
init();
