function loadChangeHooks() {
  const targetElem = document.getElementById("target");
  targetElem.addEventListener('change', function () { target(); calc(); });
}

function target() {
  const target = document.getElementById("target").value;
  // set state
  state.target = targetData[target];
  state.taggable = targetData[target].taggable;
  // taggable is weird because it's also an input
  const taggable = document.getElementById("taggable");
  taggable.checked = state.taggable;

  // Set ui fields
  const targetDefence = document.getElementById("target-defence");
  targetDefence.innerText = state.target.defence;

  const targetArmour = document.getElementById("target-armour");
  targetArmour.innerText = state.target.armour;

  const targetWeakness = document.getElementById("target-weakness");
  targetWeakness.innerText = state.target.weakness;
  const targetWeaknessIcon = document.getElementById("target-weakness-icon");
  targetWeaknessIcon.src = playerBuffs.style.icons[state.target.weakness];

  const targetStyle = document.getElementById("target-style");
  targetStyle.innerText = state.target.style;
  const targetStyleIcon = document.getElementById("target-style-icon");
  targetStyleIcon.src = playerBuffs.style.icons[state.target.style];

  const targetAffinityWeakness = document.getElementById("target-affinity-weakness");
  targetAffinityWeakness.innerText = state.target.affinity.weakness;
  const targetAffinityMelee = document.getElementById("target-affinity-melee");
  targetAffinityMelee.innerText = state.target.affinity.melee;
  const targetAffinityRange = document.getElementById("target-affinity-range");
  targetAffinityRange.innerText = state.target.affinity.range;
  const targetAffinityMagic = document.getElementById("target-affinity-magic");
  targetAffinityMagic.innerText = state.target.affinity.magic;

}

function loadTargets() {
  const targetElem = document.getElementById("target");
  for (let target of Object.keys(targetData)) {
    if (target == "Araxxi") {
      continue;
    }
    let opt = document.createElement("option");
    opt.value = target;
    opt.innerText = target;
    targetElem.appendChild(opt);
  }
}

// returns a row object that matches the spec
function generateInput(id, spec) {
  // generate html
  let row = document.createElement("tr");
  let iconCell = document.createElement("td");
  iconCell.className = "icon-col";
  let icon = document.createElement("img");
  iconCell.appendChild(icon);
  row.appendChild(iconCell);
  let textCell = document.createElement("td");
  row.appendChild(textCell);
  let inputCell = document.createElement("td");
  inputCell.className = "input-col";

  // TODO add null checks to fields


  let input;
  if (spec.kind == "bool") {
    // Create a simple checkbox
    input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.addEventListener(
      "change",
      function() {
        state[id] = input.checked;
        calc();
      }
    );
    icon.src = spec.icon;
    textCell.innerText = spec.text;
    // for initialization
    state[id] = false;
  } else if (spec.kind == "select") {
    // Create a simple dropdown
    input = document.createElement("select");
    input.id = id;
    textCell.innerText = spec.text;
    let selected;
    for (let opt of Object.keys(spec.labels)) {
      // first element is default
      selected = selected ? selected : opt;
      let option = document.createElement("option");
      option.innerText = spec.labels[opt];
      input.appendChild(option);
    }
    icon.src = spec.icons ? spec.icons[selected] : spec.icon;
    input.addEventListener("change",
      function() {
        let selected;
        for (let key of Object.keys(spec.labels)) {
          if (spec.labels[key] == input.value) {
            selected = key;
          }
        }
        state[id] = selected;
        icon.src = spec.icons ? spec.icons[selected] : spec.icon;
        calc();
      }
    );
    // for initialization
    state[id] = selected;
  } else if (spec.kind == "number") {
    // Create a simple text field
    input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.value = spec.default;
    input.addEventListener(
      "change",
      function() {
        state[id] = input.value;
        calc();
      }
    );
    icon.src = spec.icon;
    textCell.innerText = spec.text;
    // for initialization
    state[id] = spec.default;
  } else {
    console.log("unknown kind " + spec.kind);
  }

  inputCell.appendChild(input);
  row.appendChild(inputCell);

  return row
}



function loadSetupFields() {
  const buffTableElem = document.getElementById("setup-table");
  // playerBuffs loaded from setup.js
  for (let field of Object.keys(playerBuffs)) {
    let row = generateInput(field, playerBuffs[field]);
    buffTableElem.appendChild(row);
  }

  const debuffTableElem = document.getElementById("debuff-table");
  for (let field of Object.keys(targetDebuffs)) {
    let row = generateInput(field, targetDebuffs[field]);
    debuffTableElem.appendChild(row);
  }

}

function init() {
  loadChangeHooks();
  loadTargets();
  loadSetupFields();
  target();
  calc();
}

init();
