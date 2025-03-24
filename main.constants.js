const auraMap = {
  "none": 0,
  "t1": 0.03,
  "t2": 0.05,
  "t3": 0.07,
  "t4": 0.10,
  "berserker": 0.10,
};

const specialAttackMap = {
  "none": 1,
  "dragonDagger": 1.15,
  "dragonMace": 1.25,
  "magicShortbow": 0.7
};

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
  "fire": "magic",
  "necro": "necro"
};

const leechMap = {
  "none": 0,
  "sap": 6,
  "leech": 8,
  "turmoil": 10,
  "praesul": 12
};

const slayerMap = {
  "none": 1,
  "basic": 1.125,
  "reinforced": 1.13,
  "strong": 1.135,
  "mighty": 1.14,
  "corrupted": 1.145
};

const balmungMap = {
  "none": 0,
  "basic": 0.3,
  "upgraded": 0.45
};

const salveMap = {
  "none": 0,
  "basic": 0.15,
  "enchanted": 0.2
};

const baneMap = {
  "none": 0,
  "normal": 0.3,
  "jas": 0.2
};

const kerisMap = {
  "none": 0,
  "basic": 0.15,
  "upgraded": 0.25
};

const darklightMap = {
  "none": 0,
  "basic": 0.249,
  "upgraded": 0.349
};

const weaknessMap = {
  "melee": "magic",
  "magic": "range",
  "range": "melee"
};

const scrimshawMap = {
  "none": 0,
  "inferior": 0.02,
  "superior": 0.04
}

const potionBoostsMap = {
  // name : [mult, add, isOvl]
  "none": [0, 0, false],
  "ordinary": [0.08, 1, false],
  "super": [0.12, 2, false],
  "grand": [0.14, 2, false],
  "extreme": [0.15, 3, false],
  "supreme": [0.16, 4, false],
  "overload": [0.15, 3, true],
  "supremeOverload": [0.16, 4, true],
  "elderOverload": [0.17, 5, true]
};
