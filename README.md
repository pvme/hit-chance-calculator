# RuneScape Hit Chance Calculator
This repository contains a web-native version of the hit-chance calculator
published by the PVME Discord at
https://docs.google.com/spreadsheets/d/1X0GwTMCpCW5plaV0Gdvgw_glPlj-y-UBDiKjHmTkGBM.

## Important Note
This repo is not up to feature parity with the original spreadsheet, it's just
trying to show what's possible. That said, what features _are_ included should
match exactly with the original spreadsheet.

Missing Features:
- Equipment Penalty
- Familiar stuff (i.e. your familiar's hit chance)
- Probably should add hover text to the templating engine
- More input validation (like for empty text fields)
- A way to convey that something is invalid (like typing "foo" into your weapon
  tier)

## Goals
- Produce identical results to the original spreadsheet under all circumstances
- Eventually be given to the PVME github for them to maintain
- Should not require creating a copy with every update
- The page should be hostable as a GitHub Site

## Architecture Considerations
- I've explicitely used only raw JavaScript when building this to simplify as
  much as possible the process of contributing to the calculator.
- I know not everyone is comfortable with web languages, so I've added a
  templating system to simplify the process of editing things like text and
  adding new fields or rows.

  This is contained in `setup.js` and `targets.json`. All the data therein was
  scraped from the original spreadsheet.
- That said, this approach is fundamentally less "hackable" than spreadsheets,
  and it remains to be seen which approach the community prefers.

## Architecture Overview
### Engine
This is a standalone chunk of javascript that takes a single large object
containing all relevant information and spits out a single hitchance percentage.
It is important that this piece of code be completely isolated from the UI.

### Datasets
There are two major datasets.

#### `target_data.js`
Contains a huge object that maps boss names to informations about those bosses.
This object is exposed as `targetData`. Here is an example for the best boss,
Kalphite King. Note that each variant of a boss has its own entry, if
applicable.

##### Example
```js
targetData = {
  ...
  "Kalphite King (Ranged)": {
    "name": "Kalphite King (Ranged)",
    "defence": 85,
    "armour": 85,
    "weakness": "stab",
    "style": "range",
    "affinity": {
      "weakness": 60,
      "melee": 30,
      "range": 50,
      "magic": 40
    },
    "taggable": false,
    "curseImmune": false
  },
  ...
};
```

#### `ui_dataset.js`
This file contains two variables: `playerBuffs` and `targetDebuffs`. These
datasets are meant to facilitate creating a UI, and also define the object that
the engine takes as an argument. Both variables map an "internal" name to a
definition.

Each object in both sets represents a distinct paramater that affects hit chance.
There are 3 distinct kinds of objects. The key for the object is also the key
that should be set in the input to the engine.

Notice all the variants have:
- `text` field, which is the user-readable description
- `kind` field, which determines what kind of input it is
- optional `icon` field, if the input always uses the same icon

##### Examples
- `bool`: A simple yes or no
  ```js
  "zealots": {
    "icon": "https://i.imgur.com/L6LZo4t.png",
    "text": "Zealots",
    "kind": "bool",
  }
  ```
- `select`: One of a predefined list of options

  Notice that `select`s can have a separate `icons` map, if each option has a
  different icon associated with it.
  ```js
  "potion": {
    "kind": "select",
    "text": "Potion",
    "labels": {
      "none": "None",
      "ordinary": "Ordinary",
      <snip>,
      "elderOverload": "Elder overload",
    },
    "icons": {
      "none": "https://i.imgur.com/lqBKfcq.png",
      "ordinary": "https://i.imgur.com/yrqWZbd.png",
      <snip>
      "elderOverload": "https://i.imgur.com/ihRe9T0.png",
    }
  }
  ```
- `number`: A number field
  ```js
  "level": {
    "kind": "number",
    "text": "Attack/Range/Magic level",
    "icon": "https://imgur.com/OMENkUw"
    "default": 99
  }
  ```

### Default UI
This repository includes a default UI, which is dynamically generated from the
loaded datasets. This means that in the vast majority of cases, adding a new
user input should not require modifying the base UI files.

The files for this component are:
- `index.html`
- `setup_ui.js`
- `style.css`