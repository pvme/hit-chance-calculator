function accF(x) {
  return x * x * x / 1250 + x * 4 + 40;
}

function roundDown(p, x) {
  return Number((Math.floor(x * Math.pow(10, p)) / Math.pow(10, p)).toFixed(p))
}

function getPotionBoost(potion, level) {
  const [mult, add, isOverload] = potionBoostsMap[potion];

  const potionLevels = Math.floor(mult * level + add);

  return { potionLevels, isOverload };
}

function calcAccuracyStat(state) {
  const weaponBonus = Math.round(state.weaponTier < 150
    ? 2.5 * accF(state.weaponTier)
    : state.weaponTier
  );

  const trueStatLevel = getTrueStatLevel(state);
  const levelBonus = Math.floor(accF(trueStatLevel));

  const prayerBonus = getPrayerBonus(state, trueStatLevel);

  const equipmentPenalty = Math.abs(state.equipmentPenalty);

  return weaponBonus + levelBonus + prayerBonus - equipmentPenalty;
}

function getTrueStatLevel({ potion, level: skillLevel, bloodEssence, aura }) {
  const { potionLevels, isOverload } = getPotionBoost(potion, skillLevel)

  const bloodEssenceLevels = bloodEssence ? Math.floor(0.14 * skillLevel + 2) : 0;

  const berserker = (aura === "berserker") ? Math.floor(skillLevel * 0.1) : 0;

  return skillLevel + (isOverload
    ? berserker + potionLevels
    : bloodEssenceLevels + Math.max(berserker, potionLevels));
}

function getPrayerBonus({ prayer, zealots }, trueStatLevel) {
  const prayerLevels = prayerMap[prayer];

  const prayerBonus = accF(trueStatLevel + prayerLevels) - accF(trueStatLevel);

  if (zealots && ["leech", "t1", "t2", "t3"].includes(prayer)) {
    return Math.floor(prayerBonus * 1.1);
  }

  return Math.floor(prayerBonus);
}

function calcAffinity(state, hexhunter, darklight) {
  const quake = quakeMap[state.quake];
  const statius = state.statius ? 0.05 : 0;
  const bandos = state.bandos ? 0.03 : 0;
  const guthixStaff = state.guthixStaff ? 0.02 : 0;
  const dragonHatchet = state.dragonHatchet ? 0.03 : 0;
  const barrelchest = state.barrelchest ? 0.04 : 0;
  const boneDagger = state.boneDagger ? 0.02 : 0;
  const hexhunterAffinity = (hexhunter && state.target.weakness === state.style) ? 0.05 : 0;

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
  const affinityModifier = Math.min(0.10, quake + statius + bandos + guthixStaff + barrelchest + dragonHatchet + boneDagger + hexhunterAffinity);

  const finalAffinity = baseAffinity + affinityModifier;

  return { finalAffinity, affinityModifier };
}

function calcArmourStat(state) {
  const baseArmour = getBaseArmour(state.target.armour);
  const bonusArmour = getBonusArmour(state);

  // armour reduction clusterfuck

  // curses
  const curseTier = !state.target.curseImmune ? leechMap[state.curse] : 0;
  const curseDrain = curseTier * 5;

  // BSA
  const bsaDrainPerStack = Math.floor(0.0075 * baseArmour);
  const maxBsaStacks = baseArmour ? Math.ceil(0.15 * baseArmour / bsaDrainPerStack) : 0;
  const maxBsaModifier = Math.floor(maxBsaStacks * bsaDrainPerStack / 5);
  const maxBsaDrain = maxBsaModifier * 5;

  document.getElementById("blackStoneArrowStacks-text").innerText = `BSA stacks (max ${maxBsaStacks})`;

  const currentBsaStacks = Math.min(Math.max(state.blackStoneArrowStacks, 0), maxBsaStacks);
  const currentBsaModifier = Math.floor(currentBsaStacks * bsaDrainPerStack / 5);
  const currentBsaDrain = currentBsaModifier * 5;

  // lord of bones
  const lobDrainPerStack = 0.002 * baseArmour;
  const lobStacks = Math.min(Math.max(state.invokeLordOfBonesStacks, 0), 200);
  const lobDrain = lobDrainPerStack * lobStacks;

  // TODO: figure out BSA, lob, and curse drain interaction

  return baseArmour + bonusArmour - curseDrain - currentBsaDrain - lobDrain;
}

function getBaseArmour(targetArmour) {
  let baseArmour = 0;

  if (targetArmour > 150) {
    baseArmour = Math.floor(targetArmour);
  } else if (targetArmour > 0) {
    baseArmour = Math.round(2.5 * accF(targetArmour))
  }

  return baseArmour;
}

function getBonusArmour({ target: { defence }, additionalDefenceDrain, domGloves }) {
  let defenceLevel = defence;

  if (Math.abs(additionalDefenceDrain) > 1) {
    defenceLevel -= additionalDefenceDrain; // flat reduction
  } else {
    defenceLevel *= 1 - Math.abs(additionalDefenceDrain); // percentage reduction
  }

  const domGloveReduction = domGloves ? 7 : 0;
  defenceLevel -= domGloveReduction;

  return Math.floor(accF(Math.floor(defenceLevel)));
}