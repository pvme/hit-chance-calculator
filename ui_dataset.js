playerBuffs = {
  "level": {
    "kind": "number",
    "text": "Attack/Range/Magic level",
    "icon": "https://i.imgur.com/OMENkUw.png",
    "default": 99
  },
  "weaponTier": {
    "kind": "number",
    "text": "Weapon (tier or value)",
    "icon": "https://i.imgur.com/omyAKio.png",
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
      "fire": "Fire"
    },
    "icons": {
      "slash": "https://i.imgur.com/zzymcD6.png",
      "stab": "https://i.imgur.com/bx3XKqv.png",
      "crush": "https://i.imgur.com/2UODvCD.png",
      "bolt": "https://i.imgur.com/e0Pzpq7.png",
      "arrow": "https://i.imgur.com/7XTWxTq.png",
      "thrown": "https://i.imgur.com/qtWu017.png",
      "air": "https://i.imgur.com/nPnWOaE.png",
      "water": "https://i.imgur.com/DzyLkwu.png",
      "earth": "https://i.imgur.com/0egjKRC.png",
      "fire": "https://i.imgur.com/MXJKm2l.png",
      "none": "https://i.imgur.com/lqBKfcq.png",
      "melee": "https://i.imgur.com/L0Q7lvp.png",
      "magic": "https://i.imgur.com/CUfucnB.png",
      "range": "https://i.imgur.com/m2sNR7s.png"
    }
  },
  "prayer": {
    "kind": "select",
    "icon": "https://i.imgur.com/1h2rWwG.png",
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
    "icon": "https://i.imgur.com/L6LZo4t.png",
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
      "none": "https://i.imgur.com/lqBKfcq.png",
      "ordinary": "https://i.imgur.com/yrqWZbd.png",
      "super": "https://i.imgur.com/0gJiHwI.png",
      "grand": "https://i.imgur.com/y6I8v9v.png",
      "extreme": "https://i.imgur.com/ZK29lzL.png",
      "supreme": "https://i.imgur.com/wUDIi7C.png",
      "overload": "https://i.imgur.com/I3ipOwO.png",
      "supremeOverload": "https://i.imgur.com/HxBtAPi.png",
      "elderOverload": "https://i.imgur.com/ihRe9T0.png",
    }
  },
  "bloodEssence": {
    "icon": "https://i.imgur.com/BtWlsRD.png",
    "text": "Berserk blood essence",
    "kind": "bool",
  },
  "aura": {
    "icon": "https://i.imgur.com/Ltq5c7K.png",
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
    "icon": "https://i.imgur.com/9zQcO0U.png",
    "text": "Nihil",
    "kind": "bool",
  },
  "scrimshaw": {
    "icon": "https://i.imgur.com/gPd2alq.png",
    "text": "Accuracy scrimshaw",
    "kind": "select",
    "labels": {
      "none": "None",
      "inferior": "Inferior (2%)",
      "superior": "Superior (4%)",
    }
  },
  "voidArmor": {
    "icon": "https://i.imgur.com/bNs2Tlm.png",
    "text": "Void",
    "kind": "bool",
  },
  "premier": {
    "icon": "https://i.imgur.com/Ord0GRo.png",
    "text": "Permier artefact",
    "kind": "bool",
  },
  "reaperStacks": {
    "icon": "https://i.imgur.com/WS5NjE1.png",
    "text": "Reaper neck stacks",
    "kind": "number",
    "default": 0
  },
  "defender": {
    "icon": "https://i.imgur.com/fEa81RM.png",
    "text": "Defender",
    "kind": "bool",
  },
  "domMedallion": {
    "icon": "https://i.imgur.com/pkC0oWU.png",
    "text": "Extreme dom medallion",
    "kind": "bool",
  },
  "ultimate": {
    "icon": "https://i.imgur.com/fDgScdL.png",
    "text": "Ultimate ability",
    "kind": "bool",
  },
  "specialAttack": {
    "icon": "https://i.imgur.com/OcoXcJa.png",
    "text": "Special attack",
    "kind": "bool",
  },
  "addlSpecEffect": {
    "icon": "https://i.imgur.com/ZHSbeKk.png",
    "text": "Additional spec effect",
    "kind": "select",
    "labels": {
      "none": "None",
      "ddagger": "Dragon dagger: +15%",
      "mshortbow": "Magic shortbow: -30%"
    }
  },
  "dbattleaxe": {
    "icon": "https://i.imgur.com/Iaalj9F.png",
    "text": "Dragon battleaxe",
    "kind": "bool",
  },
  "dscimitar": {
    "icon": "https://i.imgur.com/pq2ySzz.png",
    "text": "Dragon scimitar",
    "kind": "bool",
  },
  "reaver": {
    "icon": "https://i.imgur.com/efeIB9q.png",
    "text": "Reaver ring",
    "kind": "bool",
  },
  "slayerHelm": {
    "icon": "https://i.imgur.com/abFTgdp.png",
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
    "icon": "https://i.imgur.com/qqDfvWU.png",
    "text": "Necklace of Salamancy",
    "kind": "bool",
  },
  "dslayerGloves": {
    "icon": "https://i.imgur.com/5Bz6fMo.png",
    "text": "Dragon slayer gloves",
    "kind": "bool",
  },
  "salve": {
    "icon": "https://i.imgur.com/XmRqNjT.png",
    "text": "Salve amulet",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "enchanted": "Enchanted"
    }
  },
  "balmung": {
    "icon": "https://i.imgur.com/A5vCyd5.png",
    "text": "Balmung",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "upgraded": "Upgraded"
    }
  },
  "baneAmmo": {
    "icon": "https://i.imgur.com/b3wbLzo.png",
    "text": "Bane ammunition",
    "kind": "select",
    "labels": {
      "none": "None",
      "normal": "Normal",
      "jas": "Jas"
    }
  },
  "fulArrows": {
    "icon": "https://i.imgur.com/RyRtatn.png",
    "text": "Ful arrows",
    "kind": "bool",
  },
  "wenArrows": {
    "icon": "https://i.imgur.com/1PjsMTL.png",
    "text": "Wen arrow stacks",
    "kind": "number",
    "default": 0
  },
  "keris": {
    "icon": "https://i.imgur.com/vYjDigU.png",
    "text": "Keris",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "upgraded": "with desert ammy 3"
    }
  },
  "darklight": {
    "icon": "https://i.imgur.com/i7M3ItL.png",
    "text": "Anti-demon-weaponry",
    "kind": "select",
    "labels": {
      "none": "None",
      "basic": "Yes",
      "upgraded": "with DoD upgrade"
    }
  },
  "hexClassWeapon": {
    "icon": "https://i.imgur.com/IsiOVVb.png",
    "text": "Hexhunter/Terrasaur/Inquisitor",
    "kind": "bool",
  },
  "nightmare": {
    "icon": "https://i.imgur.com/WhE0Wjx.png",
    "text": "Nightmare gauntlets",
    "kind": "bool",
  },
  "fleeting": {
    "icon": "https://i.imgur.com/A2Ic69I.png",
    "text": "Fleeting boots",
    "kind": "bool",
  }
};

targetDebuffs = {
  "curse": {
    "icon": "https://i.imgur.com/5yCfPbD.png",
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
  "taggable": {
    "icon": "",
    "text": "Taggable",
    "kind": "bool"
  },
  "quake": {
    "icon": "https://i.imgur.com/vV5WjP5.png",
    "text": "Quake",
    "kind": "bool"
  },
  "statius": {
    "icon": "https://i.imgur.com/OvV3fJi.png",
    "text": "Statius warhammer",
    "kind": "bool"
  },
  "bandos": {
    "icon": "https://i.imgur.com/jebGMZf.png",
    "text": "Bandos book",
    "kind": "bool"
  },
  "gstaff": {
    "icon": "https://i.imgur.com/InOn8Pg.png",
    "text": "Guthix staff",
    "kind": "bool"
  },
  "dhatchet": {
    "icon": "https://i.imgur.com/FVIJG2X.png",
    "text": "Dragon hatchet spec",
    "kind": "bool"
  },
  "barrelchest": {
    "icon": "https://i.imgur.com/ul3D4DI.png",
    "text": "Barrelchest anchor spec",
    "kind": "bool"
  },
  "boneDagger": {
    "icon": "https://i.imgur.com/iTUQ8cz.png",
    "text": "Bone dagger spec",
    "kind": "bool"
  },
  "domGloves": {
    "icon": "https://i.imgur.com/f5PPj2V.png",
    "text": "Dominion gloves drain",
    "kind": "bool"
  },
  "blackStoneArrowStacks": {
    "icon": "https://i.imgur.com/kYQyldo.png",
    "text": "Black stone arrow stacks",
    "kind": "number",
    "default": 0
  },
  "addlDefDrain": {
    "icon": "https://i.imgur.com/PiLPIOl.png",
    "text": "Additional def drain",
    "kind": "number",
    "default": 0
  }
};
