// This is the main entrypoint into the calculator. It is a single function that
// takes in a `state` object, and returns an object with that contains the
// results of the calculation. The type of the return object is given below.
// The type of the input object is defined by the contents of the variables
// provided by `ui_dataset.js`. The input object's fields are the sum of all
// fields of the provided variable. E.G. both `level` (from `playerBuffs`) and
// `curse` (from `targetDebuffs`) are fields of the input object. Also, there
// are two special fields `target` and `familiar`, whose structures are defined
// respectively in `target_dataset.js` and `familiar_dataset.js`.
//
// Return type (or null)
// ```js
// {
//   "hitchance": Number,
//   "familiar": {
//      "melee": Number,
//      "ranged": Number,
//      "magic": Number
//   }
// }
// ```
const calc = (state) => {
  // setup default return object
  const result = {
    hitchance: 0,
    familiar: {
      melee: 0,
      ranged: 0,
      magic: 0,
      same: 0 // necromancy
    }
  };

  // Base hit chance
  const finalAccuracy = calcAccuracyStat(state);
  const { finalAffinity, affinityModifier } = calcAffinity(state);
  const finalArmour = calcArmourStat(state);

  result.hitchance = Math.floor(100 * finalAccuracy / finalArmour);
  result.hitchance = Math.floor(result.hitchance * finalAffinity) * 10;

  // Base additive bonuses  
  const keris = kerisMap[state.keris];
  const nightmare = state.nightmare ? 250 : 0;

  result.hitchance += keris + nightmare;

  // Additively stacking multiplier
  const salve = salveMap[state.salve];
  const scrimshaw = scrimshawMap[state.scrimshaw];
  const nihil = state.nihil ? 50 : 0;
  const defender = state.defender ? 30 : 0;
  const voidArmor = state.voidArmor ? 30 : 0;
  const medallion = state.domMedallion ? 10 : 0;
  const dragonScimitar = state.dragonScimitar ? 250 : 0;
  const dragonSlayerGloves = state.dragonSlayerGloves ? 100 : 0;
  const additiveMultiplier = 1000 + salve + scrimshaw + nihil + defender + voidArmor + medallion + dragonScimitar + dragonSlayerGloves;

  result.hitchance = Math.floor(result.hitchance * additiveMultiplier / 1000);

  // Multiplicatively stacking multipliers
  const slayerHelm = slayerMap[state.slayerHelm];
  const specialAttack = specialAttackMap[state.specialAttack];
  const dragonBattleaxe = state.dragonBattleaxe ? 0.9 : 1;
  const salamancy = state.salamancy ? 1.15 : 1;
  const reaver = state.reaver ? 0.95 : 1;

  result.hitchance = Math.floor(result.hitchance * slayerHelm * specialAttack * dragonBattleaxe * salamancy * reaver);

  // Final additive bonuses
  const baneAmmo = baneMap[state.baneAmmo];
  const balmung = balmungMap[state.balmung];
  const darklight = darklightMap[state.darklight];
  const fulArrows = state.fulArrows ? -100 : 0;
  const wenArrows = state.wenArrows * 20;
  const reaper = state.reaperStacks;
  const hexhunter = state.hexClassWeapon && weaknessMap[state.target.combatStyle] === combatStyleMap[state.combatStyle] ? 100 : 0;

  result.hitchance += fulArrows + wenArrows + reaper + balmung + baneAmmo + darklight + hexhunter;

  // Turn into percentage
  result.hitchance /= 1000;

  // familiar accuracy
  for (const affinity of ["melee", "magic", "ranged", "same"]) {
    let baseLevel = state.familiar.levels[affinity];
    if (baseLevel <= 1) continue;
    baseLevel = Math.floor(baseLevel * (state.spiritualHealing ? 1.07 : 1));
    const baseAccuracy = 2.5 * accF(state.familiar.levels.base);
    const bonusAccuracy = accF(baseLevel) * (state.familiar.boss ? 1 : 0.5);
    const totalAccuracy = Math.floor(baseAccuracy + bonusAccuracy);

    result.familiar[affinity] = Math.floor(100 * totalAccuracy / finalArmour) * 10;
    result.familiar[affinity] = Math.floor(result.familiar[affinity] * (state.target.affinity[affinity] + affinityModifier) / 100);
    result.familiar[affinity] /= 1000;
  }

  return result;
};
