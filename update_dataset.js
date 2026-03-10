import fs from "fs";
// import bestiary from "./bestiary.json" with { type: "json" };
// import npcs from "./npcs.json" with { type: "json" };

const npcs = await fetch("https://chisel.weirdgloop.org/gazproj/cache/npcs.json").then(x => x.json());
const bestiary = await fetch("https://chisel.weirdgloop.org/gazproj/cache/bestiary.json").then(x => x.json());

// fs.writeFileSync("npcs.json", JSON.stringify(npcs, null, 2));
// fs.writeFileSync("bestiary.json", JSON.stringify(bestiary, null, 2));

function accF(x) {
    return x ? Math.round(x * x / 1250 + 4 * x + 40) : 0;
}

function getAffinity(extra) {
  const affinities = {
    strong: extra.weakness_modifier_strong ?? 50,
    same: extra.weakness_modifier_same ?? 60,
    weak: extra.weakness_modifier_weak ?? 70,
    weakness: extra.weakness_modifier_weakness ?? 90,
    magic: 0,
    melee: 0,
    ranged: 0
  }

  switch (extra.combat_style) {
    case 1:
      affinities.ranged = extra.weakness_modifier_strong ?? 50;
      affinities.melee = extra.weakness_modifier_same ?? 60;
      affinities.magic = extra.weakness_modifier_weak ?? 70;
      break;
    case 2:
      affinities.melee = extra.weakness_modifier_strong ?? 50;
      affinities.magic = extra.weakness_modifier_same ?? 60;
      affinities.ranged = extra.weakness_modifier_weak ?? 70;
      break;
    case 3:
      affinities.magic = extra.weakness_modifier_strong ?? 50;
      affinities.ranged = extra.weakness_modifier_same ?? 60;
      affinities.melee = extra.weakness_modifier_weak ?? 70;
      break;
    default:
      affinities.magic = extra.weakness_modifier_same ?? 60;
      affinities.melee = extra.weakness_modifier_same ?? 60;
      affinities.ranged = extra.weakness_modifier_same ?? 60;
      break;
  }

  return affinities;
}

function getCombatStyle(extra) {
  switch (extra?.combat_style) {
    case 0: return "none";
    case 1: return "melee";
    case 2: return "ranged";
    case 3: return "magic";
    case 9: return "dummy";
    case 17: return "necromancy";
    default: return "unknown";
  }
}

const npcMap = Object.fromEntries(npcs.map(npc => [npc.id, npc]));
const beastMap = Object.fromEntries(bestiary.map(beast => [beast.id, beast]))
const allIds = new Set([...Object.keys(npcMap), ...Object.keys(beastMap)]);

const monsters = [];
allIds.forEach(id => {
    const npc = npcMap[id];
    if (!npc) console.warn("Missing id in npcs.json", id);

    const beast = beastMap[id];
    if (!beast) console.warn("Missing id in bestiary.json", id);

    if (npc?.extra?.armor !== undefined && beast?.defence !== undefined) {
        monsters.push({ ...npc, ...beast })
    }
})

const mapped = monsters.map(x => ({
    name: x.name,
    id: x.id,
    combatStyle: getCombatStyle(x.extra),
    combatLevel: x.combat,
    weakness: x.weakness,
    levels: {
        attack: x.attack,
        defence: x.defence,
        magic: x.magic,
        ranged: x.ranged
    },
    affinity: getAffinity(x.extra),
    baseStats: {
        attack: x.extra?.["accuracy_melee_(npc)"],
        magic: x.extra?.accuracy_magic,
        ranged: x.extra?.accuracy_ranged,
        necromancy: x.extra?.accuracy_necromancy,
        armour: x.extra?.armor
    },
    bonusStats: {
        attack: accF(x.attack),
        armour: accF(x.defence),
        magic: accF(x.magic),
        ranged: accF(x.ranged)
    }
}));

const seen = new Set();
const unique = mapped.filter(({ name, affinity: { melee, magic, ranged, weakness }, weakness: weaknessType, baseStats, bonusStats }) => {
    const key = `${name}:${melee}:${magic}:${ranged}:${weakness}:${weaknessType}:${Object.values(baseStats).join(":")}:${Object.values(bonusStats).join(":")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});

const resolveAmbiguous = (entries, keyFn) => {
  const resolved = {};
  const remaining = [];
  Object.entries(Object.groupBy(entries, keyFn)).forEach(([key, entries]) => {
    if (entries.length === 1) resolved[key] = entries[0];
    else remaining.push(...entries);
  });
  return [resolved, remaining];
};

const results = {};

const [byName, ambiguousByName] = resolveAmbiguous(unique, x => x.name);
Object.assign(results, byName);

const [byCombatStyle, ambiguousByCombatStyle] = resolveAmbiguous(ambiguousByName, x => `${x.name} (${x.combatStyle})`);
Object.assign(results, byCombatStyle);

const [byCombatLevel, fuckTheRest] = resolveAmbiguous(ambiguousByCombatStyle, x => `${x.name} (lvl ${x.combatLevel})`);
Object.assign(results, byCombatLevel);

[
  ["Helwyr", 22438],
  ["Nakatra, Devourer Eternal", 31103],
  ["Queen Black Dragon", 15454],
  ["Skeletal horror", 9177],
  ["Tormented demon (weak to Fire)", 8349],
  ["Tormented demon (weak to Bolt)", 8358],
  ["TzKal-Zuk", 28526]
].forEach(([key, id]) => results[key] = mapped.find(x => x.id === id))

fs.writeFileSync("target_dataset.js", "targetData = " + JSON.stringify(results, null, 2));
