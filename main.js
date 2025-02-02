const accF = x => {
  return x * x * x / 1250 + x * 4 + 40;
}

const roundDown = (p, x) => {
  if (p === null) {
    p = 2;
  }
  return Number((Math.floor(x * Math.pow(10, p)) / Math.pow(10, p)).toFixed(p))
}

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
  // do some parsing/validation
  state.level = Number(state.level);
  state.weaponTier = Number(state.weaponTier);
  state.wenArrows = Number(state.wenArrows);
  state.blackStoneArrowStacks = Number(state.blackStoneArrowStacks);
  state.additionalDefenceDrain = Number(state.additionalDefenceDrain);
  state.equipmentPenalty = Number(state.equipmentPenalty);
  state.reaperStacks = Number(state.reaperStacks);
  // calculate potion bonus
  const [potion, isOverload] = potionBoost(state.potion, state.level)
  // console.log("potion level bonus is " + potion);

  // berserker blood essence
  const bloodEssence = state.bloodEssence ? Math.floor(0.14 * state.level + 2) : 0;
  // console.log("blood essence level bonus is " + bloodEssence);

  // berserk aura initial boost
  const berserker = (state.aura === "berserker") ? state.level * 0.1 : 0;
  // console.log("berserker aura level bonus is " + berserker);

  const accuracyAura = auraMap[state.aura];
  // console.log("accuracy aura level bonus is " + accuracyAura);

  // true stat level calculations
  let trueStatLevel = state.level;
  if (isOverload) {
    trueStatLevel += Math.floor(berserker + potion);
  } else {
    trueStatLevel += bloodEssence + Math.max(Math.floor(berserker), Math.floor(potion));
  }
  // console.log("true stat level is " + trueStatLevel);

  // calculate prayer bonuses
  const prayerTier = prayerMap[state.prayer];
  let prayerBonus = Math.floor(
    (
      3 * Math.pow(trueStatLevel, 2) * prayerTier +
      3 * trueStatLevel * Math.pow(prayerTier, 2) +
      Math.pow(prayerTier, 3)
    ) / 1250 +
    prayerTier * 4
  );
  if (state.zealots && ["leech", "t1", "t2", "t3"].includes(state.prayer)) {
    prayerBonus = prayerBonus * 1.1;
  }
  // console.log("prayer acc bonus is " + prayerBonus);

  // premier artefact
  const premierArtefact = state.premierArtefact && !state.target.curseImmune ? 0.2 : 0;

  // nihil
  const nihil = state.nihil ? 0.05 : 0;
  // console.log("nihil bonus is " + nihil);

  // accuracy scrimshaw
  let scrimshaw = 0;
  if (state.scrimshaw === "inferior") {
    scrimshaw = 0.02;
  } else if (state.scrimshaw === "superior") {
    scrimshaw = 0.04;
  }
  // console.log("accuracy scrimshaw bonus is " + scrimshaw);

  // void
  const voidArmor = state.voidArmor ? 0.03 : 0;
  // console.log("void bonus is " + voidArmor);

  // reaper necklace
  const reaper = state.reaperStacks / 1000;

  // defender
  const defender = state.defender ? 0.03 : 0;
  // console.log("defender bonus is " + defender);

  // extreme dom medallion
  const medallion = state.domMedallion ? 0.01 : 0;
  // console.log("extreme dom medallion bonus is " + medallion);

  // bonus accuracy (special attack)
  let specialAttack = 1;

  specialAttack = specialAttack + specialAttackMap[state.specialAttack];

  // dragon battleaxe
  const dragonBattleaxe = state.dragonBattleaxe ? 0.9 : 1;
  // console.log("dragonBattleaxe bonus is " + dragonBattleaxe);

  // reaver ring
  const reaver = state.reaver ? 0.95 : 1;
  // console.log("reaver bonus is " + reaver);

  // dragon scimitar
  const dragonScimitar = state.dragonScimitar ? 0.25 : 0;
  // console.log("dragonScimitar bonus is " + dragonScimitar);

  // break

  // slayer helm
  const slayerMap = {
    "none": 1, "basic": 1.125, "reinforced": 1.13, "strong": 1.135, "mighty": 1.14, "corrupted": 1.145
  };
  const slayerHelm = slayerMap[state.slayerHelm];
  // console.log("slayer bonus is " + slayerHelm);

  // necklace of salamancy
  const salamancy = state.salamancy ? 1.15 : 1;
  // console.log("salamancy bonus is " + salamancy);
  // dragon slayer gloves
  const dragonSlayerGloves = state.dragonSlayerGloves ? 0.1 : 0;
  // console.log("dragon slayer gloves bonus is " + dragonSlayerGloves);
  // salve amulet
  const salveMap = {
    "none": 0, "basic": 0.15, "enchanted": 0.2
  };
  const salve = salveMap[state.salve];
  // console.log("salve bonus is " + salve);

  // balmung
  const balmungMap = {
    "none": 0, "basic": 0.3, "upgraded": 0.45
  };
  const balmung = balmungMap[state.balmung];
  // console.log("balmung bonus is " + balmung);

  // bane ammo
  const baneMap = {
    "none": 0, "normal": 0.3, "jas": 0.2
  };
  const baneAmmo = baneMap[state.baneAmmo];
  // console.log("bane ammo bonus is " + baneAmmo);

  // ful arrows
  const fulArrows = state.fulArrows ? -0.1 : 0;
  // console.log("ful arrows bonus is " + fulArrows);

  // wen arrow stacks
  const wenArrows = state.wenArrows * 0.03;

  // keris
  const kerisMap = {
    "none": 0, "basic": 0.15, "upgraded": 0.25
  };
  const keris = kerisMap[state.keris];
  // console.log("keris boost is " + keris);

  // anti-demon weapons
  const darklightMap = {
    "none": 0, "basic": 0.249, "upgraded": 0.349
  };
  const darklight = darklightMap[state.darklight];
  // console.log("darklight boost is " + darklight);

  // hexhunter
  let hexhunter = 0;
  const weaknessMap = {
    "melee": "magic",
    "magic": "range",
    "range": "melee"
  };
  if (state.hexClassWeapon && (weaknessMap[state.target.style] === styleMap[state.style])) {
    hexhunter = 0.1;
  }
  // console.log("hexhunter boost is " + hexhunter);

  // nightmare gauntlets
  const nightmare = state.nightmare ? 0.25 : 0;
  // console.log("nightmare gauntlets boost is " + nightmare);

  // fleeting boots
  const fleeting = state.fleeting ? 0.1 : 0;
  // console.log("fleeting boots boost is " + fleeting);

  // final accuracy
  const levelBonus = Math.floor(accF(trueStatLevel));
  // console.log("bonus from true stat level " + levelBonus);

  let tierBonus;
  if (state.weaponTier < 150) {
    tierBonus = 2.5 * accF(state.weaponTier);
  } else {
    tierBonus = state.weaponTier;
  }
  tierBonus = Math.round(tierBonus);
  // console.log("weapon bonus " + tierBonus);

  // equipment penalty
  // we take the absolute value, so we don't care if the user types plus or minus
  // a value
  const equipmentPenalty = Math.abs(state.equipmentPenalty);

  const finalAccuracy = levelBonus + prayerBonus + tierBonus - equipmentPenalty;
  // console.log("==== Final Accuracy " + finalAccuracy + " ====");

  // target stuff
  let armourBonus = 0;
  if (state.target.armour > 100) {
    armourBonus = state.target.armour;
  } else if (state.target.armour > 0) {
    armourBonus = Math.round(2.5 * accF(state.target.armour));
  }
  armourBonus = Math.floor(armourBonus);
  // console.log("armour bonus " + armourBonus);

  // defence modifier
  let leechModifier = 0;
  const leechMap = {
    "none": 0, "sap": 6, "leech": 8, "turmoil": 10, "praesul": 12
  };
  if (!state.target.curseImmune) {
    leechModifier = leechMap[state.curse];
  }

  // black stone arrow drain
  const bsaDrain = Math.floor(state.blackStoneArrowStacks * Math.floor(0.0075 * armourBonus) / 5);

  // invoke lord of bones drain
  const ilobDrain = Math.floor(state.invokeLordOfBonesStacks * Math.floor(0.002 * armourBonus) / 5);

  const defenceModifier = leechModifier + bsaDrain + ilobDrain;

  // quake
  const quake = state.quake ? 0.02 : 0;
  // console.log("quake bonus is " + quake);

  // statius
  const statius = state.statius ? 0.05 : 0;
  // console.log("statius bonus is " + statius);
  // bandos
  const bandos = state.bandos ? 0.03 : 0;
  // console.log("bandos bonus is " + bandos);
  // guthixStaff
  const guthixStaff = state.guthixStaff ? 0.02 : 0;
  // console.log("guthixStaff bonus is " + guthixStaff);
  // dragonHatchet
  const dragonHatchet = state.dragonHatchet ? 0.03 : 0;
  // console.log("dragonHatchet bonus is " + dragonHatchet);
  // barrelchest
  const barrelchest = state.barrelchest ? 0.04 : 0;
  // console.log("barrelchest bonus is " + barrelchest);
  // bone dagger
  const boneDagger = state.boneDagger ? 0.02 : 0;
  // console.log("bone dagger bonus is " + boneDagger);
  // hexhunter affinity
  const hexhunterAffinity = (hexhunter && state.target.weakness === state.style) ? 0.05 : 0;
  // console.log("hexhunter affinity bonus is " + hexhunterAffinity);
  // dominion gloves
  const dominionGloves = state.domGloves ? 7 : 0;
  // console.log("dom gloves bonus " + dominionGloves);

  let defenceLevel = state.target.defence;
  // missing custom defence level modifier
  // let customDefenceModifier = 0;
  if (state.additionalDefenceDrain < 1) {
    // it's a percentage
    defenceLevel = defenceLevel * (1 - Math.abs(state.additionalDefenceDrain));
  } else {
    // it's a number of levels to drain
    defenceLevel = defenceLevel - state.additionalDefenceDrain;
  }
  defenceLevel = defenceLevel - dominionGloves;
  let defenceLevelBonus = accF(Math.floor(defenceLevel));

  defenceLevelBonus = Math.floor(defenceLevelBonus);
  // console.log("base defence level bonus " + defenceLevelBonus);

  const defenceLevelBonusAfterDrain = defenceLevelBonus - 5 * defenceModifier - dominionGloves;

  const finalArmour = Math.floor(armourBonus + defenceLevelBonusAfterDrain);
  // console.log("==== Final Armour " + finalArmour + " ====");

  // base affinity
  let baseAffinity;
  if (darklight > 0 && state.target.weakness !== "none") {
    // handle darklight overriding which affinity is used
    baseAffinity = state.target.affinity.weakness / 100;
  } else if (state.style === state.target.weakness) {
    baseAffinity = state.target.affinity.weakness / 100;
  } else if (state.style === "necro") {
    baseAffinity = state.target.affinity[state.target.style] / 100;
  } else {
    baseAffinity = state.target.affinity[styleMap[state.style]] / 100;
  }
  // console.log("base affinity is " + baseAffinity);
  const affinityModifier = Math.min(0.10, quake + statius + bandos + guthixStaff + barrelchest + dragonHatchet + boneDagger + hexhunterAffinity);
  const finalAffinity = baseAffinity + affinityModifier;
  // console.log("==== Final Affinity " + finalAffinity.toFixed(2) + " ====");

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
          roundDown(2,
            finalAccuracy / finalArmour
          ) * finalAffinity
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

  // console.log("final hit chance is " + finalHitChance);

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
