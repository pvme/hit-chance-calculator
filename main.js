const state = { target: {} };
const prayer_map = {
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
const style_map = {
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

function acc_f(x) {
  return x*x*x / 1250 + x * 4 + 40;
}

function level_acc() {
  const level_raw = document.getElementById("level").value;
  const level = parseInt(level_raw, 10);
  // todo validate integer
  state.level = level;
  state.level_acc = Math.floor(acc_f(level));
}

function weapon_acc() {
  const tier_raw = document.getElementById("weapon-tier").value;
  state.tier = parseInt(tier_raw, 10);
}

function rounddown(p, x) {
  if (p === null) {
    p = 2;
  }
  return Number((Math.floor(x * Math.pow(10, p)) / Math.pow(10, p)).toFixed(p))
}

function calc() {
  // Roughly following Calcs sheet column C

  // calculate potion bonus
  let potion = 0; // default if no potion
  let is_overload = false;
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
      is_overload = true;
      break;
    case "supremeOverload":
      potion = 0.16 * state.level + 4;
      is_overload = true;
      break;
    case "elderOverload":
      potion = 0.17 * state.level + 5;
      is_overload = true;
      break;
  }
  console.log("potion level bonus is " + potion);

  // berserker blood essence
  const blood_essence = state.bloodEssence ? rounddown(2, 0.14 * state.level + 2) : 0;
  console.log("blood essence level bonus is " + blood_essence);

  // berserk aura initial boost
  const berserker = (state.aura == "berserker") ? state.level * 0.1 : 0;
  console.log("berserker aura level bonus is " + berserker);

  // accuracy aura boost
  const aura_map = {
    "none": 0,
    "t1": 0.03,
    "t2": 0.05,
    "t3": 0.07,
    "t4": 0.10,
    "berserker": 0.10,
  };
  const accuracy_aura = aura_map[state.aura];
  console.log("accuracy aura level bonus is " + accuracy_aura);

  // true stat level calculations
  let true_stat_level = state.level;
  if (is_overload) {
    true_stat_level += rounddown(0, blood_essence + potion);
  } else {
    true_stat_level += Math.max(rounddown(0, blood_essence), rounddown(0, potion));
  }
  console.log("true stat level is " + true_stat_level);

  // calculate prayer bonuses
  const prayer_tier = prayer_map[state.prayer];
  const prayer_bonus = Math.floor(
    (
      3*true_stat_level*true_stat_level*prayer_tier +
      3*true_stat_level*prayer_tier*prayer_tier +
      prayer_tier*prayer_tier*prayer_tier
    ) / 1250 + prayer_tier * 4
  );
  console.log("prayer acc bonus is " + prayer_bonus);

  // premier artifact
  

  // nihil
  const nihil = state.nihil ? 0.05 : 0;
  console.log("nihil bonus is " + nihil);

  // accuracy scrimshaw
  let scrimshaw = 0;
  if (state.scrimshaw == "inferior") {
    scrimshaw = 0.02;
  } else if (state.scrimshaw == "superior") {
    scrimshaw = 0.04;
  }
  console.log("accuracy scrimshaw bonus is " + scrimshaw);

  // void
  const void_armor = state.voidArmor ? 0.03 : 0;
  console.log("void bonus is " + void_armor);

  // reaper necklace

  // defender
  const defender = state.defender ? 0.03 : 0;
  console.log("defender bonus is " + defender);

  // extreme dom medallion
  const medallion = state.domMedallion ? 0.01 : 0;
  console.log("extreme dom medallion bonus is " + medallion);

  // ultimate
  const ultimate = state.ultimate ? 0.25 : 0;
  console.log("ultimate bonus is " + ultimate);
  // special attack
  let special_attack = 1;
  if (state.specialAttack) {
    // this only works if you pass the tier directly and not the accuracy
    special_attack = 1 + 0.01 * Math.max(0, true_stat_level - state.tier);
  }
  console.log("special attack bonus is " + special_attack);
  // bonus accuracy (special attack)
  
  // dragon battleaxe
  const dbattleaxe = state.dbattleaxe ? 0.9 : 1;
  console.log("dbattleaxe bonus is " + dbattleaxe);

  // reaver ring
  const reaver = state.reaver ? 0.95 : 1;
  console.log("reaver bonus is " + reaver);

  // dragon scimitar
  const dscimitar = state.dscimitar ? 0.25 : 0;
  console.log("dscimitar bonus is " + dbattleaxe);

  // break

  // slayer helm
  const slayer_map = {
    "none": 1,
    "basic": 1.125,
    "reinforced": 1.13,
    "strong": 1.135,
    "mighty": 1.14,
    "corrupted": 1.145
  };
  const slayer_helm = slayer_map[state.slayerHelm];
  console.log("slayer bonus is " + slayer_helm);

  // necklace of salamancy
  const salamancy = state.salamancy ? 1.15 : 1;
  console.log("salamancy bonus is " + salamancy);
  // dragon slayer gloves
  const dragon_slayer_gloves = state.dslayerGloves ? 0.1 : 0;
  console.log("dragon slayer gloves bonus is " + dragon_slayer_gloves);
  // salve ammy
  const salve_map = {
    "none": 0,
    "basic": 0.15,
    "enchanted": 0.2
  };
  const salve = salve_map[state.salve];
  console.log("salve bonus is " + salve);

  // balmung
  const balmung_map = {
    "none": 0,
    "basic": 0.3,
    "upgraded": 0.45
  };
  const balmung = balmung_map[state.balmung];
  console.log("balmung bonus is " + balmung);

  // bane ammo
  const bane_map = {
    "none": 0,
    "normal": 0.3,
    "jas": 0.2
  };
  const bane_ammo = bane_map[state.baneAmmo];
  console.log("bane ammo bonus is " + bane_ammo);

  // ful arrows
  const ful_arrows = state.fulArrows ? -0.1 : 0;
  console.log("ful arrows bonus is " + ful_arrows);

  // wen arrow stacks

  // keris
  const keris_map = {
    "none": 0,
    "basic": 0.15,
    "upgraded": 0.25
  };
  const keris = keris_map[state.keris];
  console.log("keris boost is " + keris);

  // anti-demon weapons
  const darklight_map = {
    "none": 0,
    "basic": 0.249,
    "upgraded": 0.349
  };
  const darklight = darklight_map[state.darklight];
  console.log("darklight boost is " + darklight);

  // hexhunter
  let hexhunter = 0;
  if (state.target.style == "magic" && state.style == "range" ||
      state.target.style == "range" && state.style == "melee" ||
      state.target.style == "melee" && state.style == "magic") {
    // TODO missing enchantment?
    hexhunter = 0.1;
  }
  console.log("hexhunter boost is " + hexhunter);

  // nightmare gauntlets
  const nightmare = state.nightmare ? 0.25 : 0;
  console.log("nightmare gauntlets boost is " + nightmare);

  // fleeting boots
  const fleeting = state.fleeting ? 0.1 : 0;
  console.log("fleeting boots boost is " + fleeting);

  // final accuracy
  const level_bonus = Math.floor(acc_f(true_stat_level));
  console.log("bonus from true stat level " + level_bonus);

  let tier_bonus = 0;
  if (state.tier < 150) {
    tier_bonus = 2.5 * acc_f(state.tier);
  } else {
    tier_bonus = state.tier;
  }
  tier_bonus = Math.round(tier_bonus);
  console.log("weapon bonus " + tier_bonus);


  const final_accuracy = level_bonus + prayer_bonus + tier_bonus;
  console.log(" ==== Final Accuracy " + final_accuracy + " ==== ");

  // target stuff
  
  // curse drain
  //
  // quake
  const quake = state.quake ? 0.02 : 0;
  console.log("quake bonus is " + quake);

  // statius
  const statius = state.statius ? 0.05 : 0;
  console.log("statius bonus is " + statius);
  // bandos
  const bandos = state.bandos ? 0.03 : 0;
  console.log("bandos bonus is " + bandos);
  // gstaff
  const gstaff = state.gstaff ? 0.02 : 0;
  console.log("gstaff bonus is " + gstaff);
  // dhatchet
  const dhatchet = state.dhatchet ? 0.03 : 0;
  console.log("dhatchet bonus is " + dhatchet);
  // barrelchest
  const barrelchest = state.barrelchest ? 0.04 : 0;
  console.log("barrelchest bonus is " + barrelchest);
  // bone dagger
  const bone_dagger = state.boneDagger ? 0.02 : 0;
  console.log("bone dagger bonus is " + bone_dagger);
  // hexhunter affinity
  const hexhunter_affinity = (hexhunter > 0) ? 0.05 : 0;
  console.log("hexhunter affinity bonus is " + hexhunter_affinity);

  let defence_level_bonus = acc_f(state.target.defence);
  if (state.target.taggable) {
    defence_level_bonus *= 0.51;
  }
  console.log("base defence level bonus " + defence_level_bonus);
  let armour_bonus = 0;
  if (state.target.armour > 100) {
    armour_bonus = state.target.armour;
  } else if (state.target.armour > 0) {
    armour_bonus = Math.round(2.5 * acc_f(state.target.armour));
  }
  console.log("armour bonus " + armour_bonus);
  const base_armour = defence_level_bonus + armour_bonus;
  console.log("base armour " + base_armour);
  let final_armour = Math.floor(base_armour);

  // defence modifier

  // dominion gloves
  const dominion_gloves = state.target.domGloves ? 7 : 0;
  console.log("dom gloves bonus " + dominion_gloves);

  // base affinity
  const affinity_map = {
    "magic": "affinityMagic",
    "melee": "affinityMelee",
    "range": "affinityRange"
  };
  let base_affinity = 0;
  if (state.style == state.target.weakness) {
    base_affinity = parseInt(state.target.affinityWeakness, 10) / 100;
  } else {
    base_affinity = parseInt(state.target[affinity_map[style_map[state.style]]], 10) / 100;
  }
  console.log("base affinity is " + base_affinity);
  let final_affinity = base_affinity + Math.min(0.10,
    quake + statius + bandos + gstaff + barrelchest + dhatchet + bone_dagger + hexhunter_affinity
  );
  console.log("final affinity is " + final_affinity);

  let final_hit_chance = rounddown(3,
    rounddown(3,
      rounddown(3,
        rounddown(3,
          rounddown(2,
            final_accuracy/final_armour
          ) * final_affinity
        ) *
        special_attack + keris + nightmare + fleeting
      ) * ( 1 +
        accuracy_aura +
        //artefact +
        nihil +
        scrimshaw +
        void_armor +
        defender +
        medallion +
        dscimitar +
        dragon_slayer_gloves +
        salve
      )
    ) * (
      //bonus_special_attack *
      dbattleaxe *
      salamancy *
      reaver *
      slayer_helm
    ) + (
      ful_arrows +
      //wen_arrows +
      ultimate +
      //Reaper_stacks +
      balmung +
      bane_ammo +
      darklight +
      hexhunter
    )
  );
  console.log("final hit chance is " + final_hit_chance);
  const final_hit_chance_elem = document.getElementById("final-hit-chance");
  final_hit_chance_elem.innerText = "Final Hit Chance: " + (final_hit_chance*100) + "%";
}


function load_change_hooks() {
  const level_elem = document.getElementById("level");
  const tier_elem = document.getElementById("weapon-tier");
  const target_elem = document.getElementById("target");

  level_elem.addEventListener('change', function () { level_acc(); calc(); });
  tier_elem.addEventListener('change', function () { weapon_acc(); calc(); });
  target_elem.addEventListener('change', function () { target(); calc(); });
}

function target() {
  const target = document.getElementById("target").value;
  // set state
  state.target = target_data[target];
  // Set ui fields
  const target_defence = document.getElementById("target-defence");
  target_defence.innerText = state.target.defence;

  const target_armour = document.getElementById("target-armour");
  target_armour.innerText = state.target.armour;

  const target_weakness = document.getElementById("target-weakness");
  target_weakness.innerText = state.target.weakness;
  const target_weakness_icon = document.getElementById("target-weakness-icon");
  target_weakness_icon.src = setup_table_raw.style.icons[state.target.weakness];

  const target_style = document.getElementById("target-style");
  target_style.innerText = state.target.style;
  const target_style_icon = document.getElementById("target-style-icon");
  target_style_icon.src = setup_table_raw.style.icons[state.target.style];

  const target_affinity_weakness = document.getElementById("target-affinity-weakness");
  target_affinity_weakness.innerText = state.target.affinityWeakness;
  const target_affinity_melee = document.getElementById("target-affinity-melee");
  target_affinity_melee.innerText = state.target.affinityMelee;
  const target_affinity_range = document.getElementById("target-affinity-range");
  target_affinity_range.innerText = state.target.affinityRange;
  const target_affinity_magic = document.getElementById("target-affinity-magic");
  target_affinity_magic.innerText = state.target.affinityMagic;

}

function load_targets() {
  const target_elem = document.getElementById("target");
  for (let target of Object.keys(target_data)) {
    if (target == "Araxxi") {
      continue;
    }
    let opt = document.createElement("option");
    opt.value = target;
    opt.innerText = target;
    target_elem.appendChild(opt);
  }
}

function select_handler(id, icon, label, input, skip) {
  let selected;
  for (let key of Object.keys(setup_table_raw[id].labels)) {
    if (setup_table_raw[id].labels[key] == input.value) {
      selected = key;
    }
  }
  state[id] = selected;
  if (icon) {
    icon.src = setup_table_raw[id].icons[selected];
  }
  if (!skip) {
    calc();
  }
}
function bool_handler(id, input, skip) {
  state[id] = input.checked;
  if (!skip) {
    calc();
  }
}

function load_setup_fields() {
  const setup_table_elem = document.getElementById("setup-table");
  // setup_table_raw loaded from setup.js
  for (let field of Object.keys(setup_table_raw)) {
    let row = document.createElement("tr");
    let icon_cell = document.createElement("td");
    icon_cell.className = "icon-col";
    let icon = document.createElement("img");
    icon_cell.appendChild(icon);
    row.appendChild(icon_cell);
    let text_cell = document.createElement("td");
    row.appendChild(text_cell);
    let input_cell = document.createElement("td");
    input_cell.className = "input-col";

    let input;
    if (setup_table_raw[field].kind == "bool") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.id = field;
      input.addEventListener("change", function() { bool_handler(field, input, false) });
      // for initialization
      bool_handler(field, input, true);
      icon.src = setup_table_raw[field].icon;
      text_cell.innerText = setup_table_raw[field].text;
    } else if (setup_table_raw[field].kind == "select") {
      input = document.createElement("select");
      input.id = field;
      text_cell.innerText = setup_table_raw[field].text;
      for (let opt of Object.keys(setup_table_raw[field].labels)) {
        let option = document.createElement("option");
        option.innerText = setup_table_raw[field].labels[opt];
        input.appendChild(option);
      }
      if (setup_table_raw[field].icon) {
        icon.src = setup_table_raw[field].icon;
        input.addEventListener("change", function() {
          select_handler(field, null, text_cell, input, false)
        });
        // run here for initialization
        select_handler(field, null, text_cell, input, true);
      } else if (setup_table_raw[field].icons) {
        input.addEventListener("change", function() {
          select_handler(field, icon, text_cell, input, false)
        });
        // run here for initialization
        select_handler(field, icon, text_cell, input, true);
      }
    }

    input_cell.appendChild(input);
    row.appendChild(input_cell);

    setup_table_elem.appendChild(row);
  }

  const debuff_table_elem = document.getElementById("debuff-table");
  for (let field of Object.keys(debuff_table_raw)) {
    let row = document.createElement("tr");
    let icon_cell = document.createElement("td");
    icon_cell.className = "icon-col";
    let icon = document.createElement("img");
    icon_cell.appendChild(icon);
    row.appendChild(icon_cell);
    let text_cell = document.createElement("td");
    row.appendChild(text_cell);
    let input_cell = document.createElement("td");
    input_cell.className = "input-col";

    let input;
    if (debuff_table_raw[field].kind == "bool") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.id = field;
      input.addEventListener("change", function() { bool_handler(field, input, false) });
      // for initialization
      bool_handler(field, input, true);
      icon.src = debuff_table_raw[field].icon;
      text_cell.innerText = debuff_table_raw[field].text;
      input_cell.appendChild(input);
      row.appendChild(input_cell);
    }


    debuff_table_elem.appendChild(row);
  }

}

function init() {
  load_change_hooks();
  load_targets();
  load_setup_fields();
  level_acc();
  weapon_acc();
  target();
  calc();
}

init();
