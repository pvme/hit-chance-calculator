playerBuffs = {
  "level": {
    "kind": "number",
    "text": "Attack/Range/Magic level",
    "icon": "./static/images/misc/combat_triangle.png",
    "default": 99
  },
  "weaponTier": {
    "kind": "number",
    "text": "Weapon (tier or value)",
    "icon": "./static/images/equipment_slots/weapon_slot.png",
    "default": 95
  },
  "style": {
    "kind": "select",
    "text": "Attack style",
    "labels": {
      "slash": "Slash",
      "stab": "Stab",
      "crush": "Crush",
      "bolt": "Bolt",
      "arrow": "Arrow",
      "thrown": "Thrown",
      "air": "Air",
      "water": "Water",
      "earth": "Earth",
      "fire": "Fire",
      "necro": "Necro"
    },
    "icons": {
      "slash": "./static/images/weaknesses/slash.png",
      "stab": "./static/images/weaknesses/stab.png",
      "crush": "./static/images/weaknesses/crush.png",
      "bolt": "./static/images/weaknesses/bolts.png",
      "arrow": "./static/images/weaknesses/arrows.png",
      "thrown": "./static/images/weaknesses/thrown.png",
      "air": "./static/images/weaknesses/air.png",
      "water": "./static/images/weaknesses/water.png",
      "earth": "./static/images/weaknesses/earth.png",
      "fire": "./static/images/weaknesses/fire.png",
      "none": "./static/images/weaknesses/none.png",
      "melee": "./static/images/combat_styles/melee.png",
      "magic": "./static/images/combat_styles/magic.png",
      "range": "./static/images/combat_styles/ranged.png",
      "necro": "./static/images/combat_styles/necromancy.png"
    }
  },
  "prayer": {
    "kind": "select",
    "icon": "./static/images/skill_icons/prayer.png",
    "text": "Prayer",
    "labels": {
      "none": "None",
      "t1": "T1 Prayer",
      "t2": "T2 Prayer",
      "t3": "T3 Prayer",
      "chivalry": "Chivalry",
      "piety": "Piety variant",
      "leech": "Leech curse",
      "turmoil": "Turmoil variant",
      "praesul": "Praesul variant"
    }
  },
  "zealots": {
    "icon": "./static/images/items/amulet_of_zealots.png",
    "text": "Zealots",
    "kind": "bool",
  },
  "potion": {
    "kind": "select",
    "text": "Potion",
    "labels": {
      "none": "None",
      "ordinary": "Ordinary",
      "super": "Super",
      "grand": "Grand",
      "extreme": "Extreme",
      "supreme": "Supreme",
      "overload": "Overload",
      "supremeOverload": "Supreme overload",
      "elderOverload": "Elder overload",
    },
    "icons": {
      "none": "./static/images/weaknesses/none.png",
      "ordinary": "./static/images/potions/combat_potion.png",
      "super": "./static/images/potions/super_warmasters_potion.png",
      "grand": "./static/images/potions/grand_attack_potion.png",
      "extreme": "./static/images/potions/extreme_battlemages_potion.png",
      "supreme": "./static/images/potions/supreme_attack_potion.png",
      "overload": "./static/images/potions/overload.png",
      "supremeOverload": "./static/images/potions/supreme_overload_potion.png",
      "elderOverload": "./static/images/potions/elder_overload_salve.png",
    }
  },
  "bloodEssence": {
    "icon": "./static/images/items/berserk_blood_essence.png",
    "text": "Berserk blood essence",
    "kind": "bool",
  },
  "aura": {
    "icon": "./static/images/equipment_slots/aura_slot.png",
    "text": "Aura",
    "kind": "select",
    "labels": {
      "none": "None",
      "t1": "3% (Tier 1)",
      "t2": "5% (Tier 2)",
      "t3": "7% (Tier 3)",
      "t4": "10% (Tier 4)",
      "berserker": "Berserker variant"
    }
  },
  "nihil": {
    "icon": "./static/images/items/shadow_nihil_pouch.png",
    "text": "Nihil",
    "kind": "bool",
  },
  "scrimshaw": {
    "icon": "./static/images/items/scrimshaw_of_attack.png",
    "text": "Accuracy scrimshaw",
    "kind": "select",
    "labels": {
      "none": "None",
      "inferior": "Inferior (2%)",
      "superior": "Superior (4%)",
    }
  },
  "voidArmor": {
    "icon": "./static/images/items/void_knight_top.png",
    "text": "Void",
    "kind": "bool",
  },
  "premierArtefact": {
    "icon": "./static/images/items/premier_artefact.png",
    "text": "Premier artefact",
    "kind": "bool",
  },
  "reaperStacks": {
    "icon": "./static/images/items/reaper_necklace.png",
    "text": "Reaper neck stacks",
    "kind": "number",
    "default": 0
  },
  "defender": {
    "icon": "./static/images/items/kalphite_defender.png",
    "text": "Defender",
    "kind": "bool",
  },
  "domMedallion": {
    "icon": "./static/images/items/extreme_dominion_medallion.png",
    "text": "Extreme dom medallion",
    "kind": "bool",
  },
  "specialAttack": {
    "icon": "./static/images/abilities/weapon_special_attack.png",
    "text": "Special attack",
    "kind": "select",
    "labels": {
      "none": "No boost",
      "dragonDagger": "Dragon dagger: +15%",
      "dragonMace": "Dragon mace: +25%",
      "magicShortbow": "Magic shortbow: -30%"
    }
  },
  "dragonBattleaxe": {
    "icon": "./static/images/items/dragon_battleaxe.png",
    "text": "Dragon battleaxe",
    "kind": "bool",
  },
  "dragonScimitar": {
    "icon": "./static/images/items/dragon_scimitar.png",
    "text": "Dragon scimitar",
    "kind": "bool",
  },
  "reaver": {
    "icon": "./static/images/items/reaver_ring.png",
    "text": "Reaver ring",
    "kind": "bool",
  },
  "slayerHelm": {
    "icon": "./static/images/items/slayer_helmet.png",
    "text": "Slayer helm/mask",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Helm (or components)",
      "reinforced": "Reinforced helm",
      "strong": "Strong helm",
      "mighty": "Mighty helm",
      "corrupted": "Corrupted helm"
    }
  },
  "salamancy": {
    "icon": "./static/images/items/necklace_of_salamancy.png",
    "text": "Necklace of Salamancy",
    "kind": "bool",
  },
  "dragonSlayerGloves": {
    "icon": "./static/images/items/dragon_slayer_gloves.png",
    "text": "Dragon slayer gloves",
    "kind": "bool",
  },
  "salve": {
    "icon": "./static/images/items/salve_amulet.png",
    "text": "Salve amulet",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "enchanted": "Enchanted"
    }
  },
  "balmung": {
    "icon": "./static/images/items/balmung.png",
    "text": "Balmung",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "upgraded": "Upgraded"
    }
  },
  "baneAmmo": {
    "icon": "./static/images/items/dragonbane_arrows.png",
    "text": "Bane ammunition",
    "kind": "select",
    "labels": {
      "none": "None",
      "normal": "Normal",
      "jas": "Jas"
    }
  },
  "fulArrows": {
    "icon": "./static/images/items/ful_arrows.png",
    "text": "Ful arrows",
    "kind": "bool",
  },
  "wenArrows": {
    "icon": "./static/images/items/wen_arrows.png",
    "text": "Wen arrow stacks",
    "kind": "number",
    "default": 0
  },
  "keris": {
    "icon": "./static/images/items/keris.png",
    "text": "Keris passive",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "upgraded": "with desert amulet 3"
    }
  },
  "darklight": {
    "icon": "./static/images/items/darklight.png",
    "text": "Anti-demon-weaponry",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "upgraded": "with DoD upgrade"
    }
  },
  "hexClassWeapon": {
    "icon": "./static/images/items/hexhunter_bow.png",
    "text": "Hexhunter/Terrasaur/Inquisitor",
    "kind": "bool",
  },
  "nightmare": {
    "icon": "./static/images/items/nightmare_gauntlets.png",
    "text": "Nightmare gauntlets",
    "kind": "bool",
  },
  "fleeting": {
    "icon": "./static/images/items/fleeting_boots.png",
    "text": "Fleeting boots",
    "kind": "bool",
  }
};

targetDebuffs = {
  "curse": {
    "icon": "./static/images/prayers/sap_melee_attack.png",
    "text": "Curse drain",
    "kind": "select",
    "labels": {
      "none": "Immune or none",
      "sap": "Sap",
      "leech": "Leech",
      "turmoil": "Turmoil variant",
      "praesul": "Praesul variant"
    }
  },
  "quake": {
    "icon": "./static/images/abilities/quake.png",
    "text": "Quake",
    "kind": "select",
    "labels": {
      "none": "None",
      "normal": "Normal",
      "ezk": "Ek-ZekKil"
    }
  },
  "statius": {
    "icon": "./static/images/items/statius_warhammer.png",
    "text": "Statius' warhammer spec",
    "kind": "bool"
  },
  "bandos": {
    "icon": "./static/images/items/illuminated_book_of_war.png",
    "text": "Bandos book",
    "kind": "bool"
  },
  "guthixStaff": {
    "icon": "./static/images/items/guthix_staff.png",
    "text": "Guthix staff spec",
    "kind": "bool"
  },
  "dragonHatchet": {
    "icon": "./static/images/items/dragon_hatchet.png",
    "text": "Dragon hatchet spec",
    "kind": "bool"
  },
  "barrelchest": {
    "icon": "./static/images/items/barrelchest_anchor.png",
    "text": "Barrelchest anchor spec",
    "kind": "bool"
  },
  "boneDagger": {
    "icon": "./static/images/items/bone_dagger.png",
    "text": "Bone dagger spec",
    "kind": "bool"
  },
  "domGloves": {
    "icon": "./static/images/items/swift_gloves.png",
    "text": "Dominion gloves",
    "kind": "bool"
  },
  "blackStoneArrowStacks": {
    "icon": "./static/images/items/black_stone_arrows.png",
    "text": "BSA stacks",
    "kind": "number",
    "default": 0
  },
  "invokeLordOfBonesStacks": {
    "icon": "./static/images/abilities/invoke_lord_of_bones.png",
    "text": "ILoB stacks (max 200)",
    "kind": "number",
    "default": 0
  },
  "additionalDefenceDrain": {
    "icon": "./static/images/prayers/sap_defence.png",
    "text": "Additional defence drain",
    "kind": "number",
    "default": 0
  }
};
playerDebuffs = {
  "equipmentPenalty": {
    "icon": "./static/images/misc/equipment_penalty.png",
    "text": "Equipment penalty",
    "kind": "number",
    "default": 0
  }
};
familiarBuffs = {
  "spiritualHealing": {
    "icon": "./static/images/abilities/spiritual_healing.png",
    "text": "Spiritual healing",
    "kind": "bool"
  }
};
