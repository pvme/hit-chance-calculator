# RuneScape Hit Chance Calculator
This repository contains a web-native version of the hit-chance calculator
published by the PVME Discord at
https://docs.google.com/spreadsheets/d/1X0GwTMCpCW5plaV0Gdvgw_glPlj-y-UBDiKjHmTkGBM.

## Important Note
This repo is not up to feature parity with the original spreadsheet, it's just
trying to show what's possible.

Also the code can use a lot cleanup. As of right now this is just a proof of
concept.

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
