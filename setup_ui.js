function load_change_hooks() {
  const target_elem = document.getElementById("target");
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
  target_weakness_icon.src = player_buffs.style.icons[state.target.weakness];

  const target_style = document.getElementById("target-style");
  target_style.innerText = state.target.style;
  const target_style_icon = document.getElementById("target-style-icon");
  target_style_icon.src = player_buffs.style.icons[state.target.style];

  const target_affinity_weakness = document.getElementById("target-affinity-weakness");
  target_affinity_weakness.innerText = state.target.affinity.weakness;
  const target_affinity_melee = document.getElementById("target-affinity-melee");
  target_affinity_melee.innerText = state.target.affinity.melee;
  const target_affinity_range = document.getElementById("target-affinity-range");
  target_affinity_range.innerText = state.target.affinity.range;
  const target_affinity_magic = document.getElementById("target-affinity-magic");
  target_affinity_magic.innerText = state.target.affinity.magic;

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

// returns a row object that matches the spec
function generate_input(id, spec) {
  // generate html
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
    text_cell.innerText = spec.text;
    // for initialization
    state[id] = false;
  } else if (spec.kind == "select") {
    // Create a simple dropdown
    input = document.createElement("select");
    input.id = id;
    text_cell.innerText = spec.text;
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
    text_cell.innerText = spec.text;
    // for initialization
    state[id] = spec.default;
  } else {
    console.log("unknown kind " + spec.kind);
  }

  input_cell.appendChild(input);
  row.appendChild(input_cell);

  return row
}



function load_setup_fields() {
  const buff_table_elem = document.getElementById("setup-table");
  // player_buffs loaded from setup.js
  for (let field of Object.keys(player_buffs)) {
    let row = generate_input(field, player_buffs[field]);
    buff_table_elem.appendChild(row);
  }

  const debuff_table_elem = document.getElementById("debuff-table");
  for (let field of Object.keys(target_debuffs)) {
    let row = generate_input(field, target_debuffs[field]);
    debuff_table_elem.appendChild(row);
  }

}

function init() {
  load_change_hooks();
  load_targets();
  load_setup_fields();
  target();
  calc();
}

init();
