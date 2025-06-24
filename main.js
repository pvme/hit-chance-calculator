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
  const hexhunter = (state.hexClassWeapon && (weaknessMap[state.target.style] === styleMap[state.style])) ? 0.1 : 0;
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
  // melee
  if (state.familiar.levels.melee > 1) {
    let meleeLevel = state.familiar.levels.melee;
    meleeLevel = Math.floor(meleeLevel * (state.spiritualHealing ? 1.07 : 1));
    const meleeAccuracy = Math.floor(
      2.5 * accF(state.familiar.levels.base) +
      (state.familiar.boss ? accF(meleeLevel) : (0.5 * accF(meleeLevel)))
    );

    result.familiar.melee = roundDown(3,
      roundDown(2, meleeAccuracy / finalArmour) *
      (state.target.affinity.melee / 100 + affinityModifier)
    );

    if (state.familiar.name === "Ripper demon" && state.target.name === "Raksha") {
      result.familiar.melee = 1; // huh?
    }
  }

  // range
  if (state.familiar.levels.range > 1) {
    let rangeLevel = state.familiar.levels.range;
    rangeLevel = Math.floor(rangeLevel * (state.spiritualHealing ? 1.07 : 1));
    const rangeAccuracy = Math.floor(
      2.5 * accF(state.familiar.levels.base) +
      (state.familiar.boss ? accF(rangeLevel) : (0.5 * accF(rangeLevel)))
    );

    result.familiar.range = roundDown(3,
      roundDown(2, rangeAccuracy / finalArmour) *
      (state.target.affinity.range / 100 + affinityModifier)
    );
  }

  // magic
  if (state.familiar.levels.magic > 1) {
    let magicLevel = state.familiar.levels.magic;
    magicLevel = Math.floor(magicLevel * (state.spiritualHealing ? 1.07 : 1));
    const magicAccuracy = Math.floor(
      2.5 * accF(state.familiar.levels.base) +
      (state.familiar.boss ? accF(magicLevel) : (0.5 * accF(magicLevel)))
    );

    result.familiar.magic = roundDown(3,
      roundDown(2, magicAccuracy / finalArmour) *
      (state.target.affinity.magic / 100 + affinityModifier)
    );
  }

  return result;
}