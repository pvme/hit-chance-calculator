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
//      "range": Number,
//      "magic": Number
//   }
// }
// ```
const calc = (state) => {
  // get input values
  const accuracyAura = auraMap[state.aura];
  const scrimshaw = scrimshawMap[state.scrimshaw];
  const specialAttack = specialAttackMap[state.specialAttack];
  const slayerHelm = slayerMap[state.slayerHelm];
  const salve = salveMap[state.salve];
  const balmung = balmungMap[state.balmung];
  const baneAmmo = baneMap[state.baneAmmo];
  const keris = kerisMap[state.keris];
  const darklight = darklightMap[state.darklight];
  const hexhunter = state.hexClassWeapon && weaknessMap[state.target.style] === styleMap[state.style] ? 0.1 : 0;
  const premierArtefact = state.premierArtefact && !state.target.curseImmune ? 0.2 : 0;
  const nihil = state.nihil ? 0.05 : 0;
  const voidArmor = state.voidArmor ? 0.03 : 0;
  const reaper = state.reaperStacks / 1000;
  const defender = state.defender ? 0.03 : 0;
  const medallion = state.domMedallion ? 0.01 : 0;
  const dragonBattleaxe = state.dragonBattleaxe ? 0.9 : 1;
  const reaver = state.reaver ? 0.95 : 1;
  const dragonScimitar = state.dragonScimitar ? 0.25 : 0;
  const salamancy = state.salamancy ? 1.15 : 1;
  const dragonSlayerGloves = state.dragonSlayerGloves ? 0.1 : 0;
  const fulArrows = state.fulArrows ? -0.1 : 0;
  const wenArrows = state.wenArrows * 0.02;
  const nightmare = state.nightmare ? 0.25 : 0;
  const fleeting = state.fleeting ? 0.1 : 0;

  const finalAccuracy = calcAccuracyStat(state);
  const { finalAffinity, affinityModifier } = calcAffinity(state);
  const finalArmour = calcArmourStat(state);

  // setup default return object
  let result = {
    hitchance: 0,
    familiar: {
      melee: 0,
      range: 0,
      magic: 0
    }
  };

  result.hitchance = roundDown(3,
    roundDown(3,
      roundDown(3,
        roundDown(3,
          Math.floor(100 * finalAccuracy / finalArmour) / 100 * finalAffinity
        ) +
        keris + nightmare + fleeting
      ) * (1 +
        accuracyAura +
        premierArtefact +
        nihil +
        scrimshaw +
        voidArmor +
        defender +
        medallion +
        dragonScimitar +
        dragonSlayerGloves +
        salve
      )
    ) * (
      specialAttack *
      dragonBattleaxe *
      salamancy *
      reaver *
      slayerHelm
    ) + (
      fulArrows +
      wenArrows +
      reaper +
      balmung +
      baneAmmo +
      darklight +
      hexhunter
    )
  );

  // familiar accuracy
  for (const style of ["melee", "magic", "range"]) {
    let baseLevel = state.familiar.levels[style];
    if (baseLevel <= 1) continue;
    baseLevel = Math.floor(baseLevel * (state.spiritualHealing ? 1.07 : 1));
    const baseAccuracy = 2.5 * accF(state.familiar.level.base);
    const bonusAccuracy = accF(baseLevel) * (state.familiar.boss ? 1 : 0.5);
    const totalAccuracy = Math.floor(baseAccuracy + bonusAccuracy);

    result.familiar[style] = roundDown(3, roundDown(2, totalAccuracy / finalArmour) * (state.target.affinity[style] / 100 + affinityModifier));
  }

  return result;
};
