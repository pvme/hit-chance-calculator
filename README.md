# RuneScape Hit Chance Calculator
This repository contains a web-native version of the hit-chance calculator
published by the PvME Discord at
https://docs.google.com/spreadsheets/d/1X0GwTMCpCW5plaV0Gdvgw_glPlj-y-UBDiKjHmTkGBM.

## Important Note
This repo is not up to feature parity with the original spreadsheet, it's just
trying to show what's possible. That said, what features _are_ included should
match exactly with the original spreadsheet.

Missing Features:
- Probably should add hover text to the templating engine
- More input validation (like for empty text fields)
- A way to convey that something is invalid (like typing "foo" into your weapon
  tier)

## Goals
- Produce identical results to the original spreadsheet under all circumstances
- Eventually be given to the PvME GitHub for them to maintain
- Should not require creating a copy with every update
- Should be possible to host the page as a GitHub Site

## Architecture Considerations
- I've explicitly used only raw JavaScript when building this to simplify as
  much as possible the process of contributing to the calculator.
- I know not everyone is comfortable with web languages, so I've added a
  templating system to simplify the process of editing things like text and
  adding new fields or rows.

  This is contained in `ui_dataset.js`, `target_dataset.json` and
  `familiar_dataset.js`. All the data therein was scraped from the original
  spreadsheet.
- That said, this approach is fundamentally less "hackable" than spreadsheets,
  and it remains to be seen which approach the community prefers.

## Architecture Overview
### Engine
This is a standalone chunk of javascript that takes a single large object
containing all relevant information and spits out a single hit chance percentage.
It is important that this piece of code be completely isolated from the UI.

### Datasets
There are two major datasets.

#### `target_dataset.js`
Contains a huge object that maps boss names to information about them.
This object is exposed as `targetData`. Here is an example for the best boss,
Kalphite King. Note that each variant of a boss has its own entry, if
applicable.

##### Example
```json
{
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
    "curseImmune": false
  }
}
```

#### `ui_dataset.js`
This file contains two variables: `playerBuffs` and `targetDebuffs`. These
datasets are meant to facilitate creating a UI, and also define the object that
the engine takes as an argument. Both variables map an "internal" name to a
definition.

Each object in both sets represents a distinct parameter that affects hit chance.
There are 3 distinct kinds of objects. The key for the object is also the key
that should be set in the input to the engine.

Notice all the variants have:
- `text` field, which is the user-readable description
- `kind` field, which determines what kind of input it is
- optional `icon` field, if the input always uses the same icon

##### Examples
- `bool`: A simple yes or no
  ```json
  {
    "zealots": {
      "icon": "https://i.imgur.com/L6LZo4t.png",
      "text": "Zealots",
      "kind": "bool"
    }
  }
  ```
- `select`: One of a predefined list of options

  Notice that `select`s can have a separate `icons` map, if each option has a
  different icon associated with it.
  ```json lines
  {
    "potion": {
      "kind": "select",
      "text": "Potion",
      "labels": {
        "none": "None",
        "ordinary": "Ordinary",
        // ... ,
        "elderOverload": "Elder overload"
      },
      "icons": {
        "none": "https://i.imgur.com/lqBKfcq.png",
        "ordinary": "https://i.imgur.com/yrqWZbd.png",
        // ... ,
        "elderOverload": "https://i.imgur.com/ihRe9T0.png"
      }
    }
  }
  ```
- `number`: A number field
  ```json
  {
    "level": {
      "kind": "number",
      "text": "Attack/Range/Magic level",
      "icon": "https://imgur.com/OMENkUw",
      "default": 99
    }
  }
  ```

#### `familiar_dataset.js`
This file contains a variable called `familiarData` that maps familiar names to
information about them. The `base` level corresponds to the tier of weapon that
the familiar is using for the purposes of determining its accuracy.

##### Example
```json
{
  "Ripper demon": {
    "name": "Ripper demon",
    "boss": false,
    "levels": {
      "base": 99,
      "melee": 99,
      "range": 1,
      "magic": 1
    }
  }
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
- `main.constants.js`
