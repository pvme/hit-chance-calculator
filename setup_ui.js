function loadChangeHooks(cookie) {
  const targetElem = document.getElementById("target");
  if (cookie.target.name) {
    targetElem.value = cookie.target.name;
  }
  targetElem.addEventListener("change", function () {
    target();
    calc();
    writeCookie();
  });

  const familiarElem = document.getElementById("familiar");
  if (cookie.familiar.name) {
    familiarElem.value = cookie.familiar.name;
  }
  familiarElem.addEventListener("change", function () {
    familiar();
    calc();
    writeCookie();
  });

  const resetElem = document.getElementById("reset-button");
  resetElem.addEventListener("click", function () {
    clearCookie();
    location.reload();
  });
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

function loadTargets(cookie) {
  const targetElem = document.getElementById("target");
  let selected = "Araxxi";
  if (cookie.target.name) {
    selected = cookie.target.name;
  }
  for (let target of Object.keys(targetData)) {
    let opt = document.createElement("option");
    opt.value = target;
    if (target === selected) {
      opt.selected = true;
    }
    opt.innerText = target;
    targetElem.appendChild(opt);
  }
}

function loadFamiliars(cookie) {
  const familiarElem = document.getElementById("familiar");
  let selected = "Ripper demon";
  if (cookie.target.name) {
    selected = cookie.target.name;
  }
  for (let familiar of Object.keys(familiarData)) {
    let opt = document.createElement("option");
    opt.value = familiar;
    if (target === selected) {
      opt.selected = true;
    }
    opt.innerText = familiar;
    familiarElem.appendChild(opt);
  }
}

function familiar() {
  const familiarElem = document.getElementById("familiar");
  const familiar = familiarElem.value;
  // set state
  state.familiar = familiarData[familiar];
}

// returns a row object that matches the spec
function generateInput(id, spec, previous) {
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
  if (spec.kind === "bool") {
    // Create a simple button that changes color
    input = document.createElement("button");
    input.id = id;
    icon.src = spec.icon;
    textCell.innerText = spec.text;
    // for initialization
    state[id] = false;
    if (previous) {
      state[id] = previous;
    }
    input.innerText = state[id] ? "Yes": "No";
    input.style["background-color"] = state[id] ? "#47705b" : "#6c4b58";

    input.addEventListener(
      "click",
      function () {
        state[id] = !state[id];
        input.style["background-color"] = state[id] ? "#47705b" : "#6c4b58";
        input.innerText = state[id] ? "Yes" : "No";
        calc();
        writeCookie();
      }
    );
  } else if (spec.kind === "select") {
    // Create a simple dropdown
    input = document.createElement("select");
    input.id = id;
    textCell.innerText = spec.text;
    let selected = previous;
    if (!selected) {
      selected = Object.keys(spec.labels)[0];
    }
    for (let opt of Object.keys(spec.labels)) {
      let option = document.createElement("option");
      option.innerText = spec.labels[opt];
      if (opt === selected) {
        input.value = spec.labels[opt];
        option.selected = true;
      }
      input.appendChild(option);
    }
    icon.src = spec.icons ? spec.icons[selected] : spec.icon;
    input.addEventListener("change",
      function () {
        let selected;
        for (let key of Object.keys(spec.labels)) {
          if (spec.labels[key] === input.value) {
            selected = key;
          }
        }
        state[id] = selected;
        icon.src = spec.icons ? spec.icons[selected] : spec.icon;
        calc();
        writeCookie();
      }
    );
    // for initialization
    state[id] = selected;
  } else if (spec.kind === "number") {
    // Create a simple text field
    input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.size = 1;
    input.value = spec.default;
    if (previous) {
      input.value = previous;
    }
    input.addEventListener(
      "change",
      function () {
        state[id] = input.value;
        calc();
        writeCookie();
      }
    );
    icon.src = spec.icon;
    textCell.innerText = spec.text;
    // for initialization
    state[id] = input.value;
  } else {
    // console.log("unknown kind " + spec.kind);
  }

  inputCell.appendChild(input);
  row.appendChild(inputCell);

  return row
}

function loadSetupFields(cookie) {
  const buffTableElem = document.getElementById("player-buff-table");
  // playerBuffs loaded from ui_dataset.js
  for (let field of Object.keys(playerBuffs)) {
    let row = generateInput(field, playerBuffs[field], cookie[field]);
    buffTableElem.appendChild(row);
  }

  const targetDebuffTableElem = document.getElementById("target-debuff-table");
  // targetDebuffs loaded from ui_dataset.js
  for (let field of Object.keys(targetDebuffs)) {
    let row = generateInput(field, targetDebuffs[field], cookie[field]);
    targetDebuffTableElem.appendChild(row);
  }

  const playerDebuffTableElem = document.getElementById("player-debuff-table");
  // playerDebuffs loaded from ui_dataset.js
  for (let field of Object.keys(playerDebuffs)) {
    let row = generateInput(field, playerDebuffs[field], cookie[field]);
    playerDebuffTableElem.appendChild(row);
  }

  const familiarTable = document.getElementById("familiar-table");
  // familiarBuffs loaded from ui_dataset.js
  for (let field of Object.keys(familiarBuffs)) {
    let row = generateInput(field, familiarBuffs[field], cookie[field]);
    familiarTable.appendChild(row);
  }
}

function writeCookie() {
  document.cookie = JSON.stringify(state);
}

function clearCookie() {
  document.cookie = "";
}

function readCookie() {
  let cookie = {target: {}, familiar: {}};
  try {
    cookie = JSON.parse(document.cookie);
  } catch (error) {
    console.log(error);
  }
  return cookie;
}


function init() {
  let cookie = readCookie();
  loadChangeHooks(cookie);
  loadTargets(cookie);
  loadFamiliars(cookie);
  loadSetupFields(cookie);
  familiar();
  target();
  calc();
  writeCookie();
}

init();
