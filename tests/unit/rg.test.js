let pass=0, fail=0;
const ok=(c,m)=>{ if(c){pass++;} else {fail++; console.log('FAIL:',m);} };
const approx=(a,b,tol,m)=>ok(Math.abs(a-b)<=tol, m+' got '+a+' want '+b);

// setup: 2 rooms, 5 pots, workbench + research
S=freshState(); ensurePlants();
S.inv.tools.workbench=true;
S.inv.research={b_stone:true,b_heat:true,b_harv1:true,b_metal:true,b_serum:true,b_water:true,b_harv2:true,b_energy:true,b_breed:true,b_build:true};
S.inv.roomCount=1; S.inv.potCrafts=4; ensurePlants();
S.inv.metal=200; S.inv.stone=200; S.inv.wood=200; S.inv.mineral=50;

// generator: max 1 per room
applyPotEquip('generator',0,false);
ok(genLvlRoomOf(0)===1, 'room 1 has a generator');
ok(!POT_EQUIP.generator.ok(1)&&!POT_EQUIP.generator.ok(2), 'no second generator in room 1 (any pot)');
ok(POT_EQUIP.generator.ok(3), 'room 2 can still get one');
applyPotEquip('generator',4,false);
ok(genLvlRoomOf(1)===1, 'room 2 generator via pot 5');
ok(S.inv.genCount===2, 'genCount counts rooms');
const rAdd=RECIPES.find(r=>r.id==='generator');
ok(multiMax(rAdd)===roomsCount(), 'generator cap = number of rooms');

// per-room recharge: only the chosen room fills
S.inv.energyRoom=[0,0,0]; S.inv.wood=100;
rechargeRoom(0);
ok(energyRoomOf(0)===EN_CAP_H&&energyRoomOf(1)===0, 'recharge fills ONLY room 1');
ok(S.inv.wood===95, '5 wood for 24h');
rechargeRoom(1);
ok(energyRoomOf(1)===EN_CAP_H, 'room 2 recharged separately');

// lamps draw from THEIR room's battery
S.inv.lampLvlAt[0]=1; S.inv.lampOnArr[0]=true; recomputeEquipCounts();
S.inv.energyRoom=[10,10,0];
advance(2); // lamp1 draws 1/h in room 1 only
approx(energyRoomOf(0), 8, 0.01, 'room 1 battery drained by its lamp');
approx(energyRoomOf(1), 10, 0.01, 'room 2 battery untouched');

// tank: 1 per room, refilled separately
const rT=RECIPES.find(r=>r.id==='tank');
ok(rT.kind==='multi'&&multiMax(rT)===roomsCount(), 'tank: one per room');
applyPotEquip('tank',1,false);
ok(tankAtRoom(0)&&!tankAtRoom(1), 'tank installed in room 1 only');
ok(!POT_EQUIP.tank.ok(2)&&POT_EQUIP.tank.ok(3), 'no 2nd tank in room 1; room 2 free');
refillTank(0);
ok(tankLvlRoom(0)===TANK_CAP_H, 'room 1 tank refilled');
applyPotEquip('tank',3,false);
ok(tankLvlRoom(1)===0, 'room 2 tank starts empty (separate)');

// drip uses its room's tank only
S.inv.dripTierAt[0]=1; S.inv.dripTierAt[3]=1; recomputeEquipCounts();
S.plants[0]=makePlant(null); S.plants[3]=makePlant(null);
S.plants[0].hydAtH=S.plants[0].gH-5; S.plants[3].hydAtH=S.plants[3].gH-5;
S.inv.tankLevelRoom=[10,0,0];
advance(1);
ok(tankLvlRoom(0)<10, 'room 1 tank drains for its drip');
ok(S.plants[0].hydAtH>S.plants[0].gH-5, 'room 1 plant watered by drip');
ok(S.plants[3].hydAtH<=S.plants[3].gH-5+1e-9, 'room 2 plant NOT served (its tank empty)');

// migration: old per-pot generators + global tank tool
{ const _st={};
  localStorage.setItem=(k,v)=>{_st[k]=String(v);};
  localStorage.getItem=k=>(_st[k]!==undefined?_st[k]:null);
  const old=freshState();
  delete old.inv.genLvlRoom; delete old.inv.energyRoom; delete old.inv.tankRoom; delete old.inv.tankLevelRoom;
  old.inv.roomCount=1; old.inv.potCrafts=4;
  old.inv.genLvlAt=[1,0,2,0,3,0,0,0,0]; old.inv.energyAt=[10,0,30,0,50,0,0,0,0];
  old.inv.tools.tank=true; old.inv.tankLevel=40;
  _st[LS_KEY]=JSON.stringify(old); load();
  ok(genLvlRoomOf(0)===2, 'migration: room 1 keeps its BEST generator (lvl2), got '+genLvlRoomOf(0));
  ok(genLvlRoomOf(1)===3, 'migration: room 2 keeps lvl3');
  approx(energyRoomOf(0), 30, 1e-6, 'room 1 keeps highest energy (capped)');
  ok(tankAtRoom(0)&&tankLvlRoom(0)===40, 'global tank became room-1 tank with its level');
  ok(!S.inv.tools.tank, 'legacy tank tool removed');
}
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
