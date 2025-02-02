// setup subfields so that null checks can avoid checking for these
let state = {target: {}, familiar: {}};

const assignInnerText = (id, val) => {
  document.getElementById(id).innerText = val;
};


// load change hooks for the non-auto-generated UI elements:
// - target filter
// - familiar dropdown
// - reset button
const loadChangeHooks = localStorageState => {
  // set up so that when a user clicks into or out of the filter field
  // the list appears and disappears
  const searchBox = document.getElementById("target-filter");
  const targetRow = document.getElementById("target-wrapper");
  searchBox.addEventListener("focus", () => {
    // this just resets the list, since on focus the search is empty
    filterTargetList();
    targetRow.style.display = "block";
  });
  searchBox.addEventListener("blur", () => {
    // clear the search
    searchBox.value = "";
    targetRow.style.display = "none";
  });

  // hook into the familiar select
  const familiarElem = document.getElementById("familiar");
  familiarElem.addEventListener("change", calcWrapper);

  // hook into reset button
  // TODO is there a better way to achieve a reset without a reload?
  const resetElem = document.getElementById("reset-button");
  resetElem.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  // hook into export button
  const exportElem = document.getElementById("export-button");
  exportElem.addEventListener("click", () => {
    const outputState = stripDefaults(state);
    let output = "https://" + window.location.host + window.location.pathname + "?";
    for (let key of Object.keys(outputState)) {
      output = output + "&" + key + "=" + encodeURIComponent(outputState[key]);
    }

    // TODO: Show success/error popup
    navigator.clipboard.writeText(output).then(
      () => {
        // Success
        console.log(output)
      },
      () => {
        // Failure
      });
  });
}

// Fetches the current value of the "target" label, and uses that to set
// all the appropriate state fields. It also sets UI elements based on
// the contents of the targetData dataset.
const target = () => {
  const targetLabel = document.getElementById("target").innerText;

  // set state
  state.target = targetData[targetLabel];

  // Set ui fields
  assignInnerText("target-defence", state.target.defence);
  assignInnerText("target-armour", state.target.armour);

  assignInnerText("target-weakness", state.target.weakness);
  document.getElementById("target-weakness-icon").src = playerBuffs.style.icons[state.target.weakness];
  assignInnerText("target-style", state.target.style);
  document.getElementById("target-style-icon").src = playerBuffs.style.icons[state.target.style];

  assignInnerText("target-affinity-weakness", state.target.affinity.weakness);
  assignInnerText("target-affinity-melee", state.target.affinity.melee);
  assignInnerText("target-affinity-range", state.target.affinity.range);
  assignInnerText("target-affinity-magic", state.target.affinity.magic);
}

// Change the "display" style on list elements according to the current value
// of the "target-filter" input element.
const filterTargetList = () => {
  const targetList = document.getElementById("target-list");
  const searchBox = document.getElementById("target-filter");

  // Get the search query
  const query = searchBox.value;
  const queryWords = query.split(" ").map(word => word.toLowerCase());

  // Filter the options based on the query
  Array.from(targetList.childNodes).filter(target => {
    // Convert the option to lower case for case-insensitive matching
    const targetLower = target.innerText.toLowerCase();

    // Check if each query word is included in the option
    const isMatch = queryWords.every(queryWord => targetLower.indexOf(queryWord) >= 0);

    target.style.display = isMatch ? "list-item" : "none";
  });
}

// Populates the `target-list` element with `<li>`s according to the contents
// of the `targetData` dataset. This is only run once per page load, and also
// handles loading the target from a `localStorageState` if present;
const loadTargets = localStorageState => {
  // grab references to the target related elements
  // table row element that holds the whole thing
  const targetList = document.getElementById("target-list");
  // input element that stores the filter
  const searchBox = document.getElementById("target-filter");
  // label element that displays the currently selected target
  const targetLabel = document.getElementById("target");

  // TODO use the first element of targetData as the default instead
  let selected = "Araxxi";
  // load previous value from localStorageState if applicable
  if (localStorageState.target) {
    selected = localStorageState.target;
    state.target = targetData[selected];
  }
  targetLabel.innerText = selected;

  // list of all the "<li>" elements
  const targets = [];
  for (let target of Object.keys(targetData)) {
    const opt = document.createElement("li");
    opt.innerText = target;
    opt.addEventListener("mousedown", () => {
      targetLabel.innerText = target;
      searchBox.value = "";
      window.scrollBy(0, -20000);

      calcWrapper();
    });
    targets.push(opt);
    targetList.appendChild(opt);
  }

  // detect enter and assume you're picking the top visible item
  searchBox.addEventListener("keydown", e => {
    if (e.key === 'Enter' || e.code === 'Enter') {
      const topItem = targets.find(target => target.style.display === "list-item");
      if (topItem) {
        searchBox.value = "";
        targetLabel.innerText = topItem.innerText;
        searchBox.blur();

        calcWrapper();
      }
    }
  });

  // Listen for changes to the search box
  searchBox.addEventListener("input", () => {
    filterTargetList();
  });
}

// Load familiars from the familiarData dataset. Also handles loading the
// familiar from a localStorageState if present.
const loadFamiliars = localStorageState => {
  const familiarElem = document.getElementById("familiar");
  // TODO use the first element of familiarData as the default instead
  let selected = "Ripper demon";
  if (localStorageState.familiar) {
    selected = localStorageState.familiar;
    state.familiar = familiarData[selected];
  }
  for (let familiar of Object.keys(familiarData)) {
    const opt = document.createElement("option");
    opt.value = familiar;
    if (familiar === selected) {
      opt.selected = true;
    }
    opt.innerText = familiar;
    familiarElem.appendChild(opt);
  }
}

// Fetches the current value of the "familiar" label, and uses that to set
// all the appropriate state fields. It also sets UI elements based on
// the contents of the familiarData dataset.
const familiar = () => {
  const familiarElem = document.getElementById("familiar");
  state.familiar = familiarData[familiarElem.value];
}

// Generate a row object HTML that matches the spec provided
//
// `id` is the key in the state object that the input will assign values to
// `spec` is the object specification for this input
// `previous` is a (possibly null) value that we've determined was set before
//
// returns the generated table row element
const generateInput = (id, spec, previous) => {
  // generate html
  const row = document.createElement("tr");
  const iconCell = document.createElement("td");
  iconCell.className = "icon-col";
  const icon = document.createElement("img");
  iconCell.appendChild(icon);
  row.appendChild(iconCell);
  const textCell = document.createElement("td");
  row.appendChild(textCell);
  const inputCell = document.createElement("td");
  inputCell.className = "input-col";

  // null checks are handled by the calculator
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
    input.innerText = state[id] ? "Yes" : "No";
    input.style["background-color"] = state[id] ? "#47705b" : "#6c4b58";

    input.addEventListener(
      "click",
      () => {
        state[id] = !state[id];
        input.style["background-color"] = state[id] ? "#47705b" : "#6c4b58";
        input.innerText = state[id] ? "Yes" : "No";

        calcWrapper();
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
      const option = document.createElement("option");
      option.innerText = spec.labels[opt];
      if (opt === selected) {
        input.value = spec.labels[opt];
        option.selected = true;
      }
      input.appendChild(option);
    }
    icon.src = spec.icons ? spec.icons[selected] : spec.icon;
    input.addEventListener("change",
      () => {
        let selected;
        for (let key of Object.keys(spec.labels)) {
          if (spec.labels[key] === input.value) {
            selected = key;
          }
        }
        state[id] = selected;
        icon.src = spec.icons ? spec.icons[selected] : spec.icon;

        calcWrapper();
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
      () => {
        state[id] = parseInt(input.value);

        calcWrapper();
      }
    );
    icon.src = spec.icon;
    textCell.innerText = spec.text;
    // for initialization
    state[id] = parseInt(input.value);
  } else {
    // console.log("unknown kind " + spec.kind);
  }

  inputCell.appendChild(input);
  row.appendChild(inputCell);

  return row
}

// First load target/familiar information for the selected target into the UI
// and state, then take the result from the calc function and apply it to the
// right labels
//
// NB this also saves the state, since in calcWrapper is always called right
//    after something in the UI has been changed, and therefore should be saved
const calcWrapper = () => {
  familiar();
  target();

  const result = calc(state);
  writeLocalStorage();

  assignInnerText("final-hit-chance", (result.hitchance * 100).toFixed(2) + "%");

  // familiar accuracy
  assignInnerText("familiar-melee", (result.familiar.melee * 100).toFixed(2) + "%");
  assignInnerText("familiar-range", (result.familiar.range * 100).toFixed(2) + "%");
  assignInnerText("familiar-magic", (result.familiar.magic * 100).toFixed(2) + "%");
}

// Load all the setup fields from the objects provided by ui_dataset.js
// The objects are organized into these groups in the data, but there's
// no strict requirement for that. It's purely a way to organize the data
// visually.
const loadSetupFields = localStorageState => {
  const buffTableElem = document.getElementById("player-buff-table");
  // playerBuffs loaded from ui_dataset.js
  for (let field of Object.keys(playerBuffs)) {
    const row = generateInput(field, playerBuffs[field], localStorageState[field]);
    buffTableElem.appendChild(row);
  }

  const targetDebuffTableElem = document.getElementById("target-debuff-table");
  // targetDebuffs loaded from ui_dataset.js
  for (let field of Object.keys(targetDebuffs)) {
    const row = generateInput(field, targetDebuffs[field], localStorageState[field]);
    targetDebuffTableElem.appendChild(row);
  }

  const playerDebuffTableElem = document.getElementById("player-debuff-table");
  // playerDebuffs loaded from ui_dataset.js
  for (let field of Object.keys(playerDebuffs)) {
    const row = generateInput(field, playerDebuffs[field], localStorageState[field]);
    playerDebuffTableElem.appendChild(row);
  }

  const familiarTable = document.getElementById("familiar-table");
  // familiarBuffs loaded from ui_dataset.js
  for (let field of Object.keys(familiarBuffs)) {
    const row = generateInput(field, familiarBuffs[field], localStorageState[field]);
    familiarTable.appendChild(row);
  }
}

const writeLocalStorage = () => {
  // don't save the full familiar/target data so it gets reloaded
  // create a copy
  let outputState = JSON.parse(JSON.stringify(state));
  outputState.target = outputState.target.name;
  outputState.familiar = outputState.familiar.name;
  localStorage.setItem("state", JSON.stringify(outputState));
}

// modified from javascript.info/localStorageState
// returns the localStorageState with the given name, or undefined if not found
const readLocalStorage = () => {
  const localStorageState = localStorage.getItem("state");
  return localStorageState ? JSON.parse(localStorageState) : {};
}

// older versions of this code used cookies instead of localstorage, so this
// function cleans that up
const cleanupOldCookies = () => {
  // thankfully we only ever used 2 cookies, "state" and the anonymous one
  document.cookie = "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "state=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// try to parse query parameters into a state variable, return null if not found
const parseQueryParameters = () => {
  const rawQueryParams = window.location.search;
  if (rawQueryParams === "") {
    // no query provided
    return null;
  }
  // strip initial ?& and split params
  const queryParams = rawQueryParams.substring(2).split("&");
  if (queryParams.length === 0) {
    return null;
  }
  let state = {};
  for (let param of queryParams) {
    let [field, value] = param.split("=");
    state[field] = decodeURIComponent(value);
  }
  // clear parameters
  console.log("setting url to " + window.location.pathname);
  window.history.replaceState({}, document.title, window.location.pathname);
  return state;
}

// remove all fields that have the default value, and turn target and familiar
// into just their names
const stripDefaults = state => {
  // create a copy
  let outputState = JSON.parse(JSON.stringify(state));

  // use the playerBuffs, playerDebuffs, and targetDebuffs objects as
  // the reference for what "default" means
  const stripDefaultsInner = source => {
    for (let field of Object.keys(source)) {
      if (source[field].kind === "bool") {
        // all bools default to false
        if (!outputState[field]) {
          delete outputState[field];
        }
      } else if (source[field].kind === "number") {
        // default is part of the buff definition
        if (outputState[field] === source[field].default) {
          delete outputState[field];
        }
      } else if (source[field].kind === "select") {
        // default is the first option
        const firstKey = Object.keys(source[field].labels)[0];
        if (outputState[field] === firstKey) {
          delete outputState[field];
        }
      }
    }
  };

  stripDefaultsInner(playerBuffs);
  stripDefaultsInner(playerDebuffs);
  stripDefaultsInner(targetDebuffs);
  stripDefaultsInner(familiarBuffs);

  // save target and familiar as just their names
  outputState.target = outputState.target.name;
  outputState.familiar = outputState.familiar.name;
  if (outputState.target === Object.keys(targetData)[0]) {
    delete outputState.target;
  }
  if (outputState.familiar === Object.keys(familiarData)[0]) {
    delete outputState.familiar;
  }

  return outputState;
}

const init = () => {
  cleanupOldCookies();
  const localStorageState = readLocalStorage();
  const queryState = parseQueryParameters();
  const initState = queryState ? queryState : localStorageState;
  loadChangeHooks(initState);
  loadTargets(initState);
  loadFamiliars(initState);
  loadSetupFields(initState);
  calcWrapper(state);
}

init();
