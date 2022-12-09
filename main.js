const state = { target: {} };
const prayerMap = {
  "none": 0,
  "t1": 2,
  "t2": 4,
  "t3": 6,
  "chivalry": 7,
  "piety": 8,
  "leech": 5,
  "turmoil": 10,
  "praesul": 12
};
const styleMap = {
  "slash": "melee",
  "stab": "melee",
  "crush": "melee",
  "thrown": "range",
  "arrow": "range",
  "bolt": "range",
  "air": "magic",
  "water": "magic",
  "earth": "magic",
  "fire": "magic"
};

function accF(x) {
  return x*x*x / 1250 + x * 4 + 40;
}

function rounddown(p, x) {
  if (p === null) {
    p = 2;
  }
  return Number((Math.floor(x * Math.pow(10, p)) / Math.pow(10, p)).toFixed(p))
}

function calc() {
  // Roughly following Calcs sheet column C
  // do some parsing
  state.level = parseInt(state.level)
  state.weaponTier = parseInt(state.weaponTier)


  // calculate potion bonus
  let potion = 0; // default if no potion
  let isOverload = false;
  switch (state.potion) {
    case "ordinary":
      potion = 0.08 * state.level + 1;
      break;
    case "super":
      potion = 0.12 * state.level + 2;
      break;
    case "grand":
      potion = 0.14 * state.level + 2;
      break;
    case "extreme":
      potion = 0.15 * state.level + 3;
      break;
    case "supreme":
      potion = 0.16 * state.level + 4;
      break;
    case "overload":
      potion = 0.15 * state.level + 3;
      isOverload = true;
      break;
    case "supremeOverload":
      potion = 0.16 * state.level + 4;
      isOverload = true;
      break;
    case "elderOverload":
      potion = 0.17 * state.level + 5;
      isOverload = true;
      break;
  }
  //console.log("potion level bonus is " + potion);

  // berserker blood essence
  const bloodEssence = state.bloodEssence ? Math.floor(0.14 * state.level + 2) : 0;
  //console.log("blood essence level bonus is " + bloodEssence);

  // berserk aura initial boost
  const berserker = (state.aura == "berserker") ? state.level * 0.1 : 0;
  //console.log("berserker aura level bonus is " + berserker);

  // accuracy aura boost
  const auraMap = {
    "none": 0,
    "t1": 0.03,
    "t2": 0.05,
    "t3": 0.07,
    "t4": 0.10,
    "berserker": 0.10,
  };
  const accuracyAura = auraMap[state.aura];
  //console.log("accuracy aura level bonus is " + accuracyAura);

  // true stat level calculations
  let trueStatLevel = state.level;
  if (isOverload) {
    trueStatLevel += Math.floor(berserker + potion);
  } else {
    trueStatLevel += bloodEssence + Math.max(Math.floor(berserker), Math.floor(potion));
  }
  //console.log("true stat level is " + trueStatLevel);

  // calculate prayer bonuses
  const prayerTier = prayerMap[state.prayer];
  let prayerBonus = Math.floor(
    (
      3*trueStatLevel*trueStatLevel*prayerTier +
      3*trueStatLevel*prayerTier*prayerTier +
      prayerTier*prayerTier*prayerTier
    ) / 1250 + prayerTier * 4
  );
  if (
    state.zealots && (
      state.prayer == "leech" ||
      state.prayer == "t1" ||
      state.prayer == "t2" ||
      state.prayer == "t3"
    )
  ) {
    prayerBonus = prayerBonus * 1.1;
  }
  //console.log("prayer acc bonus is " + prayerBonus);

  // premier artefact
  const artefact = state.artefact && !state.target.curseImmune ? 0.2 : 0;

  // nihil
  const nihil = state.nihil ? 0.05 : 0;
  //console.log("nihil bonus is " + nihil);

  // accuracy scrimshaw
  let scrimshaw = 0;
  if (state.scrimshaw == "inferior") {
    scrimshaw = 0.02;
  } else if (state.scrimshaw == "superior") {
    scrimshaw = 0.04;
  }
  //console.log("accuracy scrimshaw bonus is " + scrimshaw);

  // void
  const voidArmor = state.voidArmor ? 0.03 : 0;
  //console.log("void bonus is " + voidArmor);

  // reaper necklace
  const reaper = state.reaperStacks / 1000;

  // defender
  const defender = state.defender ? 0.03 : 0;
  //console.log("defender bonus is " + defender);

  // extreme dom medallion
  const medallion = state.domMedallion ? 0.01 : 0;
  //console.log("extreme dom medallion bonus is " + medallion);

  // ultimate
  const ultimate = state.ultimate ? 0.25 : 0;
  //console.log("ultimate bonus is " + ultimate);
  // special attack
  let specialAttack = 1;
  if (state.specialAttack) {
    // this only works if you pass the tier directly and not the accuracy
    specialAttack = 1 + 0.01 * Math.max(0, trueStatLevel - state.weaponTier);
  }
  //console.log("special attack bonus is " + specialAttack);
  // bonus accuracy (special attack)
  let addlSpecEffect = 1;
  const addlSpecEffectMap = {
    "none": 0,
    "ddagger": 0.15,
    "mshortbow": -0.3
  };
  addlSpecEffect = addlSpecEffect + addlSpecEffectMap[state.addlSpecEffect];

  // dragon battleaxe
  const dbattleaxe = state.dbattleaxe ? 0.9 : 1;
  //console.log("dbattleaxe bonus is " + dbattleaxe);

  // reaver ring
  const reaver = state.reaver ? 0.95 : 1;
  //console.log("reaver bonus is " + reaver);

  // dragon scimitar
  const dscimitar = state.dscimitar ? 0.25 : 0;
  //console.log("dscimitar bonus is " + dbattleaxe);

  // break

  // slayer helm
  const slayerMap = {
    "none": 1,
    "basic": 1.125,
    "reinforced": 1.13,
    "strong": 1.135,
    "mighty": 1.14,
    "corrupted": 1.145
  };
  const slayerHelm = slayerMap[state.slayerHelm];
  //console.log("slayer bonus is " + slayerHelm);

  // necklace of salamancy
  const salamancy = state.salamancy ? 1.15 : 1;
  //console.log("salamancy bonus is " + salamancy);
  // dragon slayer gloves
  const dragonSlayerGloves = state.dslayerGloves ? 0.1 : 0;
  //console.log("dragon slayer gloves bonus is " + dragonSlayerGloves);
  // salve ammy
  const salveMap = {
    "none": 0,
    "basic": 0.15,
    "enchanted": 0.2
  };
  const salve = salveMap[state.salve];
  //console.log("salve bonus is " + salve);

  // balmung
  const balmungMap = {
    "none": 0,
    "basic": 0.3,
    "upgraded": 0.45
  };
  const balmung = balmungMap[state.balmung];
  //console.log("balmung bonus is " + balmung);

  // bane ammo
  const baneMap = {
    "none": 0,
    "normal": 0.3,
    "jas": 0.2
  };
  const baneAmmo = baneMap[state.baneAmmo];
  //console.log("bane ammo bonus is " + baneAmmo);

  // ful arrows
  const fulArrows = state.fulArrows ? -0.1 : 0;
  //console.log("ful arrows bonus is " + fulArrows);

  // wen arrow stacks
  let wenArrowStacks = state.wenArrows;
  const wenArrows = state.ultimate ? (wenArrowStacks * 0.03) : (wenArrowStacks * 0.02);

  // keris
  const kerisMap = {
    "none": 0,
    "basic": 0.15,
    "upgraded": 0.25
  };
  const keris = kerisMap[state.keris];
  //console.log("keris boost is " + keris);

  // anti-demon weapons
  const darklightMap = {
    "none": 0,
    "basic": 0.249,
    "upgraded": 0.349
  };
  const darklight = darklightMap[state.darklight];
  //console.log("darklight boost is " + darklight);

  // hexhunter
  let hexhunter = 0;
  if (
    state.hexClassWeapon && (
      state.target.style == "magic" && styleMap[state.style] == "range" ||
      state.target.style == "range" && styleMap[state.style] == "melee" ||
      state.target.style == "melee" && styleMap[state.style] == "magic"
    )
  ) {
    // TODO missing enchantment?
    hexhunter = 0.1;
  }
  //console.log("hexhunter boost is " + hexhunter);

  // nightmare gauntlets
  const nightmare = state.nightmare ? 0.25 : 0;
  //console.log("nightmare gauntlets boost is " + nightmare);

  // fleeting boots
  const fleeting = state.fleeting ? 0.1 : 0;
  //console.log("fleeting boots boost is " + fleeting);

  // final accuracy
  const levelBonus = Math.floor(accF(trueStatLevel));
  //console.log("bonus from true stat level " + levelBonus);

  let tierBonus = 0;
  if (state.weaponTier < 150) {
    tierBonus = 2.5 * accF(state.weaponTier);
  } else {
    tierBonus = state.weaponTier;
  }
  tierBonus = Math.round(tierBonus);
  //console.log("weapon bonus " + tierBonus);


  const finalAccuracy = levelBonus + prayerBonus + tierBonus;
  console.log("==== Final Accuracy " + finalAccuracy + " ====");

  // target stuff
  //console.log("base defence level bonus " + defenceLevelBonus);
  let armourBonus = 0;
  if (state.target.armour > 100) {
    armourBonus = state.target.armour;
  } else if (state.target.armour > 0) {
    armourBonus = Math.round(2.5 * accF(state.target.armour));
  }
  armourBonus = Math.floor(armourBonus);
  //console.log("armour bonus " + armourBonus);

  // defence modifier
  let leechModifier = 0;
  // missing none override to curse drain
  const leechMap = {
    "none": 0,
    "sap": 6,
    "leech": 8,
    "turmoil": 10,
    "praesul": 12
  };
  if (!state.target.curseImmune) {
    leechModifier = leechMap[state.curse];
  }

  let bsaDrain = Math.floor(
    Math.min(
      state.blackStoneArrowStacks,
      Math.ceil(0.15 * armourBonus / Math.floor(Math.max(0.0075 * armourBonus, 1)))
    ) *
    Math.floor(0.0075 * armourBonus) / 5
  );

  let maxArmourDrain = Math.floor(
    Math.ceil(0.15 * armourBonus / Math.floor(Math.max(0.0075 * armourBonus, 1))) *
    Math.floor(0.0075 * armourBonus) / 5
  );

  const defenceModifier = Math.min(leechModifier + bsaDrain, maxArmourDrain);

  // quake
  const quake = state.quake ? 0.02 : 0;
  //console.log("quake bonus is " + quake);

  // statius
  const statius = state.statius ? 0.05 : 0;
  //console.log("statius bonus is " + statius);
  // bandos
  const bandos = state.bandos ? 0.03 : 0;
  //console.log("bandos bonus is " + bandos);
  // gstaff
  const gstaff = state.gstaff ? 0.02 : 0;
  //console.log("gstaff bonus is " + gstaff);
  // dhatchet
  const dhatchet = state.dhatchet ? 0.03 : 0;
  //console.log("dhatchet bonus is " + dhatchet);
  // barrelchest
  const barrelchest = state.barrelchest ? 0.04 : 0;
  //console.log("barrelchest bonus is " + barrelchest);
  // bone dagger
  const boneDagger = state.boneDagger ? 0.02 : 0;
  //console.log("bone dagger bonus is " + boneDagger);
  // hexhunter affinity
  const hexhunterAffinity = (hexhunter > 0) ? 0.05 : 0;
  //console.log("hexhunter affinity bonus is " + hexhunterAffinity);
  // dominion gloves
  const dominionGloves = state.domGloves ? 7 : 0;
  //console.log("dom gloves bonus " + dominionGloves);

  let defenceLevel = state.target.defence;
  // missing custom defence level modifier
  let customDefenceModifer = 0;
  if (state.addlDefDrain < 1) {
    // it's a percentage
    defenceLevel = defenceLevel * ( 1 - Math.abs(state.addlDefDrain) );
  } else {
    // it's a number of levels to drain
    defenceLevel = defenceLevel - state.addlDefDrain;
  }
  defenceLevel = defenceLevel - dominionGloves;
  let defenceLevelBonus = accF(Math.floor(defenceLevel));
  if (state.target.taggable) {
    defenceLevelBonus *= 0.51;
  }
  defenceLevelBonus = Math.floor(defenceLevelBonus);

  let defenceLevelBonusAfterDrain = defenceLevelBonus - 5 * defenceModifier - dominionGloves;

  let finalArmour = Math.floor(armourBonus + defenceLevelBonusAfterDrain);
  console.log("==== Final Armour " + finalArmour + " ====");


  // base affinity
  let baseAffinity = 0;
  if (state.style == state.target.weakness) {
    baseAffinity = parseInt(state.target.affinity.weakness, 10) / 100;
  } else {
    baseAffinity = parseInt(state.target.affinity[styleMap[state.style]], 10) / 100;
  }
  //console.log("base affinity is " + baseAffinity);
  let finalAffinity = baseAffinity + Math.min(0.10,
    quake + statius + bandos + gstaff + barrelchest + dhatchet + boneDagger + hexhunterAffinity
  );
  console.log("==== Final Affinity " + finalAffinity.toFixed(2) + " ====");

  let finalHitChance = rounddown(3,
    rounddown(3,
      rounddown(3,
        rounddown(3,
          rounddown(2,
            finalAccuracy/finalArmour
          ) * finalAffinity
        ) *
        specialAttack + keris + nightmare + fleeting // - equipmentPenalty
      ) * ( 1 +
        accuracyAura +
        artefact +
        nihil +
        scrimshaw +
        voidArmor +
        defender +
        medallion +
        dscimitar +
        dragonSlayerGloves +
        salve
      )
    ) * (
      addlSpecEffect *
      dbattleaxe *
      salamancy *
      reaver *
      slayerHelm
    ) + (
      fulArrows +
      wenArrows +
      ultimate +
      reaper +
      balmung +
      baneAmmo +
      darklight +
      hexhunter
    )
  );

  //console.log("final hit chance is " + finalHitChance);
  const finalHitChanceElem = document.getElementById("final-hit-chance");
  finalHitChanceElem.innerText = (finalHitChance*100).toFixed(2) + "%";
}

